import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Trash2, PlusCircle } from "lucide-react";
import LeaderFormModal from "./LeaderFormModal";
import Toast from "../Toast";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const ManageLeaders = () => {
  const [leaders, setLeaders] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editLeader, setEditLeader] = useState(null);
  const [toast, setToast] = useState(null); // Toast handler
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const fetchLeaders = async () => {
    try {
      const res = await axios.get(`${SERVER_URL}/api/leader`);
      setLeaders(res.data);
    } catch (err) {
      console.error("Failed to fetch leaders:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this leader?")) return;
    try {
      await axios.delete(`${SERVER_URL}/api/leader/${id}`);
      setToast({ type: "success", message: "Leader deleted successfully!" });
      fetchLeaders(); // Refresh
    } catch (err) {
      console.error("Error deleting:", err);
    }setToast({ type: "error", message: "Failed to delete leader" });
  };

  const handleEdit = (leader) => {
    setEditLeader(leader);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditLeader(null);
    setModalOpen(true);
  };

  useEffect(() => {
    fetchLeaders();
  }, []);

  const totalPages = Math.ceil(leaders.length / itemsPerPage);
  const paginatedProducts = leaders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
      <div className="p-6 min-h-screen bg-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-green-800">Manage Leaders</h1>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 transition"
          >
            <PlusCircle size={20} /> Add Leader
          </button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedProducts.map((leader) => (
            <div
              key={leader._id}
              className="bg-white rounded-lg shadow-md p-4 relative hover:shadow-xl transition"
            >
              <img
                src={leader.image || "https://picsum.photos/200"}
                alt={leader.name}
                className="w-24 h-24 rounded-full object-cover mx-auto mb-3 border-4 border-green-300"
              />
              <h2 className="text-center text-lg font-semibold text-green-800">
                {leader.name}
              </h2>
              <p className="text-center text-sm text-gray-600">{leader.role}</p>
              <p className="text-center text-xs text-gray-400 italic">
                {leader.category}
              </p>

              <div className="flex justify-center gap-4 mt-4">
                <button
                  onClick={() => handleEdit(leader)}
                  className="text-blue-600 hover:text-blue-800"
                  title="Edit"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => handleDelete(leader._id)}
                  className="text-red-600 hover:text-red-800"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
        {/* Pagination */}
        <div className="flex justify-center items-center space-x-4 mt-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-4 py-2 bg-green-900 text-white rounded disabled:opacity-50"
          >
            Prev
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                currentPage === i + 1
                  ? "bg-green-500 text-white"
                  : "bg-green-100"
              }`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-4 py-2 bg-green-900 text-white rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
        {modalOpen && (
          <LeaderFormModal
            existing={editLeader}
            onClose={() => setModalOpen(false)}
            onSuccess={() => {
              setModalOpen(false);
              fetchLeaders();
            }}
            setToast={setToast} // ✅ Pass toast handler
          />
        )}
      </div>
    </>
  );
};

export default ManageLeaders;
