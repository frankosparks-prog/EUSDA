// import React, { useEffect } from "react";
// import { Helmet } from "react-helmet-async";
// import AOS from "aos";
// import "aos/dist/aos.css";
// import {
//   BookOpen,
//   HeartHandshake,
//   Users,
//   Landmark,
//   Download,
//   Globe,
//   HandHelping,
// } from "lucide-react";

// const About = () => {
//   useEffect(() => {
//     AOS.init({ duration: 1000 });
//   }, []);

//   return (
//     <div className="about-page mt-16">
//       {/* ✅ Helmet SEO */}
//       <Helmet>
//         <title>About Us | EUSDA Church Kenya</title>
//         <meta
//           name="description"
//           content="Learn about the history, mission, and values of the Egerton University Seventh-day Adventist (EUSDA) Church. Discover our faith, beliefs, and community impact."
//         />
//         <meta
//           name="keywords"
//           content="About EUSDA, Egerton University SDA, SDA Church Kenya, Christian values, Seventh-day Adventist beliefs, Adventist Church Eldoret"
//         />
//         <meta name="author" content="EUSDA" />
//         <link rel="canonical" href="https://eusda.co.ke/about" />

//         {/* Open Graph (Facebook/LinkedIn) */}
//         <meta property="og:title" content="About EUSDA Church" />
//         <meta
//           property="og:description"
//           content="Discover our story, core values, and the mission of Egerton University SDA Church in Kenya."
//         />
//         <meta property="og:url" content="https://eusda.co.ke/about" />
//         <meta property="og:type" content="website" />
//         <meta
//           property="og:image"
//           content="https://eusda.co.ke/eusda-logo.png"
//         />

//         {/* Twitter Card */}
//         <meta name="twitter:card" content="summary_large_image" />
//         <meta name="twitter:title" content="About EUSDA Church" />
//         <meta
//           name="twitter:description"
//           content="Learn more about the Egerton University SDA Church — our story, beliefs, and vision."
//         />
//         <meta
//           name="twitter:image"
//           content="https://eusda.co.ke/eusda-logo.png"
//         />

//         {/* Schema.org JSON-LD */}
//         <script type="application/ld+json">
//           {JSON.stringify({
//             "@context": "https://schema.org",
//             "@type": "AboutPage",
//             name: "About EUSDA Church",
//             url: "https://eusda.co.ke/about",
//             description:
//               "EUSDA Church at Egerton University is a vibrant Seventh-day Adventist community rooted in faith, unity, and service. Discover our story, beliefs, and core values.",
//             publisher: {
//               "@type": "Organization",
//               name: "EUSDA Church",
//               url: "https://eusda.co.ke",
//             },
//           })}
//         </script>
//       </Helmet>

//       {/* Hero Section */}
//       <section
//         className="relative bg-cover bg-center bg-no-repeat text-white py-32 px-6"
//         style={{
//           backgroundImage: `url('https://picsum.photos/1200/600?grayscale')`,
//         }}
//         data-aos="fade-down"
//       >
//         <div className="absolute inset-0 bg-black bg-opacity-70"></div>
//         <div className="relative z-10 text-center">
//           <h1 className="text-5xl font-extrabold mb-4">About EUSDA Church</h1>
//           <p className="text-lg max-w-2xl mx-auto">
//             Discover our story, mission, and the heart behind our ministry.
//           </p>
//         </div>
//       </section>

//       {/* Our Story */}
//       <section className="bg-white py-16 px-6 text-center" data-aos="fade-up">
//         <h2 className="text-3xl font-bold text-green-800 mb-6">Our Story</h2>
//         <p className="text-gray-700 max-w-4xl mx-auto text-lg leading-relaxed">
//           The Egerton University Seventh-day Adventist (EUSDA) Church began as a
//           small prayer group and grew into a vibrant spiritual community.
//           Through worship, mentorship, and outreach, we serve our campus and
//           surrounding communities with Christ’s love.
//         </p>
//       </section>

//       {/* Core Values with Icons */}
//       <section className="bg-green-50 py-16 px-6" data-aos="fade-up">
//         <h2 className="text-3xl font-bold text-green-800 text-center mb-10">
//           Our Core Values
//         </h2>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
//           <div
//             className="bg-white p-6 rounded-lg shadow-md text-center"
//             data-aos="zoom-in"
//           >
//             <BookOpen className="text-green-700 mx-auto mb-4" size={32} />
//             <h3 className="text-xl font-semibold text-green-700 mb-2">
//               Faith in God
//             </h3>
//             <p className="text-gray-700">
//               Christ is our foundation. Every gathering, outreach, and prayer
//               begins with Him.
//             </p>
//           </div>
//           <div
//             className="bg-white p-6 rounded-lg shadow-md text-center"
//             data-aos="zoom-in"
//             data-aos-delay="100"
//           >
//             <Users className="text-green-700 mx-auto mb-4" size={32} />
//             <h3 className="text-xl font-semibold text-green-700 mb-2">
//               Unity in Fellowship
//             </h3>
//             <p className="text-gray-700">
//               A spiritual family bound by love, we encourage one another to grow
//               in grace.
//             </p>
//           </div>
//           <div
//             className="bg-white p-6 rounded-lg shadow-md text-center"
//             data-aos="zoom-in"
//             data-aos-delay="200"
//           >
//             <HandHelping className="text-green-700 mx-auto mb-4" size={32} />
//             <h3 className="text-xl font-semibold text-green-700 mb-2">
//               Service to Others
//             </h3>
//             <p className="text-gray-700">
//               Living our faith through action—locally and globally.
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* Beliefs Section */}
//       <section className="bg-white py-16 px-6 text-center" data-aos="fade-up">
//         <h2 className="text-3xl font-bold text-green-800 mb-6">
//           What We Believe
//         </h2>
//         <Globe className="text-green-700 mx-auto mb-4" size={36} />
//         <p className="text-gray-700 max-w-4xl mx-auto text-lg leading-relaxed">
//           We uphold the teachings of the global Seventh-day Adventist Church:
//           the Bible as God’s Word, salvation through Jesus, Sabbath observance,
//           and the hope of His soon return. Our faith shapes our
//           lives—spiritually, socially, and academically.
//         </p>
//       </section>

//       {/* Constitution Section */}
//       <section className="bg-gray-50 px-6 py-16 text-center" data-aos="fade-up">
//         <h2 className="text-4xl font-extrabold text-green-800 mb-6">
//           EUSDA Constitution
//         </h2>
//         <Landmark className="text-green-700 mx-auto mb-4" size={36} />
//         <p className="text-gray-700 max-w-4xl mx-auto text-lg leading-relaxed text-justify">
//           We, the Seventh-Day Adventist students of Egerton University, inspired
//           by the gospel mission and united under God’s purpose, commit ourselves
//           to spiritual service, evangelism, and fellowship. Guided by Biblical
//           principles, we uphold the Great Commission as our lifelong call.
//         </p>
//         <div className="flex justify-center mt-10">
//           <a
//             href="/docs/EUSDA _CONSTITUTION.pdf"
//             download
//             className="flex items-center px-5 py-3 bg-green-700 text-white rounded-full hover:bg-green-800 transition-all duration-300"
//           >
//             <Download className="mr-2" size={20} />
//             Download PDF
//           </a>
//         </div>
//       </section>

//       {/* Join Us Section */}
//       <section
//         className="bg-green-200 py-16 px-6 text-center mt-10"
//         data-aos="zoom-in"
//       >
//         <HeartHandshake className="text-green-800 mx-auto mb-4" size={40} />
//         <h2 className="text-3xl font-bold text-green-900 mb-4">
//           You're Welcome Here!
//         </h2>
//         <p className="text-lg text-green-800 mb-6 max-w-xl mx-auto">
//           Whether you're new to campus, seeking spiritual growth, or simply
//           curious—there’s a place for you at EUSDA.
//         </p>
//         <a
//           href="/contact"
//           className="inline-block bg-green-700 hover:bg-green-800 text-white py-3 px-6 rounded-full shadow-md transition duration-300"
//         >
//           Contact Us
//         </a>
//       </section>
//     </div>
//   );
// };

// export default About;

import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  BookOpen,
  HeartHandshake,
  Users,
  Landmark,
  Download,
  Globe,
  HandHelping,
  ArrowRight,
  CheckCircle2
} from "lucide-react";

const About = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <div className="about-page flex flex-col min-h-screen mt-[-4rem] md:mt-0 overflow-x-hidden">
      {/* ✅ Helmet SEO */}
      <Helmet>
        <title>About Us | EUSDA Church Kenya</title>
        <meta
          name="description"
          content="Learn about the history, mission, and values of the Egerton University Seventh-day Adventist (EUSDA) Church. Discover our faith, beliefs, and community impact."
        />
        <meta
          name="keywords"
          content="About EUSDA, Egerton University SDA, SDA Church Kenya, Christian values, Seventh-day Adventist beliefs, Adventist Church Eldoret"
        />
        <meta name="author" content="EUSDA" />
        <link rel="canonical" href="https://eusda.co.ke/about" />

        {/* Open Graph (Facebook/LinkedIn) */}
        <meta property="og:title" content="About EUSDA Church" />
        <meta
          property="og:description"
          content="Discover our story, core values, and the mission of Egerton University SDA Church in Kenya."
        />
        <meta property="og:url" content="https://eusda.co.ke/about" />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content="https://eusda.co.ke/eusda-logo.png"
        />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About EUSDA Church" />
        <meta
          name="twitter:description"
          content="Learn more about the Egerton University SDA Church — our story, beliefs, and vision."
        />
        <meta
          name="twitter:image"
          content="https://eusda.co.ke/eusda-logo.png"
        />

        {/* Schema.org JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            name: "About EUSDA Church",
            url: "https://eusda.co.ke/about",
            description:
              "EUSDA Church at Egerton University is a vibrant Seventh-day Adventist community rooted in faith, unity, and service. Discover our story, beliefs, and core values.",
            publisher: {
              "@type": "Organization",
              name: "EUSDA Church",
              url: "https://eusda.co.ke",
            },
          })}
        </script>
      </Helmet>

      {/* 1. HERO SECTION */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        {/* Background with Parallax effect */}
        <div 
            className="absolute inset-0 bg-cover bg-center bg-fixed"
            style={{ backgroundImage: `url('https://picsum.photos/1920/1080?grayscale')` }}
        >
            <div className="absolute inset-0 bg-gradient-to-b from-green-900/80 to-black/60"></div>
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto" data-aos="fade-down">
          <span className="inline-block py-1 px-3 rounded-full bg-green-500/20 border border-green-400/30 text-green-100 text-sm font-semibold tracking-wider mb-4 backdrop-blur-md">
            WHO WE ARE
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 drop-shadow-lg">
            About EUSDA Church
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 font-light leading-relaxed">
            Discover our story, our mission, and the heart behind our ministry at Egerton University.
          </p>
        </div>
      </section>

      {/* 2. OUR STORY (Split Layout) */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div data-aos="fade-right">
                <h2 className="text-3xl md:text-4xl font-bold text-green-900 mb-6 relative inline-block">
                    Our Story
                    <span className="absolute bottom-1 left-0 w-full h-2 bg-green-200 -z-10 rounded-full"></span>
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                    The Egerton University Seventh-day Adventist (EUSDA) Church began as a small prayer group and has grown into a vibrant spiritual community. 
                </p>
                <p className="text-gray-600 text-lg leading-relaxed mb-8">
                    Through worship, mentorship, and outreach, we serve our campus and surrounding communities with Christ’s love. We are a home away from home for students, staff, and visitors alike.
                </p>
                <div className="flex gap-4">
                    <div className="flex flex-col">
                        <span className="text-4xl font-bold text-green-600">500+</span>
                        <span className="text-sm text-gray-500 uppercase tracking-wide">Members</span>
                    </div>
                    <div className="w-px bg-gray-300"></div>
                    <div className="flex flex-col">
                        <span className="text-4xl font-bold text-green-600">30+</span>
                        <span className="text-sm text-gray-500 uppercase tracking-wide">Years of Ministry</span>
                    </div>
                </div>
            </div>
            <div className="relative" data-aos="fade-left">
                <div className="absolute inset-0 bg-green-600 rounded-2xl transform translate-x-3 translate-y-3"></div>
                <img 
                    src="https://picsum.photos/600/400" 
                    alt="EUSDA Community" 
                    className="relative rounded-2xl shadow-xl w-full object-cover"
                />
            </div>
        </div>
      </section>

      {/* 3. CORE VALUES (Cards) */}
      <section className="py-8 px-6 bg-gray-50 relative overflow-hidden">
        {/* Background Blob */}
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-16" data-aos="fade-up">
                <h2 className="text-3xl md:text-4xl font-bold text-green-900 mb-4">Our Core Values</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">The principles that guide our worship, fellowship, and service.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Card 1 */}
                <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border-t-4 border-green-500 group" data-aos="fade-up" data-aos-delay="0">
                    <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6 group-hover:scale-110 transition-transform">
                        <BookOpen size={28} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Faith in God</h3>
                    <p className="text-gray-600 leading-relaxed">
                        Christ is our foundation. Every gathering, outreach, and prayer begins with Him as the center of our lives.
                    </p>
                </div>

                {/* Card 2 */}
                <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border-t-4 border-blue-500 group" data-aos="fade-up" data-aos-delay="100">
                    <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                        <Users size={28} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Unity in Fellowship</h3>
                    <p className="text-gray-600 leading-relaxed">
                        A spiritual family bound by love, we encourage one another to grow in grace and walk together in faith.
                    </p>
                </div>

                {/* Card 3 */}
                <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border-t-4 border-orange-500 group" data-aos="fade-up" data-aos-delay="200">
                    <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 mb-6 group-hover:scale-110 transition-transform">
                        <HandHelping size={28} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Service to Others</h3>
                    <p className="text-gray-600 leading-relaxed">
                        Living our faith through action—serving our neighbors locally and globally with compassionate hearts.
                    </p>
                </div>
            </div>
        </div>
      </section>

      {/* 4. WHAT WE BELIEVE */}
      <section className="py-20 px-6 bg-green-900 text-white relative">
        <div className="max-w-5xl mx-auto text-center" data-aos="fade-up">
            <Globe className="text-green-300 mx-auto mb-6 opacity-80" size={48} />
            <h2 className="text-3xl md:text-4xl font-bold mb-8">What We Believe</h2>
            <div className="grid md:grid-cols-2 gap-8 text-left">
                <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm border border-white/10">
                    <h3 className="font-bold text-xl text-green-300 mb-2 flex items-center gap-2"><CheckCircle2 size={20}/> The Bible</h3>
                    <p className="text-green-50/80">We accept the Bible as the only standard of faith and practice for Christians.</p>
                </div>
                <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm border border-white/10">
                    <h3 className="font-bold text-xl text-green-300 mb-2 flex items-center gap-2"><CheckCircle2 size={20}/> Salvation</h3>
                    <p className="text-green-50/80">Salvation is by grace through faith in Jesus Christ alone, not by works.</p>
                </div>
                <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm border border-white/10">
                    <h3 className="font-bold text-xl text-green-300 mb-2 flex items-center gap-2"><CheckCircle2 size={20}/> The Sabbath</h3>
                    <p className="text-green-50/80">We observe the seventh day (Saturday) as the Sabbath of the Lord our God.</p>
                </div>
                <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm border border-white/10">
                    <h3 className="font-bold text-xl text-green-300 mb-2 flex items-center gap-2"><CheckCircle2 size={20}/> Second Coming</h3>
                    <p className="text-green-50/80">We look forward to the literal, visible, and imminent return of Jesus Christ.</p>
                </div>
            </div>
        </div>
      </section>

      {/* 5. CONSTITUTION (Document Section) */}
      <section className="py-20 px-6 bg-white" data-aos="fade-up">
        <div className="max-w-4xl mx-auto bg-gray-50 rounded-3xl p-10 md:p-14 border border-gray-100 shadow-lg text-center">
            <Landmark className="text-green-700 mx-auto mb-6" size={48} />
            <h2 className="text-3xl font-bold text-gray-900 mb-6">EUSDA Constitution</h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-8 italic">
                "We, the Seventh-Day Adventist students of Egerton University, inspired by the gospel mission and united under God’s purpose, commit ourselves to spiritual service, evangelism, and fellowship."
            </p>
            <a
                href="/docs/EUSDA_CONSTITUTION.pdf"
                download
                className="inline-flex items-center px-8 py-4 bg-green-700 text-white font-bold rounded-full hover:bg-green-800 hover:shadow-lg transition-all transform hover:-translate-y-1"
            >
                <Download className="mr-2" size={20} /> Download Constitution PDF
            </a>
        </div>
      </section>

      {/* 6. CTA / FOOTER PREVIEW */}
      <section className="py-24 px-6 bg-gradient-to-br from-green-50 to-green-100 text-center">
         <div className="max-w-3xl mx-auto" data-aos="zoom-in">
            <HeartHandshake className="text-green-600 mx-auto mb-6" size={56} />
            <h2 className="text-4xl font-bold text-green-900 mb-6">You're Welcome Here!</h2>
            <p className="text-xl text-gray-700 mb-10 leading-relaxed">
                Whether you're new to campus, seeking spiritual growth, or simply curious—there’s a place for you at EUSDA.
            </p>
            <a
                href="/contact"
                className="inline-flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white py-4 px-10 rounded-full font-bold shadow-xl transition duration-300"
            >
                Contact Us <ArrowRight size={20} />
            </a>
         </div>
      </section>
    </div>
  );
};

export default About;