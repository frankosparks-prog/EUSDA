import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  Church,
  Users,
  Handshake,
  ImageIcon,
  ArrowRight,
  BookOpen,
  Heart,
  MapPin,
  Calendar,
  Sparkles,
} from "lucide-react";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const Home = () => {
  const [galleryImages, setGalleryImages] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true }); // 'once: true' makes animations smoother on scroll up/down

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

  // Slider Logic
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % (galleryImages.length || 1));
    }, 5000); // Increased to 5s for better readability
    return () => clearInterval(interval);
  }, [galleryImages]);

  return (
    <div className="flex flex-col min-h-screen mt-[-4rem] md:mt-0">
      <Helmet>
        <title>EUSDA | Egerton University SDA Church</title>
        <meta
          name="description"
          content="Welcome to EUSDA Church — a place where hearts are healed, hope is restored, and lives are transformed by God's amazing love. Join us every Sabbath."
        />
        <meta
          name="keywords"
          content="EUSDA, Egerton University SDA, SDA Church Kenya, Adventist Church, Egerton Church, Christian fellowship, Worship, Ministries"
        />
        <meta name="author" content="EUSDA" />
        <link rel="canonical" href="https://eusda.co.ke/" />

        {/* Open Graph (Facebook/LinkedIn) */}
        <meta
          property="og:title"
          content="EUSDA | Egerton University SDA Church"
        />
        <meta
          property="og:description"
          content="A place to be, where hearts are healed, hope is restored, and lives are transformed by God's amazing love."
        />
        <meta property="og:url" content="https://eusda.co.ke/" />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content={
            galleryImages[0]?.url || "https://eusda.co.ke/eusda-logo.png"
          }
        />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="EUSDA | Egerton University SDA Church"
        />
        <meta
          name="twitter:description"
          content="Join EUSDA for worship, community, and service. A place where hearts are healed and hope is restored."
        />
        <meta
          name="twitter:image"
          content={
            galleryImages[0]?.url || "https://eusda.co.ke/eusda-logo.png"
          }
        />

        {/* Schema.org JSON-LD for Google */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Church",
            name: "EUSDA - Egerton University SDA Church",
            url: "https://eusda.co.ke",
            description:
              "EUSDA is a family of believers at Egerton University. Worship, connect, and grow with us in Christ every Sabbath.",
            address: {
              "@type": "PostalAddress",
              streetAddress: "Egerton University",
              addressLocality: "Egerton",
              addressCountry: "Kenya",
            },
            sameAs: [
              "https://www.facebook.com/eusdaofficial",
              "https://x.com/egertonunisda",
              "https://whatsapp.com/channel/0029VbBZptUGOj9pt3EoVt38",
              "https://vm.tiktok.com/ZMABWehGC/",
            ],
          })}
        </script>
      </Helmet>

      {/* 1. HERO SECTION */}
      <div className="relative min-h-[85vh] w-full overflow-hidden flex items-center">
        {/* Slider Background */}
        {galleryImages.length > 0 ? (
          galleryImages.map((img, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <img
                src={img.url}
                alt="Hero Slide"
                className="w-full h-full object-cover animate-slowZoom" // Added slow zoom effect
              />
              {/* Gradient Overlay: Stronger at bottom for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-green-950/90 via-black/50 to-black/30" />
            </div>
          ))
        ) : (
          /* Fallback if no images */
          <div className="absolute inset-0 bg-green-950 flex items-center justify-center">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          </div>
        )}

        {/* Hero Content */}
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center text-center px-4 md:px-6 max-w-5xl mx-auto pt-20 pb-12 md:py-0">
          {/* Welcome Home Badge */}

          <div className="relative mb-8 animate-fadeIn">
            {/* 1. Atmospheric Glow Behind */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-32 bg-green-500/30 blur-[80px] rounded-full pointer-events-none mix-blend-screen animate-glow-pulse"></div>

            {/* 2. The Container */}
            <div className="relative flex flex-col items-center">
              {/* Icon with gentle float */}
              <Sparkles
                size={32}
                className="text-green-300 mb-2 animate-gentle-float drop-shadow-[0_0_10px_rgba(134,239,172,0.8)]"
              />

              {/* Shimmering Text */}
              <h2 className="text-2xl md:text-3xl font-black tracking-[0.2em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-white via-green-200 to-white animate-shimmer-text bg-[length:200%_auto]">
                Welcome Home
              </h2>

              {/* Subtle Underline Separator */}
              <div className="w-16 h-1 bg-gradient-to-r from-transparent via-green-500/50 to-transparent rounded-full mt-2 animate-unfold-slow"></div>
            </div>
          </div>

          {/* Main Heading */}
          <h1
            className="text-4xl sm:text-5xl md:text-7xl font-black text-white mb-6 leading-[1.1] tracking-tight drop-shadow-2xl"
            data-aos="fade-up"
          >
            Faith. Family. <br className="md:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-200 relative">
              Fellowship.
            </span>
          </h1>

          {/* Subtitle */}
          <p
            className="text-base sm:text-lg md:text-2xl text-gray-200 mb-8 md:mb-10 max-w-xl md:max-w-2xl leading-relaxed font-medium drop-shadow-md px-2"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            A place to be, where hearts are healed, hope is restored, and lives
            are transformed by God's amazing love.
          </p>

          {/* Buttons */}
          <div
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto px-4 sm:px-0"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <Link
              to="/about"
              className="group w-full sm:w-auto px-8 py-4 bg-green-600 hover:bg-green-500 text-white rounded-full font-bold text-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_10px_20px_-10px_rgba(22,163,74,0.5)] flex items-center justify-center gap-2"
            >
              Start Here
              <ArrowRight
                size={20}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>

            <Link
              to="/events"
              className="group w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 hover:border-green-400/50"
            >
              <Calendar
                size={20}
                className="text-green-300 group-hover:text-white transition-colors"
              />
              Upcoming Events
            </Link>
          </div>
        </div>

        {/* Scroll Indicator (Hidden on very short screens to avoid overlap) */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 animate-bounce text-white/30 hidden md:block">
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center pt-2">
            <div className="w-1 h-2 bg-white rounded-full"></div>
          </div>
        </div>
      </div>

      {/* 2. MISSION & VISION (Clean & Minimal) */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center" data-aos="fade-up">
          <div className="w-16 h-1 bg-green-600 mx-auto mb-6 rounded-full"></div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Our Mission & Vision
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed font-light">
            At EUSDA, we strive to{" "}
            <span className="text-green-700 font-semibold">grow in faith</span>,
            serve our community with compassion, and reflect Christ’s love in
            all we do. Our vision is to be a spirit-filled family that empowers
            every member to live a Christ-centered life.
          </p>
        </div>
      </section>

      {/* 3. MINISTRIES PREVIEW (Modern Cards) */}
      <section className="py-20 px-6 bg-gray-50 relative overflow-hidden">
        {/* Decorative Background blob */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <h2 className="text-sm font-bold text-green-600 uppercase tracking-widest mb-2">
                Ministries
              </h2>
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900">
                Serve & Connect
              </h3>
            </div>
            <Link
              to="/ministries"
              className="text-green-700 font-semibold flex items-center gap-2 hover:gap-3 transition-all group"
            >
              View All Ministries{" "}
              <ArrowRight size={18} className="group-hover:text-green-500" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div
              className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100 group"
              data-aos="fade-up"
            >
              <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 mb-6 group-hover:scale-110 transition-transform">
                <Heart size={28} />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">
                Revelation of Love
              </h4>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Uplifting Christ, loving one another, and proclaiming the
                everlasting Gospel to the world.
              </p>
              <span className="text-green-600 text-sm font-bold flex items-center gap-1 group-hover:translate-x-2 transition-transform cursor-pointer">
                Learn More <ArrowRight size={16} />
              </span>
            </div>

            {/* Card 2 */}
            <div
              className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100 group"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                <Church size={28} />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">
                Heavenly Voyagers
              </h4>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Spreading the Gospel through missions, intense discipleship, and
                community service.
              </p>
              <span className="text-blue-600 text-sm font-bold flex items-center gap-1 group-hover:translate-x-2 transition-transform cursor-pointer">
                Learn More <ArrowRight size={16} />
              </span>
            </div>

            {/* Card 3 */}
            <div
              className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100 group"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 mb-6 group-hover:scale-110 transition-transform">
                <Handshake size={28} />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">
                Calvary Ministers
              </h4>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Training faithful leaders through fellowship, reformation, and
                active outreach.
              </p>
              <span className="text-orange-600 text-sm font-bold flex items-center gap-1 group-hover:translate-x-2 transition-transform cursor-pointer">
                Learn More <ArrowRight size={16} />
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SCRIPTURE HIGHLIGHT (Quote Block) */}
      <section className="py-20 bg-green-900 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
        <div
          className="relative z-10 max-w-4xl mx-auto px-6"
          data-aos="zoom-in"
        >
          <BookOpen className="text-green-300 mx-auto mb-6 w-12 h-12 opacity-80" />
          <blockquote className="text-2xl md:text-4xl font-serif text-white leading-normal italic mb-6">
            “For I know the plans I have for you, declares the Lord, plans to
            prosper you and not to harm you, plans to give you hope and a
            future.”
          </blockquote>
          <cite className="text-green-300 font-bold tracking-widest uppercase not-italic">
            — Jeremiah 29:11
          </cite>
        </div>
      </section>

      {/* 5. GALLERY SECTION (Masonry-style Grid) */}
      <section className="py-20 px-6 bg-white" data-aos="fade-up">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-green-50 text-green-700 font-bold text-xs uppercase tracking-widest mb-4">
              <ImageIcon size={14} /> Gallery
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Church Moments
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px]">
            {galleryImages.length > 0 ? (
              galleryImages.slice(0, 8).map((img, index) => (
                <div
                  key={img._id || index}
                  className={`relative rounded-xl overflow-hidden shadow-md group ${
                    index === 0 || index === 7
                      ? "col-span-2 row-span-2"
                      : "col-span-1 row-span-1"
                  }`}
                  data-aos="fade-up"
                  data-aos-delay={index * 50}
                >
                  <img
                    src={img.url}
                    alt="Gallery"
                    className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition duration-300"></div>
                </div>
              ))
            ) : (
              <p className="col-span-4 text-center text-gray-500 py-10 italic">
                Loading beautiful moments...
              </p>
            )}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/gallery"
              className="inline-block px-8 py-3 border-2 border-green-600 text-green-700 font-bold rounded-full hover:bg-green-600 hover:text-white transition-colors duration-300"
            >
              View Full Gallery
            </Link>
          </div>
        </div>
      </section>

      {/* 6. CTA / FOOTER PREVIEW */}
      <section className="py-20 px-6 bg-green-50">
        <div
          className="max-w-5xl mx-auto bg-green-800 rounded-3xl p-10 md:p-16 text-center text-white relative overflow-hidden shadow-2xl"
          data-aos="zoom-in"
        >
          {/* Circles Decoration */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/5 rounded-full translate-x-1/2 translate-y-1/2"></div>

          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Join Our Family This Sabbath
            </h2>
            <p className="text-green-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
              Whether you are a student, staff, or visitor, there is a place for
              you at EUSDA. We can't wait to meet you!
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/contact"
                className="bg-white text-green-900 px-8 py-4 rounded-full font-bold shadow-lg hover:bg-gray-100 transition flex items-center justify-center gap-2"
              >
                <MapPin size={20} /> Plan Your Visit
              </Link>
              <Link
                to="/contact"
                className="bg-green-700 text-white border border-green-500 px-8 py-4 rounded-full font-bold shadow-lg hover:bg-green-600 transition flex items-center justify-center gap-2"
              >
                <Users size={20} /> Contact Leaders
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
