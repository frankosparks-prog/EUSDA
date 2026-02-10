// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import CircularProgress from "@mui/material/CircularProgress";
// import { Helmet } from "react-helmet-async"; // ✅ Helmet for SEO

// const SERVER_URL = process.env.REACT_APP_SERVER_URL;

// function Gallary() {
//   const [images, setImages] = useState([]);
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Fetch gallery images from backend
//   useEffect(() => {
//     const fetchImages = async () => {
//       try {
//         const res = await axios.get(`${SERVER_URL}/api/gallery`);
//         setImages(res.data.data);
//       } catch (error) {
//         console.error("Error fetching images:", error);
//         setError(error.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchImages();
//   }, []);

//   const nextImage = () => {
//     const nextIndex = (currentIndex + 1) % images.length;
//     setCurrentIndex(nextIndex);
//     setSelectedImage(images[nextIndex]?.url);
//   };

//   const prevImage = () => {
//     const prevIndex = (currentIndex - 1 + images.length) % images.length;
//     setCurrentIndex(prevIndex);
//     setSelectedImage(images[prevIndex]?.url);
//   };

//   return (
//     <>
//       {/* ✅ SEO Helmet */}
//       <Helmet>
//         <title>Church Moments Gallery | Eusda Kenya</title>
//         <meta
//           name="description"
//           content="Explore memorable church moments in our gallery — photos from events, worship, and community activities at Eusda Kenya."
//         />
//         <meta
//           name="keywords"
//           content="Church Gallery, Eusda Church, Church Photos, Worship Images, Kenya Church Events"
//         />
//         <link rel="canonical" href="https://eusda.co.ke/gallery" />

//         {/* Open Graph for social sharing */}
//         <meta property="og:title" content="Church Moments Gallery ✨" />
//         <meta
//           property="og:description"
//           content="Browse through inspiring moments from our church activities, events, and worship services."
//         />
//         <meta
//           property="og:image"
//           content={images[0]?.url || "https://eusda.co.ke/eusda-logo-white.png"}
//         />
//         <meta property="og:type" content="website" />
//         <meta property="og:url" content="https://eusda.co.ke/gallery" />

//         {/* Twitter Card */}
//         <meta name="twitter:card" content="summary_large_image" />
//         <meta name="twitter:title" content="Church Moments Gallery ✨" />
//         <meta
//           name="twitter:description"
//           content="See church activities, photos, and inspiring moments captured in Eusda Kenya’s gallery."
//         />
//         <meta
//           name="twitter:image"
//           content={images[0]?.url || "https://eusda.co.ke/eusda-logo-white.png"}
//         />

//         {/* ✅ Structured Data (ImageGallery) */}
//         <script type="application/ld+json">
//           {JSON.stringify({
//             "@context": "https://schema.org",
//             "@type": "ImageGallery",
//             name: "Church Moments Gallery",
//             description:
//               "A collection of photos from Eusda Kenya's church activities and events.",
//             url: "https://eusda.co.ke/gallery",
//             image: images.map((img) => img.url),
//           })}
//         </script>
//       </Helmet>

//       <div className="py-16 px-4 md:px-16 bg-gray-50 min-h-screen mt-12 md:mt-24 mb-[-2rem]">
//         <h2 className="text-4xl font-bold text-center text-green-700 mb-10">
//           Church Moments Gallery ✨
//         </h2>

//         {/* Loading Spinner */}
//         {loading && (
//           <div className="flex justify-center items-center py-10">
//             <CircularProgress color="success" size={60} />
//           </div>
//         )}

//         {/* Error */}
//         {error && (
//           <p className="text-center text-red-600 font-semibold bg-red-100 p-4 rounded-lg shadow-md mt-6">
//             Error: {error}
//           </p>
//         )}

//         {/* Gallery Grid */}
//         <div className="columns-2 sm:columns-3 md:columns-4 gap-4 space-y-4">
//           {images.map((img, idx) => (
//             <div
//               key={img._id}
//               className="relative break-inside-avoid overflow-hidden rounded-lg cursor-pointer shadow-md hover:shadow-xl transition duration-300 group"
//               onClick={() => {
//                 setSelectedImage(img.url);
//                 setCurrentIndex(idx);
//               }}
//             >
//               {/* Image */}
//               <img
//                 src={img.url}
//                 alt={`Church gallery pic ${idx + 1}`}
//                 className="w-full object-cover transition duration-300 group-hover:scale-105"
//                 loading="lazy"
//               />

//               {/* Title Overlay */}
//               {img.title && (
//                 <div className="absolute bottom-1 left-2 text-sm text-white bg-black/50 px-2 py-0.5 rounded">
//                   <p className="truncate font-medium">{img.title}</p>
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>

//         {/* Modal */}
//         {selectedImage && (
//           <div
//             className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
//             onClick={() => setSelectedImage(null)}
//           >
//             <div
//               className="relative max-w-4xl w-full p-4"
//               onClick={(e) => e.stopPropagation()}
//             >
//               {/* Left Arrow */}
//               <button
//                 className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 text-white text-4xl bg-black/30 hover:bg-black/50 p-2 rounded-full transition z-20"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   prevImage();
//                 }}
//               >
//                 &#10094;
//               </button>

//               {/* Display Image */}
//               <img
//                 src={images[currentIndex]?.url}
//                 alt="Enlarged church gallery pic"
//                 className="w-full h-auto rounded-lg shadow-lg transition-all duration-500 scale-105"
//               />

//               {/* Right Arrow */}
//               <button
//                 className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 text-white text-4xl bg-black/30 hover:bg-black/50 p-2 rounded-full transition"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   nextImage();
//                 }}
//               >
//                 &#10095;
//               </button>

//               <p className="text-white text-center mt-4 text-sm">
//                 Click anywhere to close
//               </p>
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   );
// }

// export default Gallary;

import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import { Helmet } from "react-helmet-async";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  Image as ImageIcon,
} from "lucide-react";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

function Gallery() {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 800, easing: "ease-out-cubic", once: true });

    const fetchImages = async () => {
      try {
        const res = await axios.get(`${SERVER_URL}/api/gallery`);
        // Sort by newest first if created_at exists, otherwise keep order
        const sortedImages = res.data.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );
        setImages(sortedImages);
      } catch (error) {
        console.error("Error fetching images:", error);
        setError("Failed to load gallery. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, []);

  // Navigation Logic
  const nextImage = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevImage = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const closeGallery = useCallback(() => {
    setSelectedImage(null);
  }, []);

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedImage) return;
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "Escape") closeGallery();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImage, nextImage, prevImage, closeGallery]);

  // Sync selected image when index changes
  useEffect(() => {
    if (selectedImage && images.length > 0) {
      setSelectedImage(images[currentIndex]?.url);
    }
  }, [currentIndex, images, selectedImage]);

  const openImage = (index) => {
    setCurrentIndex(index);
    setSelectedImage(images[index]?.url);
  };

  return (
    <>
      <Helmet>
        <title>Church Moments Gallery | Eusda Kenya</title>
        <meta
          name="description"
          content="Explore memorable church moments in our gallery — photos from events, worship, and community activities at Eusda Kenya."
        />
        <meta
          name="keywords"
          content="Church Gallery, Eusda Church, Church Photos, Worship Images, Kenya Church Events"
        />
        <link rel="canonical" href="https://eusda.co.ke/gallery" />

        {/* Open Graph for social sharing */}
        <meta property="og:title" content="Church Moments Gallery ✨" />
        <meta
          property="og:description"
          content="Browse through inspiring moments from our church activities, events, and worship services."
        />
        <meta
          property="og:image"
          content={images[0]?.url || "https://eusda.co.ke/eusda-logo-white.png"}
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://eusda.co.ke/gallery" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Church Moments Gallery ✨" />
        <meta
          name="twitter:description"
          content="See church activities, photos, and inspiring moments captured in Eusda Kenya’s gallery."
        />
        <meta
          name="twitter:image"
          content={images[0]?.url || "https://eusda.co.ke/eusda-logo-white.png"}
        />

        {/* ✅ Structured Data (ImageGallery) */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ImageGallery",
            name: "Church Moments Gallery",
            description:
              "A collection of photos from Eusda Kenya's church activities and events.",
            url: "https://eusda.co.ke/gallery",
            image: images.map((img) => img.url),
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-24 px-4 sm:px-6 mt-[-8rem] md:mt-[-4rem]">
        {/* Header */}
        <div className="text-center mb-16" data-aos="fade-down">
          <span className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <ImageIcon size={16} /> Our Memories
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
            Church <span className="text-green-700">Gallery</span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Capturing the spirit of worship, fellowship, and service. Browse
            through our cherished moments.
          </p>
        </div>

        {/* Loading & Error States */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <CircularProgress color="success" size={50} thickness={4} />
          </div>
        )}

        {error && (
          <div className="max-w-lg mx-auto bg-red-50 border-l-4 border-red-500 p-4 rounded text-red-700 text-center">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}

        {/* Masonry Grid */}
        {!loading && !error && (
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4 mx-auto max-w-7xl">
            {images.map((img, idx) => (
              <div
                key={img._id || idx}
                className="group relative break-inside-avoid rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-zoom-in bg-gray-200"
                onClick={() => openImage(idx)}
                data-aos="fade-up"
                data-aos-delay={(idx % 5) * 50}
              >
                <img
                  src={img.url}
                  alt={img.title || "Gallery Image"}
                  className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <p className="text-white font-semibold text-lg line-clamp-1">
                    {img.title || "Church Moment"}
                  </p>
                  <p className="text-gray-300 text-xs mt-1 flex items-center gap-1">
                    <ZoomIn size={14} /> Click to view
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && images.length === 0 && (
          <div className="text-center py-20">
            <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
              <ImageIcon size={32} />
            </div>
            <p className="text-gray-500 text-lg">No photos uploaded yet.</p>
          </div>
        )}

        {/* Lightbox Modal */}
        {selectedImage && (
          <div
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
            onClick={closeGallery}
          >
            {/* Close Button */}
            <button
              onClick={closeGallery}
              className="absolute top-4 right-4 text-white/70 hover:text-white bg-black/50 hover:bg-black/80 p-2 rounded-full transition-all z-50"
            >
              <X size={28} />
            </button>

            {/* Navigation Buttons */}
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-black/30 hover:bg-black/60 p-3 rounded-full transition-all disabled:opacity-30 hidden sm:block"
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
            >
              <ChevronLeft size={32} />
            </button>

            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-black/30 hover:bg-black/60 p-3 rounded-full transition-all disabled:opacity-30 hidden sm:block"
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
            >
              <ChevronRight size={32} />
            </button>

            {/* Main Image Container */}
            <div
              className="relative max-w-5xl w-full max-h-[85vh] flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage}
                alt="Enlarged view"
                className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-300"
              />

              {/* Caption */}
              {images[currentIndex]?.title && (
                <div className="mt-4 bg-black/60 text-white px-6 py-2 rounded-full backdrop-blur-sm text-center">
                  <p className="font-medium text-sm sm:text-base">
                    {images[currentIndex].title}
                  </p>
                </div>
              )}

              {/* Counter */}
              <div className="absolute top-[-30px] sm:top-auto sm:bottom-[-40px] text-white/50 text-sm">
                {currentIndex + 1} / {images.length}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Gallery;
