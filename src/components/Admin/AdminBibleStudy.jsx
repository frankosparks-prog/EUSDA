import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Trash2,
  Loader2,
  MessageCircle,
  Eye,
  FileDown,
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

function AdminBibleStudy() {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");
  const [error, setError] = useState("");
  const [viewItem, setViewItem] = useState(null); // Modal Data

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    try {
      const res = await axios.get(`${SERVER_URL}/api/discussions`);
      setSuggestions(res.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load suggestions.");
    } finally {
      setLoading(false);
    }
  };

  // Mark as reviewed
  const markReviewed = async (id) => {
    setActionLoading(id);
    try {
      await axios.put(`${SERVER_URL}/api/discussions/${id}/review`);
      setSuggestions((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, status: "reviewed" } : item
        )
      );
    } catch (err) {
      console.error(err);
      setError("Failed to update status.");
    } finally {
      setActionLoading("");
    }
  };

  // Delete
  const deleteSuggestion = async (id) => {
    if (!window.confirm("Delete this suggestion?")) return;

    setActionLoading(id);
    try {
      await axios.delete(`${SERVER_URL}/api/discussions/${id}`);
      setSuggestions((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error(err);
      setError("Failed to delete.");
    } finally {
      setActionLoading("");
    }
  };

  // Export as PDF
  const exportPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Bible Study Topic Suggestions", 14, 15);

    doc.setFontSize(11);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 25);

    const rows = suggestions.map((item, index) => [
      index + 1,
      item.name || "Anonymous",
      item.topic,
      item.status,
      new Date(item.createdAt).toLocaleString(),
    ]);

    autoTable(doc, {
      startY: 35,
      head: [["#", "Name", "Topic", "Status", "Submitted At"]],
      body: rows,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [46, 125, 50] },
    });

    doc.save("BibleStudySuggestions.pdf");
  };

  return (
    <div className="min-h-screen bg-gray-100 max-w-6xl mx-auto p-6">
      <div className="bg-white p-8 rounded-2xl shadow-lg border">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <MessageCircle size={35} className="text-green-700" />
            <h1 className="text-3xl font-bold text-green-800">
              Bible Study Topic Suggestions
            </h1>
          </div>

          {/* Export PDF */}
          <button
            onClick={exportPDF}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            <FileDown size={18} />
            Export PDF
          </button>
        </div>

        {/* Error */}
        {error && (
          <p className="bg-red-100 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </p>
        )}

        {/* Loader */}
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin text-green-600" size={40} />
          </div>
        ) : suggestions.length === 0 ? (
          <p className="text-center text-gray-500 text-lg py-10">
            No discussion suggestions yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-green-600 text-white text-left">
                  <th className="p-3">Name</th>
                  <th className="p-3">Topic</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Date</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {suggestions.map((item) => (
                  <tr
                    key={item._id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="p-3 font-semibold">
                      {item.name || (
                        <span className="italic text-gray-500">Anonymous</span>
                      )}
                    </td>

                    <td className="p-3 max-w-md">
                      <p className="line-clamp-2">{item.topic}</p>
                    </td>

                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          item.status === "reviewed"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {item.status === "reviewed" ? "Reviewed" : "New"}
                      </span>
                    </td>

                    <td className="p-3 text-gray-600">
                      {new Date(item.createdAt).toLocaleString()}
                    </td>

                    <td className="p-3 flex items-center justify-end gap-3">
                      {/* Eye = View Modal + Mark Reviewed */}
                      <button
                        onClick={() => {
                          setViewItem(item);
                          if (item.status !== "reviewed")
                            markReviewed(item._id);
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Eye size={20} />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => deleteSuggestion(item._id)}
                        className="text-red-600 hover:text-red-800"
                        disabled={actionLoading === item._id}
                      >
                        {actionLoading === item._id ? (
                          <Loader2 className="animate-spin" size={18} />
                        ) : (
                          <Trash2 size={20} />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* VIEW MODAL */}
      {viewItem && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setViewItem(null)}
        >
          <div
            className="bg-white p-6 rounded-xl shadow-lg max-w-lg w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-xl"
              onClick={() => setViewItem(null)}
            >
              &times;
            </button>

            <h2 className="text-2xl font-bold text-green-700 mb-4">
              Discussion Suggestion
            </h2>

            <p>
              <strong>Name:</strong> {viewItem.name || "Anonymous"}
            </p>
            <p className="mt-3">
              <strong>Topic:</strong>
              <br />
              <span className="text-gray-700">{viewItem.topic}</span>
            </p>

            <p className="mt-3 text-sm text-gray-500">
              Submitted: {new Date(viewItem.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminBibleStudy;
