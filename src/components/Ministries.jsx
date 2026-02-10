// import React, { useEffect } from "react";
// import AOS from "aos";
// import "aos/dist/aos.css";
// import { Link } from "react-router-dom";
// import { ArrowRight } from "lucide-react";

// function Ministries() {
//   useEffect(() => {
//     AOS.init({ duration: 1000 });
//   }, []);

//   const ministries = [
//   {
//     title: "Revelation of Love Ministry",
//     short: "Uplifting Christ, loving one another, and proclaiming the everlasting Gospel.",
//     full: "The Revelation of Love Ministers, originally Silent Ministers Ministry (founded in 2002), are dedicated to uplifting Christ, promoting reforms, and proclaiming the three angels’ message through evangelism, health reform, music ministry, and Bible study.",
//     delay: 0,
//     color: "green",
//   },
//   {
//     title: "Heavenly Voyagers",
//     short: "Spreading the Gospel through missions, discipleship, and service.",
//     full: "Founded in 2014 and revived in 2015, Heavenly Voyagers has grown into Student and Associate chapters, carrying out evangelistic campaigns, medical missionary work, Bible study, choir training, and annual December missions across Kenya.",
//     delay: 100,
//     color: "purple",
//   },
//   {
//     title: "Calvary Ministers",
//     short: "Training faithful leaders through fellowship, reformation, and outreach.",
//     full: "Calvary Ministers began in 2024 as a Bible study group and became a full supporting ministry in 2025. With programs in medical missionary training, Voice of Prophecy, and gospel outreach, they nurture dependable stewards of the Three Angels’ Message.",
//     delay: 200,
//     color: "yellow",
//   },
// ];


//   const getButtonClasses = (color) => {
//     switch (color) {
//       case "green":
//         return "bg-green-600 hover:bg-green-700";
//       case "purple":
//         return "bg-purple-600 hover:bg-purple-700";
//       case "yellow":
//         return "bg-yellow-500 hover:bg-yellow-600";
//       default:
//         return "bg-gray-600 hover:bg-gray-700";
//     }
//   };

//   return (
//     <section className="bg-white py-20 px-6 md:mt-20 mt-8" data-aos="fade-up">
//       <div className="max-w-7xl mx-auto">
//         <h1
//           className="text-4xl font-bold text-center text-green-900 mb-12"
//           data-aos="fade-down"
//         >
//           Explore Our Ministries
//         </h1>
//         <p
//           className="text-center text-gray-600 max-w-2xl mx-auto mb-16"
//           data-aos="fade-up"
//         >
//           Our ministries are the heartbeat of our community — each designed to
//           serve, uplift, and draw people closer to God in unique ways.
//         </p>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
//           {ministries.map((ministry, idx) => (
//             <div
//               key={idx}
//               className="bg-green-50 p-6 rounded-2xl shadow hover:shadow-lg transition duration-300 flex flex-col justify-between"
//               data-aos="zoom-in"
//               data-aos-delay={ministry.delay}
//             >
//               <div>
//                 <h2 className="text-2xl font-semibold text-green-800 mb-3">
//                   {ministry.title}
//                 </h2>
//                 <p className="text-gray-700 italic mb-2">"{ministry.short}"</p>
//                 <p className="text-gray-600 text-sm mb-4">{ministry.full}</p>
//               </div>

//               {/* Learn More Button */}
//               <Link
//                 to={
//                   ministry.title === "Revelation of Love Ministry"
//                     ? "/ministries/revelation-of-love"
//                     : ministry.title === "Heavenly Voyagers"
//                     ? "/ministries/heavenly-voyagers"
//                     : "/ministries/calvary-ministers"
//                 }
//                 className={`group inline-flex items-center justify-center gap-2 mt-4 px-5 py-2 
//                   text-white font-semibold rounded-full 
//                   shadow-md transition-all duration-300 ease-in-out ${getButtonClasses(
//                     ministry.color
//                   )}`}
//               >
//                 Learn More
//                 <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
//               </Link>

//               {/* Join Button */}
//               <div className="mt-auto text-center">
//                 <Link
//                   to={`/ministries/join/${encodeURIComponent(ministry.title)}`}
//                   className={`inline-block mt-4 px-5 py-2 text-white font-medium rounded-xl transition shadow ${getButtonClasses(
//                     ministry.color
//                   )}`}
//                 >
//                   Join This Ministry
//                 </Link>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }

// export default Ministries;


import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Link } from "react-router-dom";
import { ArrowRight, Heart, Plane, Cross } from "lucide-react";

// Helper for consistent theme styling
const THEME_STYLES = {
  green: {
    border: "border-green-600",
    text: "text-green-700",
    bg: "bg-green-50",
    btn: "bg-green-700 hover:bg-green-800",
    lightBtn: "text-green-700 hover:text-green-900",
    iconBg: "bg-green-100",
  },
  purple: {
    border: "border-purple-600",
    text: "text-purple-700",
    bg: "bg-purple-50",
    btn: "bg-purple-700 hover:bg-purple-800",
    lightBtn: "text-purple-700 hover:text-purple-900",
    iconBg: "bg-purple-100",
  },
  amber: {
    border: "border-amber-500",
    text: "text-amber-700",
    bg: "bg-amber-50",
    btn: "bg-amber-600 hover:bg-amber-700",
    lightBtn: "text-amber-700 hover:text-amber-900",
    iconBg: "bg-amber-100",
  },
};

const MINISTRIES_DATA = [
  {
    title: "Revelation of Love Ministry",
    path: "/ministries/revelation-of-love",
    short: "Uplifting Christ, loving one another, and proclaiming the everlasting Gospel.",
    full: "Dedicated to uplifting Christ, promoting reforms, and proclaiming the three angels’ message through evangelism, health reform, music ministry, and Bible study.",
    color: "green",
    icon: Heart,
  },
  {
    title: "Heavenly Voyagers",
    path: "/ministries/heavenly-voyagers",
    short: "Spreading the Gospel through missions, discipleship, and service.",
    full: "Carrying out evangelistic campaigns, medical missionary work, Bible study, choir training, and annual December missions across Kenya.",
    color: "purple",
    icon: Plane,
  },
  {
    title: "Calvary Ministers",
    path: "/ministries/calvary-ministers",
    short: "Training faithful leaders through fellowship, reformation, and outreach.",
    full: "Nurturing dependable stewards of the Three Angels’ Message through medical missionary training, Voice of Prophecy, and gospel outreach.",
    color: "amber", // Changed yellow to amber for better text contrast
    icon: Cross,
  },
];

function Ministries() {
  useEffect(() => {
    AOS.init({ duration: 800, easing: "ease-out-cubic", once: true });
  }, []);

  return (
    <section className="bg-gray-50 py-8 mt-[-4rem] md:mt-0 px-6 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#166534 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16" data-aos="fade-down">
          <span className="text-green-600 font-semibold tracking-wider uppercase text-sm">Our Mission Fields</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mt-2 mb-6">
            Explore Our Ministries
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Our ministries are the heartbeat of our community — each designed to serve, uplift, and draw people closer to God in unique ways.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {MINISTRIES_DATA.map((ministry, idx) => {
            const theme = THEME_STYLES[ministry.color];
            const Icon = ministry.icon;

            return (
              <div
                key={idx}
                className={`group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border-t-4 ${theme.border} flex flex-col h-full`}
                data-aos="fade-up"
                data-aos-delay={idx * 100}
              >
                <div className="p-8 flex flex-col flex-grow">
                  {/* Icon Header */}
                  <div className={`w-14 h-14 ${theme.iconBg} ${theme.text} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon size={28} strokeWidth={2} />
                  </div>

                  <h2 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-gray-900">
                    {ministry.title}
                  </h2>
                  
                  <p className={`font-medium ${theme.text} italic mb-4 text-sm`}>
                    "{ministry.short}"
                  </p>
                  
                  <div className="w-full h-px bg-gray-100 mb-4"></div>
                  
                  <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-grow">
                    {ministry.full}
                  </p>

                  {/* Actions Footer */}
                  <div className="flex items-center justify-between mt-auto pt-4">
                    <Link
                      to={ministry.path}
                      className={`inline-flex items-center gap-1 font-semibold text-sm transition-colors ${theme.lightBtn}`}
                    >
                      Read More <ArrowRight className="w-4 h-4" />
                    </Link>

                    <Link
                      to={`/ministries/join/${encodeURIComponent(ministry.title)}`}
                      className={`px-5 py-2.5 rounded-lg text-white text-sm font-semibold shadow-md transition-transform active:scale-95 hover:-translate-y-0.5 ${theme.btn}`}
                    >
                      Join Now
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Ministries;