// import React, { useEffect, useState, useMemo } from "react";
// import axios from "axios";
// import {
//   Trash2,
//   PencilLine,
//   PlusCircle,
//   Eye,
//   X,
//   ChevronLeft,
//   ChevronRight,
//   Search as SearchIcon,
//   Loader,
// } from "lucide-react";
// // import ReactQuill from "react-quill";
// // import "react-quill/dist/quill.snow.css";
// // import CircularProgress from "@mui/material/CircularProgress";

// const API = process.env.REACT_APP_SERVER_URL; // vite / CRA

// const PER_PAGE = 10;

// const ManageBlogs = () => {
//   /* ------------ state ------------ */
//   const [blogs, setBlogs] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // form
//   const [form, setForm] = useState({
//     title: "",
//     description: "",
//     author: "",
//     date: new Date().toISOString().slice(0, 10),
//     content: "",
//   });
//   const [editId, setEditId] = useState(null);

//   // modal
//   const [activePost, setActivePost] = useState(null);

//   // search & pagination
//   const [query, setQuery] = useState("");
//   const [page, setPage] = useState(1);

//   /* ------------ fetch ------------ */
//   const fetchBlogs = async () => {
//     try {
//       const { data } = await axios.get(`${API}/api/blogs`);
//       setBlogs(data);
//     } catch {
//       alert("Failed loading blogs");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchBlogs();
//   }, []);

//     const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };
//   /* ------------ derived lists ------------ */
//   const filtered = useMemo(() => {
//     if (!query.trim()) return blogs;
//     return blogs.filter(
//       (b) =>
//         b.title.toLowerCase().includes(query.toLowerCase()) ||
//         b.description.toLowerCase().includes(query.toLowerCase())
//     );
//   }, [blogs, query]);

//   const maxPage = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
//   const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

//   /* ------------ handlers ------------ */
//   const resetForm = () => {
//     setForm({
//       title: "",
//       description: "",
//       author: "",
//       date: new Date().toISOString().slice(0, 10),
//       content: "",
//     });
//     setEditId(null);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (editId) {
//         await axios.put(`${API}/api/blogs/${editId}`, form);
//         alert("Post updated");
//       } else {
//         await axios.post(`${API}/api/blogs`, form);
//         alert("Post created");
//       }
//       resetForm();
//       fetchBlogs();
//     } catch {
//       alert("Error saving post");
//     }
//   };

//   const handleEdit = (p) => {
//     setForm({ ...p, date: p.date?.slice(0, 10) });
//     setEditId(p._id);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Delete this blog post?")) return;
//     try {
//       await axios.delete(`${API}/api/blogs/${id}`);
//       setBlogs((prev) => prev.filter((b) => b._id !== id));
//     } catch {
//       alert("Error deleting");
//     }
//   };

//   /* ------------ ui ------------ */
//   return (
//     <div className="p-6 bg-white rounded-lg shadow-md">
//       {/* ===== title & search ===== */}
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
//         <h1 className="text-2xl font-bold">Blog manager</h1>

//         <label className="relative w-full md:w-72">
//           <SearchIcon
//             className="absolute left-2.5 top-2.5 text-gray-400"
//             size={18}
//           />
//           <input
//             value={query}
//             onChange={(e) => {
//               setQuery(e.target.value);
//               setPage(1);
//             }}
//             placeholder="Search posts..."
//             className="w-full pl-8 pr-3 py-2 border rounded focus:outline-none"
//           />
//         </label>
//       </div>

//       {/* ===== form ===== */}
//       <form
//         onSubmit={handleSubmit}
//         className="bg-gray-50 p-4 rounded-md mb-10 space-y-4"
//       >
//         <h2 className="text-lg font-semibold flex items-center gap-2">
//           <PlusCircle size={18} />
//           {editId ? "Edit post" : "New post"}
//         </h2>

//         <input
//           name="title"
//           placeholder="Title"
//           value={form.title}
//           onChange={(e) => setForm({ ...form, title: e.target.value })}
//           className="w-full border rounded px-3 py-2"
//           required
//         />

//         <input
//           name="description"
//           placeholder="Short description"
//           value={form.description}
//           onChange={(e) => setForm({ ...form, description: e.target.value })}
//           className="w-full border rounded px-3 py-2"
//           required
//         />

//         <div className="flex flex-col md:flex-row gap-4">
//           <input
//             name="author"
//             placeholder="Author"
//             value={form.author}
//             onChange={(e) => setForm({ ...form, author: e.target.value })}
//             className="flex-1 border rounded px-3 py-2"
//             required
//           />
//           <input
//             type="date"
//             name="date"
//             value={form.date}
//             onChange={(e) => setForm({ ...form, date: e.target.value })}
//             className="border rounded px-3 py-2"
//             required
//           />
//         </div>

//         {/* react-quill */}
//         {/* <ReactQuill
//           theme="snow"
//           value={form.content}
//           onChange={(content) => setForm({ ...form, content })}
//           className="bg-white"
//         /> */}
//         <textarea
//           name="content"
//           placeholder="Full Blog Content"
//           value={form.content}
//           onChange={handleChange}
//           rows="6"
//           className="w-full border rounded px-3 py-2"
//         />

//         <div className="flex gap-4">
//           <button
//             type="submit"
//             className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 flex items-center gap-1"
//           >
//             <PlusCircle size={16} />
//             {editId ? "Update" : "Create"}
//           </button>
//           {editId && (
//             <button
//               type="button"
//               onClick={resetForm}
//               className="text-sm underline text-gray-500"
//             >
//               cancel edit
//             </button>
//           )}
//         </div>
//       </form>

//       {/* ===== list ===== */}
//       {loading ? (
//         // <div className="flex justify-center items-center py-20">
//         //   <CircularProgress style={{ color: "#D97706" }} />{" "}
//         //   {/* Tailwind amber-600 */}
//         // </div>
//         <div className="flex items-center justify-center h-screen gap-4">
//                 <Loader className="animate-spin" size={40} />
//                 Loading blogs...
//               </div>
//       ) : filtered.length === 0 ? (
//         <p>No blog posts found.</p>
//       ) : (
//         <>
//           <div className="grid gap-4">
//             {paginated.map((post) => (
//               <div
//                 key={post._id}
//                 className="border p-4 rounded shadow-sm bg-gray-50"
//               >
//                 <h3 className="font-semibold text-lg">{post.title}</h3>
//                 <p
//                   className="text-sm text-gray-600 line-clamp-2"
//                   dangerouslySetInnerHTML={{ __html: post.description }}
//                 />
//                 <p className="text-xs mt-1 text-gray-500">
//                   {post.author} · {new Date(post.date).toLocaleDateString()}
//                 </p>

//                 <div className="flex gap-4 mt-2">
//                   <button
//                     onClick={() => setActivePost(post)}
//                     className="text-green-600 flex items-center gap-1 hover:underline"
//                   >
//                     <Eye size={16} /> Read
//                   </button>
//                   <button
//                     onClick={() => handleEdit(post)}
//                     className="text-blue-600 flex items-center gap-1 hover:underline"
//                   >
//                     <PencilLine size={16} /> Edit
//                   </button>
//                   <button
//                     onClick={() => handleDelete(post._id)}
//                     className="text-red-600 flex items-center gap-1 hover:underline"
//                   >
//                     <Trash2 size={16} /> Delete
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* ===== pagination ===== */}
//           <div className="flex justify-center items-center gap-3 mt-6">
//             <button
//               disabled={page === 1}
//               onClick={() => setPage((p) => p - 1)}
//               className="disabled:opacity-40"
//             >
//               <ChevronLeft />
//             </button>
//             <span className="text-sm">
//               {page} / {maxPage}
//             </span>
//             <button
//               disabled={page === maxPage}
//               onClick={() => setPage((p) => p + 1)}
//               className="disabled:opacity-40"
//             >
//               <ChevronRight />
//             </button>
//           </div>
//         </>
//       )}

//       {/* ===== modal ===== */}
//       {activePost && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//           <div className="bg-white max-w-3xl w-full max-h-[90vh] overflow-y-auto rounded-lg p-6 relative">
//             <button
//               onClick={() => setActivePost(null)}
//               className="absolute top-3 right-3 text-gray-500 hover:text-black"
//             >
//               <X size={20} />
//             </button>

//             <h2 className="text-2xl font-bold mb-2">{activePost.title}</h2>
//             <p className="text-sm mb-4 text-gray-600">
//               {activePost.author} ·{" "}
//               {new Date(activePost.date).toLocaleDateString()}
//             </p>

//             <div
//               className="prose max-w-none"
//               dangerouslySetInnerHTML={{ __html: activePost.content }}
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ManageBlogs;
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Trash2, PlusCircle, Loader } from "lucide-react";
import Toast from "../Toast";
import BlogFormModal from "./BlogFormModal";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const ManageBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editBlog, setEditBlog] = useState(null);
  const [toast, setToast] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${SERVER_URL}/api/blog`);
      setBlogs(res.data);
    } catch (err) {
      console.error("Error fetching blogs:", err);
    } finally {
      setLoading(false);
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
  }, []);

  const totalPages = Math.ceil(blogs.length / itemsPerPage);
  const paginatedProducts = blogs.slice(
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

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-green-800">Manage Blog Posts</h1>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
        >
          <PlusCircle size={20} /> Add Blog
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center mt-10">
          <Loader className="animate-spin" size={32} />
        </div>
      ) : blogs.length === 0 ? (
        <p className="text-gray-500 text-center font-semibold text-lg">
          No blog posts yet.
        </p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedProducts.map((blog) => (
              <div
                key={blog._id}
                className="bg-white rounded-lg shadow-md p-4 relative hover:shadow-lg"
              >
                <img
                  src={blog.image || "https://via.placeholder.com/300"}
                  alt={blog.role}
                  className="w-full h-40 object-cover rounded mb-3"
                />
                <h3 className="text-xl font-bold text-green-700">
                  {blog.role}
                </h3>
                <p className="text-gray-600 text-sm mb-2">By {blog.name}</p>
                <p className="text-sm text-gray-700 line-clamp-3">
                  {blog.quote}
                </p>

                <div className="flex justify-end gap-3 mt-4">
                  <button
                    onClick={() => handleEdit(blog)}
                    className="text-blue-600 hover:text-blue-800"
                    title="Edit"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(blog._id)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}
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
              currentPage === i + 1 ? "bg-green-500 text-white" : "bg-green-100"
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
