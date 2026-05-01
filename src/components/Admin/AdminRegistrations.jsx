import React, { useEffect, useState } from "react";
import axios from "axios";
import { CSVLink } from "react-csv";
import { Download, Trash2, ChevronUp, ChevronDown, Users, ChevronLeft, ChevronRight } from "lucide-react";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;
const ITEMS_PER_PAGE = 15;

function AdminRegistrations() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const res = await axios.get(`${SERVER_URL}/api/register`);
      setRegistrations(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${SERVER_URL}/api/register/${id}`);
      setDeleteConfirm(null);
      fetchRegistrations();
    } catch (err) {
      alert("Failed to delete");
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setCurrentPage(1);
  };

  const sortedData = [...registrations].sort((a, b) => {
    let valA, valB;

    if (sortField === "createdAt") {
      valA = new Date(a.createdAt);
      valB = new Date(b.createdAt);
    } else if (sortField === "gender") {
      valA = a.gender || "";
      valB = b.gender || "";
    } else {
      valA = a[sortField] || "";
      valB = b[sortField] || "";
    }

    if (valA < valB) return sortDirection === "asc" ? -1 : 1;
    if (valA > valB) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedData.length / ITEMS_PER_PAGE);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const csvHeaders = [
    { label: "Full Name", key: "fullName" },
    { label: "Phone Number", key: "phoneNumber" },
    { label: "Email", key: "email" },
    { label: "Gender", key: "gender" },
    { label: "Date Registered", key: "createdAt" },
  ];

  const csvData = registrations.map((reg) => ({
    ...reg,
    createdAt: new Date(reg.createdAt).toLocaleDateString(),
  }));

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <ChevronUp size={14} className="opacity-30" />;
    return sortDirection === "asc" ? (
      <ChevronUp size={14} className="text-green-400" />
    ) : (
      <ChevronDown size={14} className="text-green-400" />
    );
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-green-900 flex items-center gap-2">
            <Users /> First-Year Registrations
          </h1>
          <p className="text-gray-600">
            Total Registered: {registrations.length}
          </p>
        </div>

        {/* Export CSV */}
        <CSVLink
          data={csvData}
          headers={csvHeaders}
          filename={`Registrations_${new Date().toISOString().slice(0, 10)}.csv`}
          className="flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 transition font-bold shadow"
        >
          <Download size={18} /> Export CSV
        </CSVLink>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-green-800 text-white uppercase text-sm leading-normal">
              <th className="py-3 px-6">Name</th>
              <th className="py-3 px-6">Phone</th>
              <th className="py-3 px-6">Email</th>
              <th
                className="py-3 px-6 cursor-pointer select-none hover:bg-green-700 transition-colors"
                onClick={() => handleSort("gender")}
              >
                <span className="flex items-center gap-1">
                  Gender <SortIcon field="gender" />
                </span>
              </th>
              <th
                className="py-3 px-6 cursor-pointer select-none hover:bg-green-700 transition-colors"
                onClick={() => handleSort("createdAt")}
              >
                <span className="flex items-center gap-1">
                  Date Registered <SortIcon field="createdAt" />
                </span>
              </th>
              <th className="py-3 px-6 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center py-10">
                  Loading...
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-10">
                  No registrations found.
                </td>
              </tr>
            ) : (
              paginatedData.map((reg) => (
                <tr
                  key={reg._id}
                  className="border-b border-gray-200 hover:bg-gray-100"
                >
                  <td className="py-3 px-6 font-medium text-gray-800">
                    {reg.fullName}
                  </td>
                  <td className="py-3 px-6">{reg.phoneNumber}</td>
                  <td className="py-3 px-6">
                    {reg.email || (
                      <span className="text-gray-400 italic">N/A</span>
                    )}
                  </td>
                  <td className="py-3 px-6">
                    <span
                      className={`py-1 px-3 rounded-full text-xs font-bold ${reg.gender === "Male"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-pink-100 text-pink-800"
                        }`}
                    >
                      {reg.gender}
                    </span>
                  </td>
                  <td className="py-3 px-6">
                    {new Date(reg.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="py-3 px-6 text-center">
                    {deleteConfirm === reg._id ? (
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleDelete(reg._id)}
                          className="text-xs bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition font-bold"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="text-xs bg-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-400 transition font-bold"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(reg._id)}
                        className="text-red-500 hover:text-red-700 transform hover:scale-110 transition"
                        title="Delete registration"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination stuff */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 px-2">
          <p className="text-sm text-gray-500">
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
            {Math.min(currentPage * ITEMS_PER_PAGE, sortedData.length)} of{" "}
            {sortedData.length}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft size={18} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded text-sm font-bold transition ${currentPage === page
                    ? "bg-green-700 text-white"
                    : "border border-gray-300 hover:bg-gray-100 text-gray-700"
                  }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminRegistrations;
