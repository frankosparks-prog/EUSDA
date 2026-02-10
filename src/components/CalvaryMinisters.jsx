import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  Cross,
  History,
  Target,
  ListChecks,
  ArrowLeft,
  BookOpen,
  Music,
  HeartPulse,
  Mic2
} from "lucide-react";

function CalvaryMinisters() {
  useEffect(() => {
    AOS.init({ duration: 800, easing: "ease-out-cubic", once: true });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pt-20 font-sans text-gray-800 mt-[-9rem] md:mt-[-5rem] overflow-x-hidden">
      {/* SEO */}
      <Helmet>
        <title>Calvary Ministers | EUSDA</title>
        <meta
          name="description"
          content="Learn about Calvary Ministers at Egerton University Seventh-day Adventist Church — building strong spiritual leaders through fellowship, reformation, and gospel-centered service."
        />
        <meta
          name="keywords"
          content="Calvary Ministers, EUSDA, Egerton University SDA Church, Mission, Vision, Ministry, Fellowship, Gospel Outreach"
        />
        <link rel="canonical" href="https://eusda.co.ke/ministries/calvary-ministers" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Calvary Ministers",
            url: "https://eusda.co.ke/ministries/calvary-ministers",
            logo: "https://eusda.co.ke/eusda-logo.png",
            description: "Building strong spiritual leaders through fellowship, reformation, and gospel-centered service.",
            foundingDate: "2024",
            parentOrganization: {
              "@type": "Organization",
              name: "Egerton University SDA Church",
            },
          })}
        </script>
      </Helmet>

      {/* 🌅 Hero Section */}
      <section className="relative bg-amber-900 text-white py-20 px-6 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10" 
             style={{ backgroundImage: "radial-gradient(#fbbf24 1px, transparent 1px)", backgroundSize: "30px 30px" }}>
        </div>
        
        <div className="relative max-w-4xl mx-auto text-center" data-aos="zoom-in">
          <div className="inline-flex items-center gap-2 bg-amber-800/50 backdrop-blur-md px-4 py-1.5 rounded-full text-amber-200 text-sm font-medium mb-6 border border-amber-700/50">
            <Cross size={16} className="text-amber-400" /> Est. 2024 • Supporting Ministry
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight leading-tight">
            Calvary Ministers
          </h1>
          <p className="text-lg md:text-xl text-amber-100 leading-relaxed max-w-2xl mx-auto">
            Building strong spiritual leaders through fellowship, reformation, and gospel-centered service. 
            Preparing a people for the eternal joy of heaven.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-16 -mt-10 relative z-10">
        
        {/* Mission & Vision Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Mission */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border-t-4 border-amber-600 hover:-translate-y-1 transition-transform duration-300" data-aos="fade-up" data-aos-delay="0">
            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center mb-6 text-amber-600">
              <Target size={28} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Mission Statement</h2>
            <p className="text-gray-600 leading-relaxed italic">
              "To reproof, correct, and instruct in righteousness so that the children of God 
              may be perfect and thoroughly furnished in all good works."
            </p>
            <div className="mt-4 text-sm font-semibold text-amber-700 bg-amber-50 inline-block px-3 py-1 rounded-md">
              Based on 2 Timothy 3:16-17
            </div>
          </div>

          {/* Vision */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border-t-4 border-amber-400 hover:-translate-y-1 transition-transform duration-300" data-aos="fade-up" data-aos-delay="100">
            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center mb-6 text-amber-600">
              <Cross size={28} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Vision Statement</h2>
            <p className="text-gray-600 leading-relaxed">
              To lead individuals into a profound relationship with God, inspiring them to 
              wholeheartedly align their lives with His will, and thereby prepare for the eternal joy of heaven.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Left Column: History */}
          <div className="lg:col-span-2 space-y-10">
            <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100" data-aos="fade-up">
              <div className="flex items-center gap-3 mb-8">
                <History className="text-amber-700" size={24} />
                <h2 className="text-2xl font-bold text-gray-900">Our Origins</h2>
              </div>
              
              <div className="relative border-l-2 border-amber-200 pl-8 ml-2 space-y-10">
                <div className="relative">
                  <div className="absolute -left-[41px] top-1 w-6 h-6 bg-amber-600 rounded-full border-4 border-white shadow-sm"></div>
                  <h3 className="text-lg font-bold text-gray-900">2024: Foundations</h3>
                  <p className="text-gray-600 mt-2">
                    Began as a humble Bible study group driven by a desire for deeper truth. 
                    Founding leaders <strong>Elder Henry Odondi</strong> (Advisor) and <strong>Sister Lucy Ondimu</strong> (First Chairperson) laid the groundwork.
                  </p>
                </div>
                
                <div className="relative">
                  <div className="absolute -left-[41px] top-1 w-6 h-6 bg-amber-400 rounded-full border-4 border-white shadow-sm"></div>
                  <h3 className="text-lg font-bold text-gray-900">2025: Establishment</h3>
                  <p className="text-gray-600 mt-2">
                    Officially recognized as a supporting ministry within EUSDA. grew rapidly to 
                    <strong> 45 dedicated members</strong> committed to the Three Angels' Message.
                  </p>
                </div>

                <div className="relative">
                  <div className="absolute -left-[41px] top-1 w-6 h-6 bg-amber-200 rounded-full border-4 border-white shadow-sm"></div>
                  <h3 className="text-lg font-bold text-gray-900">Our Focus</h3>
                  <p className="text-gray-600 mt-2">
                    We remain committed to <strong>reformation, gospel outreach, and worldwide missions</strong>, 
                    strengthening fidelity to God among students.
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Programs & Actions */}
          <div className="space-y-8">
            {/* Programs Card */}
            <section className="bg-amber-50 p-8 rounded-2xl sticky top-24" data-aos="fade-left">
              <div className="flex items-center gap-3 mb-6">
                <ListChecks className="text-amber-700" size={24} />
                <h2 className="text-xl font-bold text-amber-900">Core Programs</h2>
              </div>
              
              <ul className="space-y-4">
                {[
                  { name: "Medical Missionary Training", icon: HeartPulse },
                  { name: "In-Depth Bible Study", icon: BookOpen },
                  { name: "Voice of Prophecy", icon: Mic2 },
                  { name: "Music Ministry Training", icon: Music },
                ].map((program, index) => (
                  <li key={index} className="flex items-center gap-3 bg-white p-3 rounded-lg shadow-sm text-gray-700 font-medium">
                    <div className="bg-amber-100 p-2 rounded-full text-amber-700">
                      <program.icon size={18} />
                    </div>
                    {program.name}
                  </li>
                ))}
              </ul>
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
            to="/ministries/join/Calvary%20Ministers"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-amber-700 text-white font-semibold rounded-full shadow-lg hover:bg-amber-800 hover:-translate-y-1 transition-all duration-300"
          >
            Join Calvary Ministers <Cross size={18} className="text-amber-300" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CalvaryMinisters;