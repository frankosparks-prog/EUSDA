// src/pages/admin/Subscribed.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Trash2 } from "lucide-react";
import CircularProgress from "@mui/material/CircularProgress";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const Subscribed = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all subscribers
  const fetchSubscribers = async () => {
    try {
      const res = await axios.get(`${SERVER_URL}/api/subscribe`);
      setSubscribers(res.data);
    } catch (err) {
      setError("Failed to fetch subscribers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  // Delete subscriber
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to remove this subscriber?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`${SERVER_URL}/api/subscribe/${id}`);
      setSubscribers((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      alert("Failed to delete subscriber.");
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-4xl font-bold text-gray-800 mb-10 text-center">🔔 Subscribed Users</h2>

      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <CircularProgress size={40} sx={{ color: "black" }} />
        </div>
      ) : error ? (
        <p className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded shadow-md flex items-center justify-center">{error}</p>
      ) : subscribers.length === 0 ? (
        <p className="text-gray-500">No subscribers found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300">
            <thead>
              <tr className="bg-gray-100 text-left text-sm font-medium text-gray-600 uppercase">
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Subscribed At</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {subscribers.map((sub) => (
                <tr key={sub._id}>
                  <td className="px-4 py-2">{sub.email}</td>
                  <td className="px-4 py-2">
                    {new Date(sub.subscribedAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleDelete(sub._id)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete subscriber"
                    >
                      <Trash2 className="w-5 h-5" />
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
};

export default Subscribed;
