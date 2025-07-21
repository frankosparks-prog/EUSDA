import React, { useEffect, useState } from "react";
import axios from "axios";
import { Loader, Search, FileDown } from "lucide-react";
import { CSVLink } from "react-csv";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

function ManagePledges() {
  const [pledges, setPledges] = useState([]);
  const [filteredPledges, setFilteredPledges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch data
  useEffect(() => {
    const fetchPledges = async () => {
      try {
        const res = await axios.get(`${SERVER_URL}/api/pledges`);
        setPledges(res.data);
        setFilteredPledges(res.data);
      } catch (err) {
        console.error("Failed to fetch pledges", err);
        setError("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchPledges();
  }, []);

  // Delete pledge
  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this entry?");
    if (!confirm) return;
    try {
      await axios.delete(`${SERVER_URL}/api/pledges/${id}`);
      setPledges((prev) => prev.filter((p) => p._id !== id));
      setFilteredPledges((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert("Failed to delete. Please try again.");
    }
  };

  // Filter pledges
  useEffect(() => {
    const filtered = pledges.filter((p) =>
      p.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPledges(filtered);
  }, [searchTerm, pledges]);

  const csvHeaders = [
    { label: "Contributor Name", key: "name" },
    { label: "Phone Number", key: "phoneNumber" },
    { label: "Pledge Purpose", key: "purpose" },
    { label: "Amount", key: "amount" },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold text-green-700">💰 Pledges</h1>

        <CSVLink
          headers={csvHeaders}
          data={filteredPledges}
          filename="eusda_pledges.csv"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          <FileDown size={18} />
          Export CSV
        </CSVLink>
      </div>

      {/* Search bar */}
      <div className="flex items-center w-full sm:w-1/2 border border-gray-300 rounded px-2 mb-6">
        <Search className="text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search by contributor name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 outline-none"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64 gap-3">
          <Loader className="animate-spin text-green-600" size={40} />
          <span className="text-gray-500 text-lg">Loading pledges...</span>
        </div>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : filteredPledges.length === 0 ? (
        <p className="text-center text-gray-600">No pledges found.</p>
      ) : (
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-green-600 text-white">
              <tr>
                <th className="py-3 px-4 text-left">Contributor</th>
                <th className="py-3 px-4 text-left">Amount</th>
                <th className="py-3 px-4 text-left">Phone</th>
                <th className="py-3 px-4 text-left">Purpose</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPledges.map((pledge) => (
                <tr key={pledge._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{pledge.name}</td>
                  <td className="py-3 px-4">Ksh {pledge.amount.toLocaleString()}</td>
                  <td className="py-3 px-4">{pledge.phoneNumber}</td>
                  <td className="py-3 px-4">{pledge.purpose}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleDelete(pledge._id)}
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

export default ManagePledges;
