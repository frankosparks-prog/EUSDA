import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Trash2, PlusCircle, Loader, CheckCircle, Clock, Heart, MessageCircle } from "lucide-react";
import Toast from "../Toast";
import BlogFormModal from "./BlogFormModal";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const ManageBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editBlog, setEditBlog] = useState(null);
  const [toast, setToast] = useState(null);
  
  const [activeTab, setActiveTab] = useState("live");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const endpoint = activeTab === "live" ? "/api/blog" : "/api/blog/pending";
      const res = await axios.get(`${SERVER_URL}${endpoint}`);
      setBlogs(res.data);
      setCurrentPage(1); 
    } catch (err) {
      console.error("Error fetching blogs:", err);
      setToast({ type: "error", message: "Failed to fetch blogs" });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.put(`${SERVER_URL}/api/blog/${id}/approve`);
      setToast({ type: "success", message: "Blog approved and published!" });
      fetchBlogs(); 
    } catch (err) {
      console.error(err);
      setToast({ type: "error", message: "Failed to approve blog" });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    try {
      await axios.delete(`${SERVER_URL}/api/blog/${id}`);
      setToast({ type: "success", message: "Blog deleted successfully!" });
      fetchBlogs();
    } catch (err) {
      console.error(err);
      setToast({ type: "error", message: "Failed to delete blog" });
    }
  };

  const handleEdit = (blog) => {
    setEditBlog(blog);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditBlog(null);
    setModalOpen(true);
  };

  useEffect(() => {
    fetchBlogs();
  }, [activeTab]);

  const totalPages = Math.ceil(blogs.length / itemsPerPage);
  const paginatedBlogs = blogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-green-800">Manage Blog Posts</h1>
        
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 shadow-md"
        >
          <PlusCircle size={20} /> Add Blog
        </button>
      </div>

      <div className="flex gap-4 mb-6 border-b border-gray-300 pb-2">
        <button
          onClick={() => setActiveTab("live")}
          className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition ${
            activeTab === "live"
              ? "bg-white border-b-2 border-green-600 text-green-700 font-bold shadow-sm"
              : "text-gray-500 hover:text-green-600"
          }`}
        >
          <CheckCircle size={18} /> Live Posts
        </button>
        <button
          onClick={() => setActiveTab("pending")}
          className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition ${
            activeTab === "pending"
              ? "bg-white border-b-2 border-yellow-500 text-yellow-700 font-bold shadow-sm"
              : "text-gray-500 hover:text-yellow-600"
          }`}
        >
          <Clock size={18} /> Pending Approvals
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center mt-10">
          <Loader className="animate-spin text-green-600" size={40} />
        </div>
      ) : blogs.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
            <p className="text-gray-500 font-semibold text-lg">
                {activeTab === "live" ? "No live blog posts yet." : "No pending submissions."}
            </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedBlogs.map((blog) => (
            <div
              key={blog._id}
              className={`bg-white rounded-lg shadow-md p-4 relative hover:shadow-xl transition duration-300 border-t-4 flex flex-col ${
                activeTab === "live" ? "border-green-600" : "border-yellow-500"
              }`}
            >
              <img
                src={blog.image || "https://via.placeholder.com/300"}
                alt={blog.role}
                className="w-full h-40 object-cover rounded mb-3 bg-gray-100"
              />
              
              <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{blog.name}</h3>
                    <p className="text-green-600 text-xs font-bold uppercase tracking-wider mb-2">{blog.role}</p>
                  </div>
                  <span className={`text-[10px] px-2 py-1 rounded font-bold ${
                      activeTab === "live" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                  }`}>
                      {activeTab === "live" ? "LIVE" : "PENDING"}
                  </span>
              </div>
              
              <p className="text-sm text-gray-600 line-clamp-3 mb-4 italic">"{blog.quote}"</p>

              {/* ✅ Likes & Comments Stats */}
              <div className="flex items-center gap-4 mb-4 text-gray-500 text-sm border-t border-gray-100 pt-2">
                 <div className="flex items-center gap-1">
                    <Heart size={16} className="text-red-500" />
                    <span>{blog.likes || 0} Likes</span>
                 </div>
                 <div className="flex items-center gap-1">
                    <MessageCircle size={16} className="text-blue-500" />
                    <span>{blog.comments?.length || 0} Comments</span>
                 </div>
              </div>

              <div className="flex justify-end gap-3 mt-auto pt-2 border-t border-gray-100">
                {activeTab === "pending" && (
                    <button
                        onClick={() => handleApprove(blog._id)}
                        className="flex items-center gap-1 text-sm bg-green-100 text-green-700 px-3 py-1 rounded hover:bg-green-200 font-semibold"
                        title="Approve & Publish"
                    >
                        <CheckCircle size={16} /> Approve
                    </button>
                )}

                <button
                  onClick={() => handleEdit(blog)}
                  className="text-blue-600 hover:text-blue-800 bg-blue-50 p-2 rounded-full"
                  title="Edit"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => handleDelete(blog._id)}
                  className="text-red-600 hover:text-red-800 bg-red-50 p-2 rounded-full"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4 mt-8">
            <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50"
            >
            Prev
            </button>
            <span className="text-gray-600 font-medium">Page {currentPage} of {totalPages}</span>
            <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50"
            >
            Next
            </button>
        </div>
      )}

      {modalOpen && (
        <BlogFormModal
          existing={editBlog}
          onClose={() => setModalOpen(false)}
          onSuccess={() => {
            fetchBlogs();
            setModalOpen(false);
          }}
          setToast={setToast}
        />
      )}
    </div>
  );
};

export default ManageBlogs;