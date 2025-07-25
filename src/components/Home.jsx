// import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import AOS from 'aos';
// import 'aos/dist/aos.css';

// const SERVER_URL = process.env.REACT_APP_SERVER_URL;

// const Home = () => {
//   const [galleryImages, setGalleryImages] = useState([]);
//   useEffect(() => {
//     AOS.init({
//       duration: 1000,
//       // once: true, // only animate once
//       // offset: 100, // trigger point from top
//     });
//     const fetchGallery = async () => {
//       try {
//         const res = await fetch(`${SERVER_URL}/api/gallery/latest`);
//         const data = await res.json();
//         setGalleryImages(data);
//       } catch (err) {
//         console.error("Failed to load gallery images:", err);
//       }
//     };

//     fetchGallery();
//   }, []);

//   return (
//     <div className="cont">
//       {/* Hero Section */}
//       <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-green-100 to-green-300 text-center px-6 py-12 mt-8" data-aos="fade-up">
//         <h1 className="text-4xl md:text-6xl font-extrabold text-green-900 mb-6 leading-tight">
//           Welcome to EUSDA Family ✝️
//         </h1>

//         <p className="text-lg md:text-2xl text-green-800 mb-10 max-w-2xl">
//           A place to be, where hearts are healed, hope is restored, and lives are transformed by God's amazing love.
//         </p>

//         <div className="flex gap-6">
//           <Link to="/about" className="bg-green-700 hover:bg-green-800 text-white font-bold py-3 px-6 rounded-full shadow-lg transition duration-300">
//             Learn More
//           </Link>
//           <Link to="/events" className="bg-white hover:bg-green-100 text-green-700 font-bold py-3 px-6 rounded-full border-2 border-green-700 shadow-lg transition duration-300">
//             Upcoming Events
//           </Link>
//         </div>

//         <div className="mt-16 italic text-green-900 text-sm md:text-base max-w-md">
//           "Let all that you do be done in love." — 1 Corinthians 16:14
//         </div>
//       </div>

//       {/* Mission & Vision */}
//       <section className="bg-white py-16 px-6 text-center" data-aos="fade-up">
//         <h2 className="text-3xl md:text-4xl font-bold text-green-800 mb-6">Our Mission & Vision</h2>
//         <p className="text-gray-700 max-w-3xl mx-auto text-lg leading-relaxed">
//           At EUSDA, we strive to grow in faith, serve our community with compassion, and reflect Christ’s love in all we do.
//           Our vision is to be a spirit-filled family that empowers every member to live a Christ-centered life.
//         </p>
//       </section>

//       {/* Ministries Preview */}
//       <section className="bg-green-50 py-16 px-6" data-aos="fade-up">
//         <h2 className="text-3xl font-bold text-green-900 text-center mb-10">Our Ministries</h2>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
//           <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition" data-aos="zoom-in">
//             <h3 className="text-xl font-semibold text-green-800 mb-2">Revelation of Love Ministry</h3>
//             <p className="text-gray-700">Empowering the next generation to lead with faith and purpose.</p>
//           </div>
//           <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition" data-aos="zoom-in" data-aos-delay="100">
//             <h3 className="text-xl font-semibold text-green-800 mb-2">Heavenly Voyagers</h3>
//             <p className="text-gray-700">A sisterhood rooted in love, support, and spiritual growth.</p>
//           </div>
//           <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition" data-aos="zoom-in" data-aos-delay="200">
//             <h3 className="text-xl font-semibold text-green-800 mb-2">Calvary ministers</h3>
//             <p className="text-gray-700">Building strong spiritual leaders through fellowship and service.</p>
//           </div>
//         </div>
//         <div className="text-center mt-8">
//           <Link to="/ministries" className="text-green-700 underline font-medium hover:text-green-900">View More About the Ministries →</Link>
//         </div>
//       </section>

//       {/* Scripture Highlight */}
//       <section className="bg-green-200 py-12 px-6 text-center" data-aos="fade-in">
//         <blockquote className="text-2xl italic text-green-900 max-w-3xl mx-auto">
//           “For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you,
//           plans to give you hope and a future.” — Jeremiah 29:11
//         </blockquote>
//       </section>

//       <section className="bg-white py-16 px-6" data-aos="fade-up">
//         <h2 className="text-3xl font-bold text-green-800 text-center mb-10">Church Moments</h2>

//         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
//           {galleryImages.length > 0 ? (
//             galleryImages.map((img, index) => (
//               <img
//                 key={img._id || index}
//                 src={img.url}
//                 alt={img.caption || `Gallery ${index + 1}`}
//                 className="rounded-lg shadow-md w-full h-48 object-cover transform hover:scale-105 transition duration-300"
//                 data-aos="zoom-in"
//                 data-aos-delay={index * 100}
//               />
//             ))
//           ) : (
//             <p className="text-gray-600 col-span-4 text-center">No gallery images found.</p>
//           )}
//         </div>
//         <div className="text-center mt-6">
//           <Link to="/gallery" className="text-green-700 underline font-medium hover:text-green-900">
//             View Full Gallery →
//           </Link>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="bg-green-700 py-16 px-6 text-white text-center mb-[-2rem]" data-aos="zoom-in">
//         <h2 className="text-3xl md:text-4xl font-bold mb-4">You're Welcome to Join Us</h2>
//         <p className="mb-6 text-lg">Come worship, connect, and grow in Christ with us every Sabbath.</p>
//         <Link to="/contact" className="bg-white text-green-700 font-bold py-3 px-6 rounded-full shadow-lg hover:bg-green-100 transition">
//           Contact & Location
//         </Link>
//       </section>

//       {/* <Footer /> */}
//     </div>
//   );
// };

// export default Home;
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  Church,
  Users,
  Handshake,
  ImageIcon,
  MoveRight,
  BookText,
  HeartHandshake,
} from "lucide-react";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const Home = () => {
  const [galleryImages, setGalleryImages] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    AOS.init({ duration: 1000 });

    const fetchGallery = async () => {
      try {
        const res = await fetch(`${SERVER_URL}/api/gallery/latest`);
        const data = await res.json();
        setGalleryImages(data);
      } catch (err) {
        console.error("Failed to load gallery images:", err);
      }
    };

    fetchGallery();
  }, []);

  // Slide interval
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % (galleryImages.length || 1));
    }, 4000);
    return () => clearInterval(interval);
  }, [galleryImages]);

  return (
    <div className="cont md:mt-32 mt-16">
      {/* Hero Section with Slider */}
      <div className="relative w-full overflow-hidden mt-8 text-white">
        {/* Background Image */}
        {galleryImages.length > 0 && (
          <img
            src={galleryImages[currentSlide]?.url}
            alt="Hero Slide"
            className="absolute inset-0 w-full h-full object-cover brightness-75 transition duration-1000"
          />
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70 z-10"></div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-24 md:py-32">
          <h1
            className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight text-green-100 drop-shadow-lg"
            data-aos="fade-up"
          >
            Welcome to EUSDA Family ✝️
          </h1>

          <p
            className="text-lg md:text-2xl mb-10 max-w-2xl text-green-100 drop-shadow-md"
            data-aos="fade-up"
            data-aos-delay="150"
          >
            A place to be, where hearts are healed, hope is restored, and lives
            are transformed by God's amazing love.
          </p>

          <div className="flex gap-6" data-aos="fade-up" data-aos-delay="300">
            <Link
              to="/about"
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-full shadow-lg transition duration-300"
            >
              Learn More
            </Link>
            <Link
              to="/events"
              className="bg-white hover:bg-green-100 text-green-800 font-semibold py-3 px-6 rounded-full shadow-lg border-2 border-green-600 transition duration-300"
            >
              Upcoming Events
            </Link>
          </div>

          <p
            className="mt-16 italic text-green-100 text-sm md:text-base max-w-md"
            data-aos="fade-up"
            data-aos-delay="500"
          >
            "Let all that you do be done in love." — 1 Corinthians 16:14
          </p>
        </div>
      </div>

      {/* Mission & Vision */}
      <section className="bg-white py-16 px-6 text-center" data-aos="fade-up">
        <h2 className="text-3xl md:text-4xl font-bold text-green-800 mb-6 flex items-center justify-center gap-2">
          <BookText className="text-green-700" /> Our Mission & Vision
        </h2>
        <p className="text-gray-700 max-w-3xl mx-auto text-lg leading-relaxed">
          At EUSDA, we strive to grow in faith, serve our community with
          compassion, and reflect Christ’s love in all we do. Our vision is to
          be a spirit-filled family that empowers every member to live a
          Christ-centered life.
        </p>
      </section>

      {/* Ministries Preview */}
      <section className="bg-green-50 py-16 px-6" data-aos="fade-up">
        <h2 className="text-3xl font-bold text-green-900 text-center mb-10 flex justify-center items-center gap-2">
          <Users className="text-green-700" /> Our Ministries
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div
            className="bg-white p-6 rounded-xl shadow hover:shadow-md transition"
            data-aos="zoom-in"
          >
            <h3 className="text-xl font-semibold text-green-800 mb-2 flex items-center gap-2">
              <HeartHandshake /> Revelation of Love
            </h3>
            <p className="text-gray-700">
              Empowering the next generation to lead with faith and purpose.
            </p>
          </div>
          <div
            className="bg-white p-6 rounded-xl shadow hover:shadow-md transition"
            data-aos="zoom-in"
            data-aos-delay="100"
          >
            <h3 className="text-xl font-semibold text-green-800 mb-2 flex items-center gap-2">
              <Church /> Heavenly Voyagers
            </h3>
            <p className="text-gray-700">
              A sisterhood rooted in love, support, and spiritual growth.
            </p>
          </div>
          <div
            className="bg-white p-6 rounded-xl shadow hover:shadow-md transition"
            data-aos="zoom-in"
            data-aos-delay="200"
          >
            <h3 className="text-xl font-semibold text-green-800 mb-2 flex items-center gap-2">
              <Handshake /> Calvary Ministers
            </h3>
            <p className="text-gray-700">
              Building strong spiritual leaders through fellowship and service.
            </p>
          </div>
        </div>
        <div className="text-center mt-8">
          <Link
            to="/ministries"
            className="text-green-700 underline font-medium hover:text-green-900 flex items-center justify-center gap-1"
          >
            View More About the Ministries <MoveRight />
          </Link>
        </div>
      </section>

      {/* Scripture Highlight */}
      <section
        className="bg-green-200 py-12 px-6 text-center"
        data-aos="fade-in"
      >
        <blockquote className="text-2xl italic text-green-900 max-w-3xl mx-auto">
          “For I know the plans I have for you, declares the Lord, plans to
          prosper you and not to harm you, plans to give you hope and a future.”
          — Jeremiah 29:11
        </blockquote>
      </section>

      {/* Gallery Section */}
      <section className="bg-white py-16 px-6" data-aos="fade-up">
        <h2 className="text-3xl font-bold text-green-800 text-center mb-10 flex justify-center gap-2 items-center">
          <ImageIcon className="text-green-700" /> Church Moments
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {galleryImages.length > 0 ? (
            galleryImages.map((img, index) => (
              <img
                key={img._id || index}
                src={img.url}
                alt={img.caption || `Gallery ${index + 1}`}
                className="rounded-lg shadow-md w-full h-48 object-cover transform hover:scale-105 transition duration-300"
                data-aos="zoom-in"
                data-aos-delay={index * 100}
              />
            ))
          ) : (
            <p className="text-gray-600 col-span-4 text-center">
              No gallery images found.
            </p>
          )}
        </div>
        <div className="text-center mt-6">
          <Link
            to="/gallery"
            className="text-green-700 underline font-medium hover:text-green-900 flex items-center justify-center gap-1"
          >
            View Full Gallery <MoveRight />
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="bg-green-700 py-16 px-6 text-white text-center mb-[-2rem]"
        data-aos="zoom-in"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          You're Welcome to Join Us
        </h2>
        <p className="mb-6 text-lg">
          Come worship, connect, and grow in Christ with us every Sabbath.
        </p>
        <Link
          to="/contact"
          className="bg-white text-green-700 font-bold py-3 px-6 rounded-full shadow-lg hover:bg-green-100 transition"
        >
          Contact & Location
        </Link>
      </section>
    </div>
  );
};

export default Home;
