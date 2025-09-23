import React, { useEffect, useState } from "react";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import { Helmet } from "react-helmet-async"; // ✅ Helmet for SEO

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

function Gallary() {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch gallery images from backend
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await axios.get(`${SERVER_URL}/api/gallery`);
        setImages(res.data.data);
      } catch (error) {
        console.error("Error fetching images:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, []);

  const nextImage = () => {
    const nextIndex = (currentIndex + 1) % images.length;
    setCurrentIndex(nextIndex);
    setSelectedImage(images[nextIndex]?.url);
  };

  const prevImage = () => {
    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    setCurrentIndex(prevIndex);
    setSelectedImage(images[prevIndex]?.url);
  };

  return (
    <>
      {/* ✅ SEO Helmet */}
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

      <div className="py-16 px-4 md:px-16 bg-gray-50 min-h-screen mt-12 md:mt-24 mb-[-2rem]">
        <h2 className="text-4xl font-bold text-center text-green-700 mb-10">
          Church Moments Gallery ✨
        </h2>

        {/* Loading Spinner */}
        {loading && (
          <div className="flex justify-center items-center py-10">
            <CircularProgress color="success" size={60} />
          </div>
        )}

        {/* Error */}
        {error && (
          <p className="text-center text-red-600 font-semibold bg-red-100 p-4 rounded-lg shadow-md mt-6">
            Error: {error}
          </p>
        )}

        {/* Gallery Grid */}
        <div className="columns-2 sm:columns-3 md:columns-4 gap-4 space-y-4">
          {images.map((img, idx) => (
            <div
              key={img._id}
              className="break-inside-avoid overflow-hidden rounded-lg cursor-pointer shadow-md hover:shadow-xl transition duration-300"
              onClick={() => {
                setSelectedImage(img.url);
                setCurrentIndex(idx);
              }}
            >
              <img
                src={img.url}
                alt={`Church gallery pic ${idx + 1}`}
                className="w-full object-cover transition duration-300 hover:scale-105"
                loading="lazy" // ✅ Better performance
              />
            </div>
          ))}
        </div>

        {/* Modal */}
        {selectedImage && (
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setSelectedImage(null)}
          >
            <div
              className="relative max-w-4xl w-full p-4"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Left Arrow */}
              <button
                className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 text-white text-4xl bg-black/30 hover:bg-black/50 p-2 rounded-full transition z-20"
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
              >
                &#10094;
              </button>

              {/* Display Image */}
              <img
                src={images[currentIndex]?.url}
                alt="Enlarged church gallery pic"
                className="w-full h-auto rounded-lg shadow-lg transition-all duration-500 scale-105"
              />

              {/* Right Arrow */}
              <button
                className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 text-white text-4xl bg-black/30 hover:bg-black/50 p-2 rounded-full transition"
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
              >
                &#10095;
              </button>

              <p className="text-white text-center mt-4 text-sm">
                Click anywhere to close
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Gallary;
