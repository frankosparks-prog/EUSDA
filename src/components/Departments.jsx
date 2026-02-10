// import React, { useEffect, useState } from "react";
// import AOS from "aos";
// import "aos/dist/aos.css";
// import {
//   Users,
//   FileText,
//   Users2,
//   Wallet,
//   Smile,
//   ClipboardCheck,
//   BookOpenCheck,
//   HandHeart,
//   Baby,
//   Network,
//   Target,
//   Hammer,
//   Coins,
//   HeartPulse,
//   Library,
//   Music2,
//   Truck,
//   Megaphone,
//   HandHelping,
//   Compass,
//   Stethoscope,
//   ScrollText,
//   HandCoins,
//   Handshake,
//   UserCheck,
//   UserPlus,
// } from "lucide-react";
// import { Helmet } from "react-helmet-async";

// function Departments() {
//   const [showAll, setShowAll] = useState(false);
//   useEffect(() => {
//     AOS.init({ duration: 1000 });
//   }, []);

//   const departments = [
//     {
//       title: "Elder’s Council",
//       description:
//         "Provides spiritual leadership, supervises all departments, and supports doctrinal integrity.",
//       icon: <Users size={40} className="text-green-700 mx-auto" />,
//     },
//     {
//       title: "Secretary’s Office",
//       description:
//         "Maintains records, handles correspondence, keeps membership lists, and documents meetings.",
//       icon: <FileText size={40} className="text-green-700 mx-auto" />,
//     },
//     {
//       title: "Class Sabbath School",
//       description:
//         "Coordinates class-based spiritual activities, fosters member engagement through class reps.",
//       icon: <Users2 size={40} className="text-green-700 mx-auto" />,
//     },
//     {
//       title: "Treasury Department",
//       description:
//         "Manages EUSDA’s finances, keeps accounts, and prepares financial reports.",
//       icon: <Wallet size={40} className="text-green-700 mx-auto" />,
//     },
//     {
//       title: "Deaconry Department",
//       description:
//         "Handles venue preparation, member welfare, and ushers during services. Deaconesses assist especially in women's needs and communion services.",
//       icon: <Smile size={40} className="text-green-700 mx-auto" />,
//     },
//     {
//       title: "Audit Department",
//       description:
//         "Ensures constitutional compliance, audits finances and ministries, and handles member clearances.",
//       icon: <ClipboardCheck size={40} className="text-green-700 mx-auto" />,
//     },
//     {
//       title: "Sabbath School Department",
//       description:
//         "Plans and executes Sabbath school programs, lesson discussions, and distributes study materials.",
//       icon: <BookOpenCheck size={40} className="text-green-700 mx-auto" />,
//     },
//     {
//       title: "Personal Ministry",
//       description:
//         "Leads outreach, visitation, and evangelism. Also coordinates Sabbath worship and prepares bulletins.",
//       icon: <HandHeart size={40} className="text-green-700 mx-auto" />,
//     },
//     {
//       title: "Children Ministry",
//       description:
//         "Focuses on spiritual growth and education of children through faith-based programs.",
//       icon: <Baby size={40} className="text-green-700 mx-auto" />,
//     },
//     {
//       title: "Public Campus Ministries",
//       description:
//         "Links EUSDA to other Adventist university groups and plans joint events like rallies and retreats.",
//       icon: <Network size={40} className="text-green-700 mx-auto" />,
//     },
//     {
//       title: "Interest Coordination",
//       description:
//         "Tracks and follows up with individuals showing interest in the church and supports evangelism.",
//       icon: <Target size={40} className="text-green-700 mx-auto" />,
//     },
//     {
//       title: "Church Development Committee",
//       description:
//         "Plans and manages fundraising and church infrastructure projects, including the Gate to Heaven (GTH) building program.",
//       icon: <Hammer size={40} className="text-green-700 mx-auto" />,
//     },
//     {
//       title: "Stewardship Department",
//       description:
//         "Educates members on responsible giving, budgeting, and resource management in the church.",
//       icon: <Coins size={40} className="text-green-700 mx-auto" />,
//     },
//     {
//       title: "Social, Health & Temperance Department",
//       description:
//         "Organizes social and health events and promotes healthy living and temperance.",
//       icon: <HeartPulse size={40} className="text-green-700 mx-auto" />,
//     },
//     {
//       title: "Publishing Department",
//       description:
//         "Manages church library materials, literature evangelism, and promotes spiritual reading.",
//       icon: <Library size={40} className="text-green-700 mx-auto" />,
//     },
//     {
//       title: "Music Department",
//       description:
//         "Leads and coordinates church music, singing groups, and instrumentalists for worship.",
//       icon: <Music2 size={40} className="text-green-700 mx-auto" />,
//     },
//     {
//       title: "Transport & Public Address Department",
//       description:
//         "Manages church transport logistics and PA system setup, maintenance, and training.",
//       icon: <Truck size={40} className="text-green-700 mx-auto" />,
//     },
//     {
//       title: "Communication & Publicity Department",
//       description:
//         "Handles publicity, online platforms, and visual support during church functions.",
//       icon: <Megaphone size={40} className="text-green-700 mx-auto" />,
//     },
//     {
//       title: "Prayer and Fellowship Department",
//       description:
//         "Organizes devotions, vespers, prayer meetings, and fosters a culture of prayer.",
//       icon: <HandHelping size={40} className="text-green-700 mx-auto" />,
//     },
//     {
//       title: "Master Guide Department",
//       description:
//         "Trains members in leadership and spiritual discipline through the Master Guide curriculum.",
//       icon: <Compass size={40} className="text-green-700 mx-auto" />,
//     },
//     {
//       title: "Medical Missionary Department",
//       description:
//         "Promotes healthful living, conducts medical outreach, and educates on vegetarian diets.",
//       icon: <Stethoscope size={40} className="text-green-700 mx-auto" />,
//     },
//     {
//       title: "Voice of Prophecy Department",
//       description:
//         "Focuses on Bible prophecy studies, outreach to non-Adventists, and shielding members from doctrinal errors.",
//       icon: <ScrollText size={40} className="text-green-700 mx-auto" />,
//     },
//     {
//       title: "Charity Department",
//       description:
//         "Organizes support for the needy, including hospital and children’s home visits.",
//       icon: <HandCoins size={40} className="text-green-700 mx-auto" />,
//     },
//     {
//       title: "Adventist Muslim Relations Department",
//       description:
//         "Trains members for respectful outreach to Muslims and builds cross-cultural understanding.",
//       icon: <Handshake size={40} className="text-green-700 mx-auto" />,
//     },
//     {
//       title: "ALO & AMO Department",
//       description:
//         "Supports and empowers SDA ladies through forums, visitations, and spiritual growth. And engages SDA men in social, physical, and spiritual development activities.",
//       icon: <UserPlus size={40} className="text-green-700 mx-auto" />,
//     },
//     {
//       title: "EUSDA Chaplaincy Office",
//       description:
//         "Composed of the Chaplain and Patron(s), they offer spiritual guidance, mentorship, and liaison with the university and church conference.",
//       icon: <UserCheck size={40} className="text-green-700 mx-auto" />,
//     },
//   ];

//   return (
//     <div className="departments-page mt-16">
//       {/* ✅ SEO Helmet */}
//       <Helmet>
//         <title>EUSDA Departments | Egerton University SDA Church</title>
//         <meta
//           name="description"
//           content="Explore the various EUSDA departments at Egerton University SDA Church. Discover opportunities for ministry, leadership, outreach, and service."
//         />
//         <meta
//           name="keywords"
//           content="EUSDA, Egerton University SDA, SDA Church, Church Departments, Ministry, Volunteer, Outreach, Egerton"
//         />
//         <meta name="author" content="Egerton University SDA" />

//         {/* Open Graph (Facebook & LinkedIn) */}
//         <meta
//           property="og:title"
//           content="EUSDA Departments | Egerton University SDA"
//         />
//         <meta
//           property="og:description"
//           content="Join and serve in EUSDA departments. From leadership, outreach, to health ministry—there’s a place for you in our family."
//         />
//         <meta
//           property="og:image"
//           content="https://eusda.co.ke/eusda-logo.png"
//         />
//         <meta property="og:url" content="https://eusda.co.ke/departments" />
//         <meta property="og:type" content="website" />

//         {/* Twitter Card */}
//         <meta name="twitter:card" content="summary_large_image" />
//         <meta
//           name="twitter:title"
//           content="EUSDA Departments | Egerton University SDA"
//         />
//         <meta
//           name="twitter:description"
//           content="Discover opportunities for ministry and service at EUSDA departments, Egerton University SDA Church."
//         />
//         <meta
//           name="twitter:image"
//           content="https://eusda.co.ke/eusda-logo.png"
//         />

//         {/* Canonical URL */}
//         <link rel="canonical" href="https://eusda.co.ke/departments" />

//         {/* Structured Data (JSON-LD) for SEO */}
//         <script type="application/ld+json">
//           {JSON.stringify({
//             "@context": "https://schema.org",
//             "@type": "Organization",
//             name: "Egerton University SDA",
//             url: "https://eusda.co.ke/departments",
//             logo: "https://eusda.co.ke/eusda-logo.png",
//             sameAs: [
//               "https://facebook.com/eusda",
//               "https://twitter.com/eusda",
//               "https://instagram.com/eusda",
//             ],
//             department: departments.map((dept) => ({
//               "@type": "Organization",
//               name: dept.title,
//               description: dept.description,
//             })),
//           })}
//         </script>
//       </Helmet>
//       {/* Hero Section */}
//       <section
//         className="relative h-[60vh] flex items-center justify-center text-white text-center"
//         style={{
//           backgroundImage: "url(https://picsum.photos/400/250?random=5)",
//           backgroundSize: "cover",
//           backgroundPosition: "center",
//         }}
//       >
//         <div className="absolute inset-0 bg-black bg-opacity-60"></div>
//         <div className="relative z-10 px-6">
//           <h1 className="text-5xl font-extrabold mb-4">Our Departments</h1>
//           <p className="text-lg max-w-xl mx-auto">
//             Discover the departments that keep EUSDA alive and thriving.
//           </p>
//         </div>
//       </section>

//       {/* Departments Section */}
//       <section className="bg-gray-50 py-20 px-6">
//         <h2
//           className="text-3xl font-bold text-center text-green-800 mb-12"
//           data-aos="fade-up"
//         >
//           Ministry Through Service
//         </h2>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
//           {(showAll ? departments : departments.slice(0, 9)).map(
//             (dept, index) => (
//               <div
//                 key={index}
//                 className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300 text-center"
//                 data-aos="zoom-in"
//                 data-aos-delay={index * 80}
//               >
//                 <div className="mb-4">{dept.icon}</div>
//                 <h3 className="text-xl font-semibold text-green-800 mb-2">
//                   {dept.title}
//                 </h3>
//                 <p className="text-gray-600">{dept.description}</p>
//               </div>
//             )
//           )}
//         </div>
//         <div className="text-center mt-10">
//           <button
//             onClick={() => setShowAll(!showAll)}
//             className="text-green-700 border border-green-700 hover:bg-green-700 hover:text-white transition duration-300 px-6 py-2 rounded-full shadow-md font-semibold"
//             data-aos="fade-up"
//           >
//             {showAll ? "Show Less" : "Show More"}
//           </button>
//         </div>
//       </section>

//       {/* Join a Department Section */}
//       <section
//         className="bg-green-100 py-20 px-6 text-center mb-[-2rem]"
//         data-aos="fade-up"
//       >
//         <h2 className="text-3xl font-bold text-green-900 mb-6">
//           Join a Department
//         </h2>
//         <p className="text-lg max-w-2xl mx-auto text-green-800 mb-8">
//           Are you passionate about serving? There’s a place for you in our
//           departments. Get involved and be part of the EUSDA family.
//         </p>
//         <a
//           href="/departments/join"
//           className="inline-block bg-green-700 hover:bg-green-800 text-white py-3 px-6 rounded-full shadow-md transition duration-300"
//         >
//           Get Involved
//         </a>
//       </section>
//       {/* <Footer /> */}
//     </div>
//   );
// }

// export default Departments;


import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  Users, FileText, Users2, Wallet, Smile, ClipboardCheck, BookOpenCheck,
  HandHeart, Baby, Network, Target, Hammer, Coins, HeartPulse, Library,
  Music2, Truck, Megaphone, HandHelping, Compass, Stethoscope, ScrollText,
  HandCoins, Handshake, UserCheck, UserPlus, ChevronDown, ChevronUp
} from "lucide-react";
import { Helmet } from "react-helmet-async";

// Data moved outside component to prevent re-creation on re-renders
const DEPARTMENTS_DATA = [
  {
    title: "Elder’s Council",
    description: "Provides spiritual leadership, supervises all departments, and supports doctrinal integrity.",
    icon: Users,
  },
  {
    title: "Secretary’s Office",
    description: "Maintains records, handles correspondence, keeps membership lists, and documents meetings.",
    icon: FileText,
  },
  {
    title: "Class Sabbath School",
    description: "Coordinates class-based spiritual activities, fosters member engagement through class reps.",
    icon: Users2,
  },
  {
    title: "Treasury Department",
    description: "Manages EUSDA’s finances, keeps accounts, and prepares financial reports.",
    icon: Wallet,
  },
  {
    title: "Deaconry Department",
    description: "Handles venue preparation, member welfare, and ushers during services.",
    icon: Smile,
  },
  {
    title: "Audit Department",
    description: "Ensures constitutional compliance, audits finances and ministries, and handles member clearances.",
    icon: ClipboardCheck,
  },
  {
    title: "Sabbath School Department",
    description: "Plans and executes Sabbath school programs, lesson discussions, and distributes study materials.",
    icon: BookOpenCheck,
  },
  {
    title: "Personal Ministry",
    description: "Leads outreach, visitation, and evangelism. Also coordinates Sabbath worship bulletins.",
    icon: HandHeart,
  },
  {
    title: "Children Ministry",
    description: "Focuses on spiritual growth and education of children through faith-based programs.",
    icon: Baby,
  },
  {
    title: "Public Campus Ministries",
    description: "Links EUSDA to other Adventist university groups and plans joint events like rallies.",
    icon: Network,
  },
  {
    title: "Interest Coordination",
    description: "Tracks and follows up with individuals showing interest in the church and supports evangelism.",
    icon: Target,
  },
  {
    title: "Church Development",
    description: "Plans and manages fundraising and church infrastructure projects, including the GTH building.",
    icon: Hammer,
  },
  {
    title: "Stewardship",
    description: "Educates members on responsible giving, budgeting, and resource management.",
    icon: Coins,
  },
  {
    title: "Social, Health & Temperance",
    description: "Organizes social and health events and promotes healthy living and temperance.",
    icon: HeartPulse,
  },
  {
    title: "Publishing Department",
    description: "Manages church library materials, literature evangelism, and promotes spiritual reading.",
    icon: Library,
  },
  {
    title: "Music Department",
    description: "Leads and coordinates church music, singing groups, and instrumentalists for worship.",
    icon: Music2,
  },
  {
    title: "Transport & PA",
    description: "Manages church transport logistics and PA system setup, maintenance, and training.",
    icon: Truck,
  },
  {
    title: "Communication",
    description: "Handles publicity, online platforms, and visual support during church functions.",
    icon: Megaphone,
  },
  {
    title: "Prayer and Fellowship",
    description: "Organizes devotions, vespers, prayer meetings, and fosters a culture of prayer.",
    icon: HandHelping,
  },
  {
    title: "Master Guide",
    description: "Trains members in leadership and spiritual discipline through the Master Guide curriculum.",
    icon: Compass,
  },
  {
    title: "Medical Missionary",
    description: "Promotes healthful living, conducts medical outreach, and educates on vegetarian diets.",
    icon: Stethoscope,
  },
  {
    title: "Voice of Prophecy",
    description: "Focuses on Bible prophecy studies and shielding members from doctrinal errors.",
    icon: ScrollText,
  },
  {
    title: "Charity Department",
    description: "Organizes support for the needy, including hospital and children’s home visits.",
    icon: HandCoins,
  },
  {
    title: "Adventist Muslim Relations",
    description: "Trains members for respectful outreach to Muslims and builds cross-cultural understanding.",
    icon: Handshake,
  },
  {
    title: "ALO & AMO",
    description: "Supports and empowers SDA ladies and men through forums, visitations, and spiritual growth.",
    icon: UserPlus,
  },
  {
    title: "Chaplaincy Office",
    description: "Offers spiritual guidance, mentorship, and liaison with the university and church conference.",
    icon: UserCheck,
  },
];

function Departments() {
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 800, easing: "ease-in-out", once: true });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pt-16 font-sans text-gray-800 mt-[-8rem] md:mt-[-4rem]">
      <Helmet>
        <title>EUSDA Departments | Egerton University SDA Church</title>
        <meta
          name="description"
          content="Explore the various EUSDA departments at Egerton University SDA Church. Discover opportunities for ministry, leadership, outreach, and service."
        />
        <meta
          name="keywords"
          content="EUSDA, Egerton University SDA, SDA Church, Church Departments, Ministry, Volunteer, Outreach, Egerton"
        />
        <meta name="author" content="Egerton University SDA" />

        {/* Open Graph (Facebook & LinkedIn) */}
        <meta
          property="og:title"
          content="EUSDA Departments | Egerton University SDA"
        />
        <meta
          property="og:description"
          content="Join and serve in EUSDA departments. From leadership, outreach, to health ministry—there’s a place for you in our family."
        />
        <meta
          property="og:image"
          content="https://eusda.co.ke/eusda-logo.png"
        />
        <meta property="og:url" content="https://eusda.co.ke/departments" />
        <meta property="og:type" content="website" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="EUSDA Departments | Egerton University SDA"
        />
        <meta
          name="twitter:description"
          content="Discover opportunities for ministry and service at EUSDA departments, Egerton University SDA Church."
        />
        <meta
          name="twitter:image"
          content="https://eusda.co.ke/eusda-logo.png"
        />

        {/* Canonical URL */}
        <link rel="canonical" href="https://eusda.co.ke/departments" />

        {/* Structured Data (JSON-LD) for SEO */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Egerton University SDA",
            url: "https://eusda.co.ke/departments",
            logo: "https://eusda.co.ke/eusda-logo.png",
            sameAs: [
              "https://facebook.com/eusda",
              "https://twitter.com/eusda",
              "https://instagram.com/eusda",
            ],
            department: DEPARTMENTS_DATA.map((dept) => ({
              "@type": "Organization",
              name: dept.title,
              description: dept.description,
            })),
          })}
        </script>
      </Helmet>

      {/* Hero Section - Modern Gradient */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden bg-green-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-800 to-green-950 opacity-100"></div>
        {/* Subtle Pattern Overlay */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)", backgroundSize: "30px 30px" }}></div>
        
        <div className="relative z-10 px-6 text-center text-white max-w-3xl" data-aos="fade-up">
          <span className="inline-block py-1 px-3 rounded-full bg-green-700/50 border border-green-600 text-sm font-medium mb-4 backdrop-blur-sm">
            Ministry & Service
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
            Our Departments
          </h1>
          <p className="text-lg md:text-xl text-green-100 leading-relaxed">
            Discover the heartbeat of EUSDA. From leadership to outreach, explore how we serve our community and grow together in faith.
          </p>
        </div>
      </section>

      {/* Departments Grid */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-green-900" data-aos="fade-up">
            Find Your Place to Serve
          </h2>
          <div className="w-16 h-1 bg-green-600 mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(showAll ? DEPARTMENTS_DATA : DEPARTMENTS_DATA.slice(0, 9)).map((dept, index) => (
            <div
              key={index}
              className="group bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out"
              data-aos="fade-up"
              data-aos-delay={index % 3 * 100} // Staggered delay based on column
            >
              <div className="flex flex-col items-center text-center h-full">
                <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-6 group-hover:bg-green-600 transition-colors duration-300">
                  <dept.icon 
                    size={32} 
                    className="text-green-700 group-hover:text-white transition-colors duration-300" 
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-700 transition-colors">
                  {dept.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {dept.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Show More Button */}
        <div className="mt-16 text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="group relative inline-flex items-center gap-2 px-8 py-3 bg-white border border-green-200 text-green-800 font-semibold rounded-full hover:bg-green-50 hover:border-green-300 transition-all shadow-sm"
          >
            {showAll ? "Show Less" : "View All Departments"}
            {showAll ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-green-900 py-24 px-6 relative overflow-hidden">
        {/* Background Decorative Circles */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-green-800 rounded-full mix-blend-multiply filter blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-green-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-x-1/2 translate-y-1/2"></div>

        <div className="relative z-10 max-w-4xl mx-auto text-center" data-aos="zoom-in">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-lg text-green-100 mb-10 max-w-2xl mx-auto">
            "Each of you should use whatever gift you have received to serve others, as faithful stewards of God’s grace in its various forms." — 1 Peter 4:10
          </p>
          <a
            href="/departments/join"
            className="inline-block bg-white text-green-900 hover:bg-green-50 font-bold py-4 px-10 rounded-full shadow-lg hover:shadow-green-900/50 transform hover:-translate-y-1 transition-all duration-300"
          >
            Get Involved Today
          </a>
        </div>
      </section>
    </div>
  );
}

export default Departments;