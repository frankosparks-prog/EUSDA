import React, { useEffect, useState } from "react";
import axios from "axios";
import { Loader, FileDown } from "lucide-react";
import { exportRegistrationsPdf } from "./registrations/utils/pdfUtils";
import DeleteActionButton from "./registrations/components/DeleteActionButton";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

function MinistryMembers() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMinistry, setSelectedMinistry] = useState("");

  const ministries = [
    "Revelation of Love Ministry",
    "Heavenly Voyagers",
    "Calvary Ministers",
  ];

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await axios.get(`${SERVER_URL}/api/joinMinistry`);
        setMembers(res.data);
      } catch (err) {
        console.error("Failed to fetch ministry members", err);
        setError("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  const handleDelete = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this entry?"
    );
    if (!confirm) return;

    try {
      await axios.delete(`${SERVER_URL}/api/joinMinistry/${id}`);
      setMembers((prev) => prev.filter((member) => member._id !== id));
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete. Please try again.");
    }
  };

  // Filtered members based on search + ministry filter
  const filteredMembers = members.filter((member) => {
    const matchesName = member.fullName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesMinistry = selectedMinistry
      ? member.ministry === selectedMinistry
      : true;
    return matchesName && matchesMinistry;
  });

  const getMinistryBadgeClass = (min) => {
    switch (min) {
      case "Revelation of Love Ministry":
        return "bg-rose-50/60 text-rose-700 border-rose-100/80";
      case "Heavenly Voyagers":
        return "bg-purple-50/60 text-purple-700 border-purple-100/80";
      case "Calvary Ministers":
        return "bg-amber-50/60 text-amber-700 border-amber-100/80";
      default:
        return "bg-slate-50/60 text-slate-700 border-slate-100/80";
    }
  };

  const getMinistryDotClass = (min) => {
    switch (min) {
      case "Revelation of Love Ministry":
        return "bg-rose-500";
      case "Heavenly Voyagers":
        return "bg-purple-500";
      case "Calvary Ministers":
        return "bg-amber-500";
      default:
        return "bg-slate-500";
    }
  };

  const handleExportPdf = async () => {
    try {
      const dateStr = new Date().toLocaleDateString();
      const ministryLabel = selectedMinistry || "All Ministries";

      await exportRegistrationsPdf({
        title: "Ministry Members Registration List",
        meta: `Ministry: ${ministryLabel}    Generated: ${dateStr}    Total: ${filteredMembers.length}`,
        columns: ["S/N", "Full Name", "Phone", "Ministry", "Email", "Reason"],
        rows: filteredMembers.map((member, index) => [
          index + 1,
          member.fullName,
          member.phoneNumber,
          member.ministry,
          member.email || "—",
          member.reason || "—",
        ]),
        columnStyles: {
          0: { cellWidth: 30 },
          1: { cellWidth: 100 },
          2: { cellWidth: 80 },
          3: { cellWidth: 110 },
          4: { cellWidth: 110 },
          5: { cellWidth: 85 },
        },
        filename: `Ministry_Members_${selectedMinistry ? selectedMinistry.replace(/\s+/g, "_") : "All"
          }.pdf`,
      });
    } catch (err) {
      console.error("Export PDF failed:", err);
      alert("Failed to generate PDF. See console for details.");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold text-green-900 flex items-center gap-2 tracking-tight">
          Ministry Members
        </h1>

        <button
          onClick={handleExportPdf}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 hover:bg-red-700 transition shadow-sm rounded-lg font-semibold tracking-wide text-sm"
        >
          <FileDown size={18} strokeWidth={2.25} />
          PDF
        </button>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name..."
          className="p-2 border border-gray-200 rounded-lg focus:ring-green-500 focus:ring-2 outline-none text-sm font-medium bg-gray-50 w-full md:w-1/2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="p-2 border border-gray-200 rounded-lg focus:ring-green-500 focus:ring-2 outline-none text-sm font-medium bg-gray-50 w-full md:w-1/2"
          value={selectedMinistry}
          onChange={(e) => setSelectedMinistry(e.target.value)}
        >
          <option value="">All Ministries</option>
          {ministries.map((min, idx) => (
            <option key={idx} value={min}>
              {min}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48 gap-3 text-green-600 font-semibold">
          <Loader className="animate-spin" size={40} />
          Loading members...
        </div>
      ) : error ? (
        <p className="text-center text-red-500 font-medium">{error}</p>
      ) : filteredMembers.length === 0 ? (
        <p className="text-center text-slate-400 font-medium py-12">
          No matching ministry members found.
        </p>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-x-auto border border-slate-100">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-green-800 text-white uppercase text-[11px] font-semibold tracking-wider">
                <th className="py-4 px-6">Full Name</th>
                <th className="py-4 px-6">Phone</th>
                <th className="py-4 px-6">Ministry</th>
                <th className="py-4 px-6">Email</th>
                <th className="py-4 px-6">Reason</th>
                <th className="py-4 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-slate-600 text-sm">
              {filteredMembers.map((member) => (
                <tr
                  key={member._id}
                  className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
                >
                  <td className="py-4 px-6 font-semibold text-slate-900">
                    {member.fullName}
                  </td>
                  <td className="py-4 px-6 font-medium text-slate-600">
                    {member.phoneNumber}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border ${getMinistryBadgeClass(
                        member.ministry,
                      )}`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${getMinistryDotClass(
                          member.ministry,
                        )}`}
                      ></span>
                      {member.ministry}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-medium">
                    {member.email ? (
                      <span className="text-slate-600">{member.email}</span>
                    ) : (
                      <span className="text-slate-300 italic font-normal">
                        —
                      </span>
                    )}
                  </td>
                  <td
                    className="py-4 px-6 font-medium text-slate-500 max-w-xs truncate"
                    title={member.reason}
                  >
                    {member.reason || (
                      <span className="text-slate-300 italic font-normal">
                        —
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <DeleteActionButton
                      onClick={() => handleDelete(member._id)}
                      strokeWidth={2.25}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default MinistryMembers;
