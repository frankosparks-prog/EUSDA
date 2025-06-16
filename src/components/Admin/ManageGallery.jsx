// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const SERVER_URL = process.env.REACT_APP_SERVER_URL;

// function ManageGallery() {
//   const [images, setImages] = useState([]);
//   const [uploading, setUploading] = useState(false);
//   const [file, setFile] = useState(null);

//   const fetchImages = async () => {
//     try {
//       const res = await axios.get(`${SERVER_URL}/api/gallery`);
//       setImages(res.data.data);
//     } catch (err) {
//       console.error("Failed to load images:", err);
//     }
//   };

//   useEffect(() => {
//     fetchImages();
//   }, []);

//   const handleDelete = async (id) => {
//     if (window.confirm("Are you sure you want to delete this image?")) {
//       try {
//         await axios.delete(`${SERVER_URL}/api/gallery/${id}`);
//         setImages((prev) => prev.filter((img) => img._id !== id));
//       } catch (err) {
//         console.error("Delete error:", err);
//         alert("Failed to delete image.");
//       }
//     }
//   };

//   const handleUpload = async (e) => {
//     e.preventDefault();
//     if (!file) return alert("Please select an image to upload.");

//     const formData = new FormData();
//     formData.append("image", file);

//     try {
//       setUploading(true);
//       const res = await axios.post(`${SERVER_URL}/api/gallery/upload`, formData);
//       setImages((prev) => [res.data.data, ...prev]);
//       setFile(null);
//       setUploading(false);
//     } catch (err) {
//       console.error("Upload failed:", err);
//       alert("Image upload failed.");
//       setUploading(false);
//     }
//   };

//   return (
//     <div className="p-6 max-w-5xl mx-auto">
//       <h1 className="text-3xl font-bold text-center mb-8 text-green-700">📸 Manage Gallery</h1>

//       <form onSubmit={handleUpload} className="mb-10 flex items-center space-x-4">
//         <input
//           type="file"
//           accept="image/*"
//           onChange={(e) => setFile(e.target.files[0])}
//           className="border rounded px-3 py-2"
//         />
//         <button
//           type="submit"
//           disabled={uploading}
//           className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 disabled:opacity-50"
//         >
//           {uploading ? "Uploading..." : "Upload Image"}
//         </button>
//       </form>

//       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
//         {images.map((img) => (
//           <div key={img._id} className="relative group">
//             <img
//               src={img.url}
//               alt="Gallery"
//               className="rounded-lg shadow-md w-full h-48 object-cover"
//             />
//             <button
//               onClick={() => handleDelete(img._id)}
//               className="absolute top-2 right-2 bg-red-600 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
//             >
//               Delete
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default ManageGallery;
import React, { useEffect, useState } from "react";
import axios from "axios";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

function ManageGallery() {
  const [images, setImages] = useState([]);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [title, setTitle] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Fetch gallery images
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await axios.get(`${SERVER_URL}/api/gallery`);
        setImages(res.data.data);
      } catch (err) {
        console.error("Failed to load images:", err);
      }
    };
    fetchImages();
  }, []);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    if (selected) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(selected);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select an image.");

    const formData = new FormData();
    formData.append("image", file);
    formData.append("title", title);

    try {
      setUploading(true);
      setUploadProgress(0);

      const res = await axios.post(`${SERVER_URL}/api/gallery/upload`, formData, {
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percent);
        },
      });

      setImages((prev) => [res.data.data, ...prev]);
      setFile(null);
      setPreview(null);
      setTitle("");
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this image?")) return;
    try {
      await axios.delete(`${SERVER_URL}/api/gallery/${id}`);
      setImages((prev) => prev.filter((img) => img._id !== id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8 text-green-700">
        📸 Manage Gallery
      </h1>

      <form onSubmit={handleUpload} className="space-y-4 mb-10">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block border px-3 py-2 rounded w-full"
        />

        <input
          type="text"
          placeholder="Enter image title (optional)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="block border px-3 py-2 rounded w-full"
        />

        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="w-full max-h-64 object-cover rounded"
          />
        )}

        {uploading && (
          <div className="w-full bg-gray-200 rounded">
            <div
              className="bg-green-600 text-white text-sm text-center py-1 rounded"
              style={{ width: `${uploadProgress}%` }}
            >
              {uploadProgress}%
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={uploading}
          className="bg-green-700 text-white px-5 py-2 rounded hover:bg-green-800 disabled:opacity-50"
        >
          {uploading ? "Uploading..." : "Upload Image"}
        </button>
      </form>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.map((img) => (
          <div key={img._id} className="relative group">
            <img
              src={img.url}
              alt="Gallery"
              className="rounded-lg shadow-md w-full h-48 object-cover"
            />
            {img.title && (
              <p className="absolute bottom-1 left-2 text-sm text-white bg-black/50 px-2 py-0.5 rounded">
                {img.title}
              </p>
            )}
            <button
              onClick={() => handleDelete(img._id)}
              className="absolute top-2 right-2 bg-red-600 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ManageGallery;
