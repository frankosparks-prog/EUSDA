import React, { useState } from "react";
import axios from "axios";
import { X, Loader, UploadCloud } from "lucide-react";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const BlogFormModal = ({ existing, onClose, onSuccess, setToast }) => {
  const [form, setForm] = useState({
    role: existing?.role || "",
    name: existing?.name || "",
    quote: existing?.quote || "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("role", form.role);
      formData.append("name", form.name);
      formData.append("quote", form.quote);

      if (imageFile) {
        formData.append("image", imageFile);
      }

      if (existing) {
        await axios.put(`${SERVER_URL}/api/blog/${existing._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setToast({ type: "success", message: "Blog updated successfully!" });
      } else {
        await axios.post(`${SERVER_URL}/api/blog`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setToast({ type: "success", message: "Blog created! It is now in Pending Approvals." });
      }

      onSuccess();
    } catch (err) {
      console.error(err);
      setToast({ type: "error", message: "Something went wrong!" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 px-4 backdrop-blur-sm">
      {/* ✅ Fixed: Added max-h-[90vh] and overflow-y-auto to prevent screen overlap */}
      <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl p-6 relative animate-fadeIn max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition z-10"
        >
          <X size={24} />
        </button>
        
        <h2 className="text-2xl font-bold mb-6 text-green-800 border-b pb-2 sticky top-0 bg-white">
          {existing ? "Edit Blog Post" : "Add New Blog Post"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
             <label className="block text-sm font-semibold text-gray-700 mb-1">Author Name</label>
             <input
                name="name"
                type="text"
                placeholder="e.g. John Doe"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition"
              />
          </div>

          <div>
             <label className="block text-sm font-semibold text-gray-700 mb-1">Role / Title</label>
             <input
                name="role"
                type="text"
                placeholder="e.g. Choir Member"
                value={form.role}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition"
              />
          </div>

          <div>
             <label className="block text-sm font-semibold text-gray-700 mb-1">Content / Quote</label>
             <textarea
                name="quote"
                placeholder="Write the reflection here..."
                rows="5"
                value={form.quote}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition resize-none"
              ></textarea>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Attached Image</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition cursor-pointer relative">
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center justify-center text-gray-500">
                    <UploadCloud size={30} className="mb-2 text-green-600" />
                    <span className="text-sm">{imageFile ? imageFile.name : "Click to upload image"}</span>
                </div>
            </div>

            {/* Image Preview */}
            {(imageFile || existing?.image) && (
              <div className="mt-4 flex justify-center">
                <img
                  src={
                    imageFile
                      ? URL.createObjectURL(imageFile)
                      : existing?.image
                  }
                  alt="Preview"
                  className="w-full max-h-48 object-contain rounded-lg border border-gray-200 shadow-sm"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-700 text-white py-3 rounded-lg font-bold hover:bg-green-800 transition flex items-center justify-center gap-2 shadow-lg disabled:bg-gray-400"
          >
            {loading ? <Loader size={20} className="animate-spin" /> : (existing ? "Update Post" : "Create Post")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BlogFormModal;