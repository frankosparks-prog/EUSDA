import React, { useEffect, useState } from "react";
import axios from "axios";
import Toast from "../Toast";
import { Pencil, Trash2 } from "lucide-react";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

function ManageAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [form, setForm] = useState({ title: "", date: "", description: "" });
  const [editingId, setEditingId] = useState(null);
  const [toast, setToast] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchAnnouncements = async () => {
    try {
      const res = await axios.get(`${SERVER_URL}/api/announcements`);
      setAnnouncements(res.data);
    } catch (error) {
      setToast({ type: "error", message: "Failed to fetch announcements." });
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${SERVER_URL}/api/announcements/${editingId}`, form);
        setToast({ type: "success", message: "Announcement updated!" });
      } else {
        await axios.post(`${SERVER_URL}/api/announcements`, form);
        setToast({ type: "success", message: "Announcement added!" });
      }
      setForm({ title: "", date: "", description: "" });
      setEditingId(null);
      fetchAnnouncements();
    } catch (error) {
      setToast({ type: "error", message: "Error saving announcement." });
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${SERVER_URL}/api/announcements/${id}`);
      setToast({ type: "success", message: "Deleted successfully!" });
      fetchAnnouncements();
    } catch (error) {
      setToast({ type: "error", message: "Error deleting announcement." });
    }
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAnnouncements = announcements.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  const totalPages = Math.ceil(announcements.length / itemsPerPage);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
      <h2 className="text-3xl font-bold mb-4 text-green-800">Manage Announcements</h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-4 rounded shadow bg-gradient-to-br from-green-100 to-white"
      >
        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full p-2 border rounded"
          rows={4}
          required
        />
        <div className="flex gap-3">
          <button
            type="submit"
            className="bg-green-700 text-white px-4 py-2 rounded"
          >
            {editingId ? "Update" : "Add"} Announcement
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm({ title: "", date: "", description: "" });
              }}
              className="text-gray-600 hover:underline"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      <div className="mt-6 space-y-4">
        {paginatedAnnouncements.map((a) => (
          <div
            key={a._id}
            className="bg-white border-l-4 border-green-500 p-4 rounded-xl shadow hover:shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          >
            <div>
              <h3 className="text-lg font-semibold">{a.title}</h3>
              <p className="text-sm text-gray-500">
                {new Date(a.date).toLocaleDateString()}
              </p>
              <p className="mt-2 text-gray-700">{a.description}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setForm({
                    title: a.title,
                    date: a.date.split("T")[0],
                    description: a.description,
                  });
                  setEditingId(a._id);
                }}
                className="text-blue-600 hover:underline"
              >
                <Pencil size={16} />
              </button>
              <button
                onClick={() => handleDelete(a._id)}
                className="text-red-600 hover:underline"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="mt-6 flex justify-center gap-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
          <button
            key={num}
            onClick={() => setCurrentPage(num)}
            className={`px-3 py-1 border rounded ${
              currentPage === num ? "bg-green-600 text-white" : "bg-white"
            }`}
          >
            {num}
          </button>
        ))}
      </div>
    </div>
  );
}

export default ManageAnnouncements;
