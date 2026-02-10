import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { Target, Cross, History, ListChecks, ArrowLeft, Heart, BookOpen, Quote } from "lucide-react";

function RevelationOfLove() {
  useEffect(() => {
    AOS.init({ 
      duration: 800, 
      easing: "ease-out-cubic", 
      once: true,
      // This setting helps prevent AOS from causing horizontal scroll on mobile
      mirror: false 
    });
  }, []);

  return (
    // 1. overflow-x-hidden: Cuts off the "white space" on the right side
    // 2. w-full: Ensures the page takes exactly 100% width
    // 3. pt-24: Pushes content down safely below the Navbar (adjust if needed)
    <div className="min-h-screen bg-gray-50 pt-24 w-full overflow-x-hidden mt-[-12rem] md:mt-[-5rem]">
      
      {/* ✅ SEO Meta Tags */}
      <Helmet>
        <title>Revelation of Love Ministry | EUSDA Egerton</title>
        <meta name="description" content="Revelation of Love Ministry..." />
      </Helmet>

      {/* 🌿 Hero Section */}
      {/* w-full ensures the green background hits both edges of the phone */}
      <section className="relative w-full bg-green-900 text-white py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-10" 
             style={{ backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)", backgroundSize: "30px 30px" }}>
        </div>
        
        <div className="relative max-w-4xl mx-auto text-center" data-aos="fade-down">
          <div className="inline-flex items-center gap-2 bg-green-800/50 backdrop-blur-sm px-4 py-1.5 rounded-full text-green-200 text-sm font-medium mb-6 border border-green-700">
            <Heart size={16} className="fill-green-200" /> Formerly Silent Ministers (Est. 2002)
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
            Revelation of Love Ministry
          </h1>
          <p className="text-lg md:text-xl text-green-100 leading-relaxed max-w-2xl mx-auto">
            A Christ-centered ministry dedicated to uplifting Jesus, loving one another, 
            and proclaiming the everlasting Gospel.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-16 relative z-10">
        
        {/* Mission & Vision Grid */}
        {/* Removed negative margin so it stacks naturally below the hero */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Mission */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border-t-4 border-green-600 hover:-translate-y-1 transition-transform duration-300" data-aos="fade-up" data-aos-delay="0">
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mb-6 text-green-600">
              <Target size={28} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Mission Statement</h2>
            <p className="text-gray-600 leading-relaxed">
              To uplift Christ, love one another, and proclaim the Gospel to all nations, 
              ensuring the message of His love reaches every heart.
            </p>
          </div>

          {/* Vision */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border-t-4 border-green-500 hover:-translate-y-1 transition-transform duration-300" data-aos="fade-up" data-aos-delay="100">
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mb-6 text-green-600">
              <Cross size={28} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Vision Statement</h2>
            <p className="text-gray-600 leading-relaxed">
              To proclaim the three angels’ message in line with the Great Commission found in:
            </p>
            <div className="flex gap-3 mt-4 text-sm font-semibold text-green-700 bg-green-50 p-3 rounded-lg inline-block">
              <BookOpen size={18} /> <span>Matthew 28:19 & Revelation 14:6</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Left Column: History */}
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100" data-aos="fade-up">
              <div className="flex items-center gap-3 mb-6">
                <History className="text-green-700" size={24} />
                <h2 className="text-2xl font-bold text-gray-900">Our History</h2>
              </div>
              
              <div className="relative border-l-2 border-green-200 pl-6 space-y-8 ml-2">
                <div className="relative">
                  <span className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-green-600 ring-4 ring-white"></span>
                  <h3 className="text-lg font-bold text-gray-800">2002: The Beginning</h3>
                  <p className="text-gray-600 mt-2">
                    A few students zealous for Christ met daily in the Lower Pavilion for prayer. 
                    Christ impressed them to share the light via weekly articles on noticeboards. 
                    These quiet efforts gave birth to the name <strong>"Silent Ministers Ministry"</strong>.
                  </p>
                </div>
                
                <div className="relative">
                  <span className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-green-400 ring-4 ring-white"></span>
                  <h3 className="text-lg font-bold text-gray-800">2021: A New Name</h3>
                  <p className="text-gray-600 mt-2">
                    The name was officially changed to <strong>The Revelation of Love Ministers</strong> to reflect our vocal proclamation of the Gospel.
                  </p>
                </div>

                <div className="relative">
                  <span className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-green-200 ring-4 ring-white"></span>
                  <h3 className="text-lg font-bold text-gray-800">Today: Reformation</h3>
                  <p className="text-gray-600 mt-2">
                    God uses this ministry to promote reforms in EUSDA — focusing on health reform 
                    (diet & dress), music ministry, and strengthening the prayer band.
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Programmes & Actions */}
          <div className="space-y-8">
            {/* Programmes Card */}
            <section className="bg-green-50 p-8 rounded-2xl" data-aos="fade-left">
              <div className="flex items-center gap-3 mb-6">
                <ListChecks className="text-green-700" size={24} />
                <h2 className="text-xl font-bold text-green-900">Core Programmes</h2>
              </div>
              <ul className="space-y-3">
                {[
                  "Evangelism Missions & Training",
                  "Health Webinars & Reform",
                  "Voice of Prophecy",
                  "Music School (Choir)",
                  "In-depth Bible Study"
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3 bg-white p-3 rounded-lg shadow-sm text-gray-700 text-sm font-medium">
                    <div className="min-w-[6px] h-[6px] rounded-full bg-green-500 mt-2"></div>
                    {item}
                  </li>
                ))}
              </ul>
            </section>
            
            {/* Scripture Quote Box */}
            <div className="bg-green-800 text-green-100 p-8 rounded-2xl relative overflow-hidden" data-aos="zoom-in">
              <Quote className="absolute top-4 right-4 text-green-600/30" size={60} />
              <p className="italic relative z-10 text-lg font-serif">
                "And I saw another angel fly in the midst of heaven, having the everlasting gospel to preach unto them that dwell on the earth..."
              </p>
              <p className="mt-4 font-bold text-white text-right">— Revelation 14:6</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-16 flex flex-col sm:flex-row justify-center gap-4 border-t border-gray-200 pt-10" data-aos="fade-up">
          <Link
            to="/ministries"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white border border-gray-300 text-gray-700 font-semibold rounded-full hover:bg-gray-50 transition-all duration-300"
          >
            <ArrowLeft size={18} /> Back to Ministries
          </Link>
          
          <Link
            to="/ministries/join/Revelation%20of%20Love%20Ministry"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-green-700 text-white font-semibold rounded-full shadow-lg hover:bg-green-800 hover:-translate-y-1 transition-all duration-300"
          >
            Join This Ministry <Heart size={18} className="fill-green-400 text-green-400" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RevelationOfLove;