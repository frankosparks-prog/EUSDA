import React, { useEffect, useState } from "react";
import axios from "axios";
import { Loader } from "lucide-react";

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
    const confirm = window.confirm("Are you sure you want to delete this entry?");
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
    const matchesName = member.fullName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMinistry = selectedMinistry ? member.ministry === selectedMinistry : true;
    return matchesName && matchesMinistry;
  });

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-center text-green-700 mb-6">
        🙋‍♀️ Ministry Members
      </h1>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name..."
          className="px-4 py-2 border rounded-md w-full md:w-1/2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="px-4 py-2 border rounded-md w-full md:w-1/2"
          value={selectedMinistry}
          onChange={(e) => setSelectedMinistry(e.target.value)}
        >
          <option value="">-- Filter by Ministry --</option>
          {ministries.map((min, idx) => (
            <option key={idx} value={min}>
              {min}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48 gap-3 text-green-600">
          <Loader className="animate-spin" size={40} />
          Loading members...
        </div>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : filteredMembers.length === 0 ? (
        <p className="text-center text-gray-600">No matching ministry members found.</p>
      ) : (
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-green-600 text-white">
              <tr>
                <th className="py-3 px-4 text-left">Full Name</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Phone</th>
                <th className="py-3 px-4 text-left">Ministry</th>
                <th className="py-3 px-4 text-left">Reason</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((member) => (
                <tr key={member._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{member.fullName}</td>
                  <td className="py-3 px-4">{member.email}</td>
                  <td className="py-3 px-4">{member.phoneNumber}</td>
                  <td className="py-3 px-4">{member.ministry}</td>
                  <td className="py-3 px-4">{member.reason}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleDelete(member._id)}
                      className="text-sm text-red-600 hover:underline"
                    >
                      Delete
                    </button>
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
