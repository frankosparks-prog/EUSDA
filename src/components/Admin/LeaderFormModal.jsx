import React, { useState, useEffect } from "react";
import axios from "axios";
import { X, Loader } from "lucide-react";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const initialState = {
  name: "",
  role: "",
  email: "",
  phone: "",
  description: "",
  category: "",
  socials: {
    facebook: "",
    twitter: "",
    whatsapp: "",
  },
  image: null,
};

const categories = ["Pastor", "Elder", "Minister", "Department Head"];

const LeaderFormModal = ({ existing, onClose, onSuccess, setToast }) => {
  const [formData, setFormData] = useState(initialState);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (existing) {
      setFormData({ ...initialState, ...existing });
      setPreviewImage(existing.image);
    }
  }, [existing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("socials.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        socials: { ...prev.socials, [key]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = new FormData();
      for (const key in formData) {
        if (key === "socials") {
          payload.append("socials", JSON.stringify(formData.socials));
        } else if (key === "image" && typeof formData.image === "object") {
          payload.append("image", formData.image);
        } else {
          payload.append(key, formData[key]);
        }
      }

      if (existing) {
        await axios.put(`${SERVER_URL}/api/leader/${existing._id}`, payload);
        setToast({
          type: "success",
          message: "Leader updated successfully!",
        });
      } else {
        await axios.post(`${SERVER_URL}/api/leader`, payload);
        setToast({
          type: "success",
          message: "Leader added successfully!",
        });
      }

      onSuccess();
    } catch (err) {
      console.error(err);
      setToast({
        type: "error",
        message: "Failed to save leader!",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white max-w-lg w-full rounded-lg p-6 relative space-y-4 overflow-y-auto max-h-[90vh]"
      >
        <button
          onClick={onClose}
          type="button"
          className="absolute top-3 right-4 text-gray-600 hover:text-red-600"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold text-green-800 mb-2">
          {existing ? "Edit Leader" : "Add Leader"}
        </h2>

        <input
          type="text"
          name="name"
          required
          value={formData.name}
          onChange={handleChange}
          placeholder="Full Name"
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
        />

        <input
          type="text"
          name="role"
          value={formData.role}
          onChange={handleChange}
          placeholder="Role"
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
        />

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <input
          type="email"
          name="email"
          value={formData.email || ""}
          onChange={handleChange}
          placeholder="Email"
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
        />

        <input
          type="text"
          name="phone"
          value={formData.phone || ""}
          onChange={handleChange}
          placeholder="Phone"
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
        />

        <textarea
          name="description"
          value={formData.description || ""}
          onChange={handleChange}
          placeholder="Description"
          rows={3}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
        ></textarea>

        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="socials.facebook"
            value={formData.socials.facebook}
            onChange={handleChange}
            placeholder="Facebook Link"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
          />
          <input
            type="text"
            name="socials.twitter"
            value={formData.socials.twitter}
            onChange={handleChange}
            placeholder="Twitter Link"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
          />
          <input
            type="text"
            name="socials.whatsapp"
            value={formData.socials.whatsapp}
            onChange={handleChange}
            placeholder="Whatsapp Link"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
          />
        </div>

        <input type="file" accept="image/*" onChange={handleFileChange} />
        {previewImage && (
          <img
            src={previewImage}
            alt="Preview"
            className="w-24 h-24 mt-2 rounded-full object-cover border"
          />
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-700 text-white py-2 rounded hover:bg-green-800 flex justify-center items-center gap-2"
        >
          {loading && <Loader className="animate-spin" size={20} />}
          {loading
            ? existing
              ? "Updating..."
              : "Saving..."
            : existing
            ? "Update Leader"
            : "Add Leader"}
        </button>
      </form>
    </div>
  );
};

export default LeaderFormModal;
