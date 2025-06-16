import React, { useState } from "react";
import axios from "axios";
import { X, Loader } from "lucide-react";

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
        // Update blog (use PUT with FormData)
        await axios.put(`${SERVER_URL}/api/blog/${existing._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setToast({ type: "success", message: "Blog updated!" });
      } else {
        // Create new blog
        await axios.post(`${SERVER_URL}/api/blog`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setToast({ type: "success", message: "Blog created!" });
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
      <div className="bg-white w-full max-w-xl rounded-lg shadow-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-red-600"
        >
          <X size={22} />
        </button>
        <h2 className="text-2xl font-bold mb-4 text-green-700">
          {existing ? "Edit Blog" : "Add Blog"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="role"
            type="text"
            placeholder="role"
            value={form.role}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            name="name"
            type="text"
            placeholder="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
          <textarea
            name="quote"
            placeholder="quote"
            rows="5"
            value={form.quote}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          ></textarea>

          <div>
            <label className="text-sm font-semibold">Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full border border-gray-300 p-2 rounded mt-1"
            />
            {(imageFile || existing?.image) && (
              <img
                src={
                  imageFile
                    ? URL.createObjectURL(imageFile)
                    : existing?.image
                }
                alt="Preview"
                className="w-24 h-24 mt-2 rounded-full object-cover border"
              />
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 flex items-center justify-center"
          >
            {loading && <Loader size={20} className="animate-spin mr-2" />}
            {existing ? "Update Blog" : "Create Blog"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BlogFormModal;
