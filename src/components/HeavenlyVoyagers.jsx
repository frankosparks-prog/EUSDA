import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  Target,
  Cross,
  History,
  Globe,
  ListChecks,
  ArrowLeft,
  Plane,
  MapPin,
  CalendarDays,
  Heart
} from "lucide-react";

function HeavenlyVoyagers() {
  useEffect(() => {
    AOS.init({ duration: 800, easing: "ease-out-cubic", once: true });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 w-full overflow-x-hidden mt-[-12rem] md:mt-[-5rem]">
      {/* SEO */}
      <Helmet>
        <title>Heavenly Voyagers Ministry | EUSDA</title>
        <meta
          name="description"
          content="Discover Heavenly Voyagers Ministry at Egerton University SDA Church — dedicated to gospel outreach, missions, Bible studies, and service through faith-driven programs."
        />
        <meta
          name="keywords"
          content="Heavenly Voyagers, EUSDA, Egerton University SDA Church, Missions, Ministry, Evangelism, Bible Study, Medical Missionary"
        />
        <link rel="canonical" href="https://eusda.co.ke/ministries/heavenly-voyagers" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Heavenly Voyagers Ministry",
            url: "https://eusda.co.ke/ministries/heavenly-voyagers",
            logo: "https://eusda.co.ke/eusda-logo.png",
            description: "Dedicated to spreading the gospel through evangelism, missions, Bible studies...",
            foundingDate: "2014",
            parentOrganization: {
              "@type": "Organization",
              name: "Egerton University SDA Church",
            },
          })}
        </script>
      </Helmet>

      {/* 🌌 Hero Section */}
      <section className="relative bg-purple-900 text-white py-20 px-6 overflow-hidden">
        {/* Starry Background Pattern */}
        <div className="absolute inset-0 opacity-20" 
             style={{ backgroundImage: "radial-gradient(#ffffff 1.5px, transparent 1.5px), radial-gradient(#ffffff 1px, transparent 1px)", backgroundSize: "50px 50px, 20px 20px", backgroundPosition: "0 0, 25px 25px" }}>
        </div>
        
        <div className="relative max-w-4xl mx-auto text-center" data-aos="zoom-in">
          <div className="inline-flex items-center gap-2 bg-purple-800/50 backdrop-blur-md px-4 py-1.5 rounded-full text-purple-200 text-sm font-medium mb-6 border border-purple-700/50">
            <Plane size={16} className="text-purple-300" /> Est. 2014 • Western Kenya Conference
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight leading-tight">
            Heavenly Voyagers Ministry
          </h1>
          <p className="text-lg md:text-xl text-purple-100 leading-relaxed max-w-2xl mx-auto">
            Journeying together in faith. A fellowship-driven ministry dedicated to spreading the gospel 
            and touching lives through missions and service.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-16 -mt-10 relative z-10">
        
        {/* Mission & Vision Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Mission */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border-t-4 border-purple-600 hover:-translate-y-1 transition-transform duration-300" data-aos="fade-up" data-aos-delay="0">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-6 text-purple-600">
              <Target size={28} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Mission Statement</h2>
            <ul className="space-y-3 text-gray-600">
              <li className="flex gap-3">
                <span className="text-purple-500 font-bold">•</span>
                To proclaim the three angels’ message according to Rev. 14:6-11 (the present truth).
              </li>
              <li className="flex gap-3">
                <span className="text-purple-500 font-bold">•</span>
                To fill societal gaps requiring professional attention, such as medical missionary work.
              </li>
            </ul>
          </div>

          {/* Vision */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border-t-4 border-purple-400 hover:-translate-y-1 transition-transform duration-300" data-aos="fade-up" data-aos-delay="100">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-6 text-purple-600">
              <Cross size={28} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Vision Statement</h2>
            <p className="text-gray-600 leading-relaxed">
              To enhance spiritual growth and discipleship within and without 
              through evangelistic campaigns and other Biblically centered activities.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Left Column: History & Missions */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* History Section */}
            <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100" data-aos="fade-up">
              <div className="flex items-center gap-3 mb-8">
                <History className="text-purple-700" size={24} />
                <h2 className="text-2xl font-bold text-gray-900">Our History</h2>
              </div>
              
              <div className="relative border-l-2 border-purple-100 pl-8 ml-2 space-y-10">
                <div className="relative">
                  <div className="absolute -left-[41px] top-1 w-6 h-6 bg-purple-600 rounded-full border-4 border-white shadow-sm"></div>
                  <h3 className="text-lg font-bold text-gray-900">2014: Inception</h3>
                  <p className="text-gray-600 mt-2">
                    Began under the Western Kenya Conference Students Association. Initially faced dormancy but the vision remained alive.
                  </p>
                </div>
                
                <div className="relative">
                  <div className="absolute -left-[41px] top-1 w-6 h-6 bg-purple-400 rounded-full border-4 border-white shadow-sm"></div>
                  <h3 className="text-lg font-bold text-gray-900">2016: Rebranding</h3>
                  <p className="text-gray-600 mt-2">
                    Revived after a mission at Mwiruti Langas and officially renamed <strong>Heavenly Voyagers Ministry</strong>.
                  </p>
                </div>

                <div className="relative">
                  <div className="absolute -left-[41px] top-1 w-6 h-6 bg-purple-200 rounded-full border-4 border-white shadow-sm"></div>
                  <h3 className="text-lg font-bold text-gray-900">Today: Growth</h3>
                  <p className="text-gray-600 mt-2">
                    Expanded into <strong>Student</strong> and <strong>Associate Chapters</strong>. Despite COVID-19 interruptions in 2020, we resumed full operations in 2021.
                  </p>
                </div>
              </div>
            </section>

            {/* Past Missions Grid */}
            <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100" data-aos="fade-up">
               <div className="flex items-center gap-3 mb-6">
                <Globe className="text-purple-700" size={24} />
                <h2 className="text-2xl font-bold text-gray-900">Mission Fields</h2>
              </div>
              <p className="text-gray-500 mb-6 text-sm">We have been privileged to serve in various locations across Kenya:</p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { place: "Bokoli Market", year: "2016" },
                  { place: "Machakha", year: "2017" },
                  { place: "Kiminini", year: "2018" },
                  { place: "Matharu", year: "2019" },
                  { place: "Rurigi Buntforest", year: "2021" },
                  { place: "Mt. Elgon", year: "2022" },
                  { place: "Kuresoi", year: "2023" },
                  { place: "Kisumu Nyamasaria", year: "2024" },
                  { place: "Masurura (Narok)", year: "2025" },
                ].map((mission, idx) => (
                  <div key={idx} className="bg-purple-50 p-3 rounded-lg text-center hover:bg-purple-100 transition-colors">
                    <MapPin size={16} className="mx-auto text-purple-400 mb-1" />
                    <span className="block font-bold text-gray-800 text-sm">{mission.place}</span>
                    <span className="block text-xs text-purple-600 font-medium">{mission.year}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column: Programs & Actions */}
          <div className="space-y-8">
            {/* Programs Card */}
            <section className="bg-purple-50 p-8 rounded-2xl sticky top-24" data-aos="fade-left">
              <div className="flex items-center gap-3 mb-6">
                <ListChecks className="text-purple-700" size={24} />
                <h2 className="text-xl font-bold text-purple-900">Our Programs</h2>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {[
                  "Bible Studies",
                  "Medical Missionary Training",
                  "Voice of Prophecy",
                  "Prayer Sessions",
                  "Choir Ministry",
                  "Charity Visitations",
                  "Annual December Missions"
                ].map((program, index) => (
                  <span key={index} className="px-3 py-1.5 bg-white text-purple-800 text-sm font-medium rounded-md shadow-sm border border-purple-100">
                    {program}
                  </span>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-purple-200">
                 <div className="flex items-center gap-3 mb-2 text-purple-800 font-semibold">
                    <CalendarDays size={20} />
                    <span>Join Us Weekly</span>
                 </div>
                 <p className="text-sm text-purple-700/80">
                   We meet regularly for fellowship, prayer, and mission planning. Check church announcements for times.
                 </p>
              </div>
            </section>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-16 flex flex-col sm:flex-row justify-center gap-4 border-t border-gray-200 pt-10" data-aos="fade-up">
          <Link
            to="/ministries"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white border border-gray-300 text-gray-700 font-semibold rounded-full hover:bg-gray-50 transition-all duration-300 shadow-sm"
          >
            <ArrowLeft size={18} /> Back to Ministries
          </Link>
          
          <Link
            to="/ministries/join/Heavenly%20Voyagers"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-purple-700 text-white font-semibold rounded-full shadow-lg hover:bg-purple-800 hover:-translate-y-1 transition-all duration-300"
          >
            Join Heavenly Voyagers <Plane size={18} className="text-purple-300" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default HeavenlyVoyagers;