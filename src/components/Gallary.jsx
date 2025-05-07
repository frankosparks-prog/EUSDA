// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom"; // <-- for back navigation
// import Footer from "./Footer";

// const images = [
//   "https://picsum.photos/seed/a/600/400",
//   "https://picsum.photos/seed/b/600/400",
//   "https://picsum.photos/seed/c/600/400",
//   "https://picsum.photos/seed/d/600/400",
//   "https://picsum.photos/seed/e/600/400",
//   "https://picsum.photos/seed/f/600/400",
//   "https://picsum.photos/seed/g/600/400",
//   "https://picsum.photos/seed/h/600/400",
//   "https://picsum.photos/seed/i/600/400",
// ];

// function Gallary() {
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const navigate = useNavigate();

//   const nextImage = () => {
//     setCurrentIndex((prevIndex) =>
//       prevIndex === images.length - 1 ? 0 : prevIndex + 1
//     );
//   };

//   const prevImage = () => {
//     setCurrentIndex((prevIndex) =>
//       prevIndex === 0 ? images.length - 1 : prevIndex - 1
//     );
//   };

//   return (
//     <>
//       <div className="py-16 px-4 md:px-16 bg-gray-50 min-h-screen mt-20 md:mt-32 mb-[-2rem] relative">
//         {/* Back Arrow */}
//         <button
//           onClick={() => navigate(-1)}
//           className="absolute left-4 top-4 md:top-10 md:left-10 text-green-700 text-2xl md:text-3xl font-bold hover:text-green-900 transition"
//         >
//           ← Back
//         </button>

//         <h2 className="text-4xl font-bold text-center text-green-700 mb-10">
//           Church Moments Gallery ✨
//         </h2>

//         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
//           {images.map((src, idx) => (
//             <div
//               key={idx}
//               className="overflow-hidden rounded-lg cursor-pointer shadow-md hover:shadow-xl transition duration-300"
//               onClick={() => {
//                 setSelectedImage(src);
//                 setCurrentIndex(idx);
//               }}
//             >
//               <img
//                 src={src}
//                 alt={`Gallery ${idx}`}
//                 className="w-full h-48 object-cover transform hover:scale-105 transition duration-300"
//               />
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
//               <button
//                 className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-3xl"
//                 onClick={prevImage}
//               >
//                 &#10094;
//               </button>

//               <img
//                 src={images[currentIndex]}
//                 alt="Enlarged"
//                 className="w-full h-auto rounded-lg shadow-lg transition-all duration-500 scale-105"
//               />

//               <button
//                 className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-3xl"
//                 onClick={nextImage}
//               >
//                 &#10095;
//               </button>

//               <p className="text-white text-center mt-4">Click anywhere to close</p>
//             </div>
//           </div>
//         )}
//       </div>
//       <Footer />
//     </>
//   );
// }

// export default Gallary;

import React, { useState } from "react";
import Footer from "./Footer";

const images = [
  "https://picsum.photos/seed/a/600/400",
  "https://picsum.photos/seed/b/600/400",
  "https://picsum.photos/seed/c/600/400",
  "https://picsum.photos/seed/d/600/400",
  "https://picsum.photos/seed/e/600/400",
  "https://picsum.photos/seed/f/600/400",
  "https://picsum.photos/seed/g/600/400",
  "https://picsum.photos/seed/h/600/400",
  "https://picsum.photos/seed/i/600/400",
];

function Gallary() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
    setSelectedImage(images[(currentIndex + 1) % images.length]);
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
    setSelectedImage(
      images[(currentIndex - 1 + images.length) % images.length]
    );
  };

  return (
    <>
      <div className="py-16 px-4 md:px-16 bg-gray-50 min-h-screen mt-20 md:mt-32 mb-[-2rem]">
        <h2 className="text-4xl font-bold text-center text-green-700 mb-10">
          Church Moments Gallery ✨
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((src, idx) => (
            <div
              key={idx}
              className="overflow-hidden rounded-lg cursor-pointer shadow-md hover:shadow-xl transition duration-300"
              onClick={() => {
                setSelectedImage(src);
                setCurrentIndex(idx);
              }}
            >
              <img
                src={src}
                alt={`Gallery ${idx}`}
                className="w-full h-48 object-cover transform hover:scale-105 transition duration-300"
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
                src={images[currentIndex]}
                alt="Enlarged"
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
      <Footer />
    </>
  );
}

export default Gallary;
