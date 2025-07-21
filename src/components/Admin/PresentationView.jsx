import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  Loader,
  Maximize2,
  ArrowRight,
  ArrowLeft
} from "lucide-react";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

function PresentationView() {
  const [announcements, setAnnouncements] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await axios.get(`${SERVER_URL}/api/announcements`);
        setAnnouncements(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching announcements:", error);
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, []);

  // Fullscreen toggler
  const enterFullScreen = () => {
    if (containerRef.current && !document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => {
        console.error("Failed to enter full-screen mode:", err);
      });
    }
  };

  // Manual navigation
  const goNext = () => {
    setCurrentIndex((prev) =>
      prev + 1 < announcements.length ? prev + 1 : 0
    );
  };

  const goPrev = () => {
    setCurrentIndex((prev) =>
      prev - 1 >= 0 ? prev - 1 : announcements.length - 1
    );
  };

  const current = announcements[currentIndex];

  return (
    <div
      ref={containerRef}
      className="w-full max-w-5xl mx-auto bg-green-50 p-6 rounded-xl shadow flex flex-col items-center justify-center relative"
    >
      {/* Start Fullscreen Button */}
      <button
        onClick={enterFullScreen}
        className="absolute top-4 right-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2"
      >
        <Maximize2 size={16} />
        Fullscreen
      </button>

      {/* Loader */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader className="animate-spin text-green-600" size={40} />
          <span className="text-gray-500 text-lg">Loading announcements...</span>
        </div>
      ) : current ? (
        <>
          <div className="text-center max-w-3xl">
            <h1 className="text-4xl font-bold text-green-800 mb-3">
              {current.title}
            </h1>
            <p className="text-md text-gray-600 mb-2">
              {new Date(current.date).toLocaleDateString()}
            </p>
            <p className="text-xl text-gray-700 whitespace-pre-line">
              {current.description}
            </p>
          </div>

          {/* Navigation Buttons */}
          {announcements.length > 1 && (
            <div className="flex gap-4 mt-8">
              <button
                onClick={goPrev}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded flex items-center gap-2"
              >
                <ArrowLeft size={16} />
                Previous
              </button>
              <button
                onClick={goNext}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2"
              >
                Next
                <ArrowRight size={16} />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-gray-500 py-20">No announcements available.</div>
      )}
    </div>
  );
}

export default PresentationView;
