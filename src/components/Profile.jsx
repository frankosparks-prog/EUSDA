// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import {
//   Mail,
//   Phone,
//   Facebook,
//   Twitter,
//   MessageCircleMore,
// } from "lucide-react";
// import { Helmet } from "react-helmet-async"; // ✅ For SEO

// const SERVER_URL = process.env.REACT_APP_SERVER_URL;

// function Profile() {
//   const [teamData, setTeamData] = useState({
//     pastors: [],
//     elders: [],
//     ministers: [],
//     departmentHeads: [],
//   });
//   const [selectedPerson, setSelectedPerson] = useState(null);

//   useEffect(() => {
//     const fetchTeam = async () => {
//       try {
//         const response = await axios.get(`${SERVER_URL}/api/leader`);
//         const data = response.data;

//         const grouped = {
//           pastors: [],
//           elders: [],
//           ministers: [],
//           departmentHeads: [],
//         };

//         data.forEach((person) => {
//           const role = person.category.toLowerCase();
//           if (role.includes("pastor")) grouped.pastors.push(person);
//           else if (role.includes("elder")) grouped.elders.push(person);
//           else if (role.includes("minister")) grouped.ministers.push(person);
//           else grouped.departmentHeads.push(person);
//         });

//         setTeamData(grouped);
//       } catch (error) {
//         console.error("Failed to fetch team data:", error);
//       }
//     };

//     fetchTeam();
//   }, []);

//   const handleOpenModal = (person) => setSelectedPerson(person);
//   const handleCloseModal = () => setSelectedPerson(null);

//   const Section = ({ title, description, people }) => (
//     <div className="mb-12">
//       <div className="text-center mb-8">
//         <h2 className="text-3xl md:text-4xl font-bold text-green-800 mb-4">
//           {title}
//         </h2>
//         {description && (
//           <p className="text-gray-600 text-md md:text-lg">{description}</p>
//         )}
//       </div>
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
//         {people.map((person, index) => (
//           <div
//             key={index}
//             className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 text-center"
//           >
//             <img
//               src={person.image || "https://picsum.photos/200"}
//               alt={`${person.name} - ${person.role}`}
//               className="w-32 h-32 mx-auto object-cover rounded-full mb-4 border-4 border-green-200"
//               loading="lazy"
//             />
//             <h2 className="text-xl font-bold text-green-800 mb-2">
//               {person.name}
//             </h2>
//             <p className="text-gray-500 text-sm mb-2">{person.role}</p>

//             {title === "Heads of Departments & Ministries" && (
//               <div className="text-sm text-gray-700 space-y-1 mt-2">
//                 {person.email && (
//                   <p className="flex items-center gap-2 justify-center">
//                     <Mail size={16} />
//                     {person.email}
//                   </p>
//                 )}
//                 {person.phone && (
//                   <p className="flex items-center gap-2 justify-center">
//                     <Phone size={16} />
//                     {person.phone}
//                   </p>
//                 )}
//               </div>
//             )}

//             {person.description && (
//               <>
//                 <p className="text-gray-600 truncate">{person.description}</p>
//                 <button
//                   className="mt-3 text-sm text-green-700 underline"
//                   onClick={() => handleOpenModal(person)}
//                 >
//                   View Bio
//                 </button>
//               </>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );

//   const formatPhoneNumber = (number) => {
//     if (number.startsWith("0")) return `+254${number.slice(1)}`;
//     return number;
//   };

//   return (
//     <>
//       {/* ✅ SEO Helmet */}
//       <Helmet>
//         <title>Church Leadership | Eusda Kenya</title>
//         <meta
//           name="description"
//           content="Meet the church leadership at Eusda Kenya including pastors, elders, ministers, and heads of departments leading various ministries."
//         />
//         <meta
//           name="keywords"
//           content="Church Leadership, Pastors, Elders, Ministers, Church Leaders, Eusda Kenya"
//         />
//         <link rel="canonical" href="https://eusda.co.ke/profiles" />

//         {/* Open Graph */}
//         <meta property="og:title" content="Church Leadership | Eusda Kenya" />
//         <meta
//           property="og:description"
//           content="Learn more about our dedicated church leaders guiding the Eusda Kenya community."
//         />
//         <meta
//           property="og:image"
//           content="https://eusda.co.ke/eusda-logo.png"
//         />
//         <meta property="og:type" content="website" />
//         <meta property="og:url" content="https://eusda.co.ke/profiles" />

//         {/* Twitter */}
//         <meta name="twitter:card" content="summary_large_image" />
//         <meta name="twitter:title" content="Church Leadership | Eusda Kenya" />
//         <meta
//           name="twitter:description"
//           content="Pastors, elders, ministers, and departmental heads serving Eusda Kenya."
//         />
//         <meta
//           name="twitter:image"
//           content="https://eusda.co.ke/eusda-logo.png"
//         />

//         {/* ✅ Structured Data */}
//         <script type="application/ld+json">
//           {JSON.stringify({
//             "@context": "https://schema.org",
//             "@type": "Organization",
//             name: "Eusda Kenya",
//             url: "https://eusda.co.ke",
//             department: [
//               ...teamData.pastors.map((p) => ({
//                 "@type": "Person",
//                 name: p.name,
//                 jobTitle: p.role,
//                 image: p.image,
//                 email: p.email,
//                 telephone: p.phone,
//               })),
//               ...teamData.elders.map((e) => ({
//                 "@type": "Person",
//                 name: e.name,
//                 jobTitle: e.role,
//                 image: e.image,
//                 email: e.email,
//                 telephone: e.phone,
//               })),
//               ...teamData.ministers.map((m) => ({
//                 "@type": "Person",
//                 name: m.name,
//                 jobTitle: m.role,
//                 image: m.image,
//                 email: m.email,
//                 telephone: m.phone,
//               })),
//               ...teamData.departmentHeads.map((d) => ({
//                 "@type": "Person",
//                 name: d.name,
//                 jobTitle: d.role,
//                 image: d.image,
//                 email: d.email,
//                 telephone: d.phone,
//               })),
//             ],
//           })}
//         </script>
//       </Helmet>

//       <div className="bg-gray-50 py-10 px-6 md:px-20 min-h-screen mt-20 md:mt-32">
//         <Section
//           title="Pastors"
//           people={teamData.pastors}
//           description="Our spiritual leaders guiding the entire church."
//         />
//         <Section
//           title="Elders"
//           people={teamData.elders}
//           description="Providing wisdom, oversight, and support to the congregation."
//         />
//         <Section
//           title="Ministry Heads"
//           people={teamData.ministers}
//           description="Serving in key roles across various ministries."
//         />
//         <Section
//           title="Heads of Departments"
//           people={teamData.departmentHeads}
//           description="Leaders responsible for worship, volunteering, children, and more."
//         />
//       </div>

//       {/* Modal */}
//       {selectedPerson && (
//         <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
//             <button
//               onClick={handleCloseModal}
//               className="absolute top-1 right-2 text-gray-500 hover:text-red-500 text-lg font-bold"
//             >
//               &times;
//             </button>
//             <img
//               src={selectedPerson.image || "https://picsum.photos/200"}
//               alt={selectedPerson.name}
//               className="w-32 h-32 mx-auto object-cover rounded-full mb-4 border-4 border-green-200"
//             />
//             <h2 className="text-xl font-bold text-green-800 mb-1 text-center">
//               {selectedPerson.name}
//             </h2>
//             <p className="text-gray-500 text-sm mb-3 text-center">
//               {selectedPerson.role}
//             </p>

//             {selectedPerson.description && (
//               <p className="text-gray-700 mb-4 text-sm">
//                 {selectedPerson.description}
//               </p>
//             )}

//             <div className="text-sm text-gray-700 space-y-1">
//               {selectedPerson.email && (
//                 <p className="flex items-center gap-2">
//                   <Mail size={16} />
//                   <strong>Email:</strong>{" "}
//                   <a
//                     href={`mailto:${selectedPerson.email}`}
//                     className="hover:underline"
//                   >
//                     {selectedPerson.email}
//                   </a>
//                 </p>
//               )}
//               {selectedPerson.phone && (
//                 <p className="flex items-center gap-2">
//                   <Phone size={16} />
//                   <strong>Phone:</strong>{" "}
//                   <a
//                     href={`tel:${formatPhoneNumber(selectedPerson.phone)}`}
//                     className="hover:underline"
//                   >
//                     {selectedPerson.phone}
//                   </a>
//                 </p>
//               )}
//             </div>

//             {selectedPerson.socials && (
//               <div className="flex gap-4 mt-4 justify-center">
//                 {selectedPerson.socials.facebook && (
//                   <a
//                     href={selectedPerson.socials.facebook}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="text-blue-600 hover:text-blue-800"
//                     title="Facebook"
//                   >
//                     <Facebook />
//                   </a>
//                 )}
//                 {selectedPerson.socials.twitter && (
//                   <a
//                     href={selectedPerson.socials.twitter}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="text-grey-500 hover:text-grey-700"
//                     title="Twitter"
//                   >
//                     <Twitter />
//                   </a>
//                 )}
//                 {selectedPerson.socials.whatsapp && (
//                   <a
//                     href={selectedPerson.socials.whatsapp}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="text-green-500 hover:text-green-700"
//                     title="Whatsapp"
//                   >
//                     <MessageCircleMore />
//                   </a>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

// export default Profile;

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Mail,
  Phone,
  Facebook,
  Twitter,
  MessageCircle, // Changed from MessageCircleMore for cleaner icon
  X,
  User,
  ChevronRight,
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import AOS from "aos";
import "aos/dist/aos.css";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

function Profile() {
  const [teamData, setTeamData] = useState({
    pastors: [],
    elders: [],
    ministers: [],
    departmentHeads: [],
  });
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({ duration: 800, easing: "ease-out-cubic", once: true });

    const fetchTeam = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}/api/leader`);
        const data = response.data;

        const grouped = {
          pastors: [],
          elders: [],
          ministers: [],
          departmentHeads: [],
        };

        data.forEach((person) => {
          const role = person.category?.toLowerCase() || "";
          if (role.includes("pastor")) grouped.pastors.push(person);
          else if (role.includes("elder")) grouped.elders.push(person);
          else if (role.includes("minister")) grouped.ministers.push(person);
          else grouped.departmentHeads.push(person);
        });

        setTeamData(grouped);
      } catch (error) {
        console.error("Failed to fetch team data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, []);

  const handleOpenModal = (person) => setSelectedPerson(person);
  const handleCloseModal = () => setSelectedPerson(null);

  // Helper to format phone for href
  const formatPhoneNumber = (number) => {
    if (!number) return "";
    const cleaned = number.replace(/\D/g, "");
    if (cleaned.startsWith("0")) return `+254${cleaned.slice(1)}`;
    return `+${cleaned}`;
  };

  const Section = ({ title, description, people }) => {
    if (!people || people.length === 0) return null;

    return (
      <div className="mb-20" data-aos="fade-up">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-green-900 mb-3 relative inline-block">
            {title}
            <span className="absolute bottom-0 top-10 left-1/2 w-16 h-1 bg-green-500 transform -translate-x-1/2 rounded-full"></span>
          </h2>
          {description && (
            <p className="text-gray-600 text-lg mt-3 max-w-2xl mx-auto">
              {description}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-4">
          {people.map((person, index) => (
            <div
              key={person._id || index}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group"
            >
              {/* Card Header / Image */}
              <div className="h-24 bg-gradient-to-r from-green-700 to-green-900 relative">
                <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
                  <div className="w-24 h-24 rounded-full border-4 border-white shadow-md overflow-hidden bg-gray-100">
                    {person.image ? (
                      <img
                        src={person.image}
                        alt={person.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <User size={40} />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="pt-16 pb-6 px-6 text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-green-700 transition-colors">
                  {person.name}
                </h3>
                <p className="text-sm font-semibold text-green-600 uppercase tracking-wide mb-4">
                  {person.role}
                </p>

                {person.description && (
                  <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                    {person.description}
                  </p>
                )}

                {/* Quick Contacts (Email/Phone icons if available) */}
                <div className="flex justify-center gap-4 mb-4 text-gray-400">
                  {person.email && (
                    <Mail
                      size={16}
                      className="hover:text-green-600 transition-colors"
                    />
                  )}
                  {person.phone && (
                    <Phone
                      size={16}
                      className="hover:text-green-600 transition-colors"
                    />
                  )}
                </div>

                <button
                  onClick={() => handleOpenModal(person)}
                  className="inline-flex items-center gap-1 text-sm font-bold text-green-700 hover:text-green-900 transition-colors"
                >
                  View Full Profile <ChevronRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <Helmet>
        <title>Church Leadership | Eusda Kenya</title>
        <meta
          name="description"
          content="Meet the church leadership at Eusda Kenya including pastors, elders, ministers, and heads of departments leading various ministries."
        />
        <meta
          name="keywords"
          content="Church Leadership, Pastors, Elders, Ministers, Church Leaders, Eusda Kenya"
        />
        <link rel="canonical" href="https://eusda.co.ke/profiles" />

        {/* Open Graph */}
        <meta property="og:title" content="Church Leadership | Eusda Kenya" />
        <meta
          property="og:description"
          content="Learn more about our dedicated church leaders guiding the Eusda Kenya community."
        />
        <meta
          property="og:image"
          content="https://eusda.co.ke/eusda-logo.png"
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://eusda.co.ke/profiles" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Church Leadership | Eusda Kenya" />
        <meta
          name="twitter:description"
          content="Pastors, elders, ministers, and departmental heads serving Eusda Kenya."
        />
        <meta
          name="twitter:image"
          content="https://eusda.co.ke/eusda-logo.png"
        />

        {/* ✅ Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Eusda Kenya",
            url: "https://eusda.co.ke",
            department: [
              ...teamData.pastors.map((p) => ({
                "@type": "Person",
                name: p.name,
                jobTitle: p.role,
                image: p.image,
                email: p.email,
                telephone: p.phone,
              })),
              ...teamData.elders.map((e) => ({
                "@type": "Person",
                name: e.name,
                jobTitle: e.role,
                image: e.image,
                email: e.email,
                telephone: e.phone,
              })),
              ...teamData.ministers.map((m) => ({
                "@type": "Person",
                name: m.name,
                jobTitle: m.role,
                image: m.image,
                email: m.email,
                telephone: m.phone,
              })),
              ...teamData.departmentHeads.map((d) => ({
                "@type": "Person",
                name: d.name,
                jobTitle: d.role,
                image: d.image,
                email: d.email,
                telephone: d.phone,
              })),
            ],
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gray-50 pt-24 pb-20 mt-[-8rem] md:mt-[-4rem]">
        {/* Page Header */}
        <div className="text-center mb-16 px-4" data-aos="fade-down">
          <span className="text-green-600 font-bold tracking-wider uppercase text-sm">
            Our Shepherds & Servants
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mt-2 mb-4">
            Church <span className="text-green-700">Leadership</span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Meet the dedicated men and women serving God and our community.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-500">
            Loading leadership team...
          </div>
        ) : (
          <>
            <Section
              title="Pastoral Team"
              people={teamData.pastors}
              description="Providing spiritual oversight, guidance, and shepherding for the congregation."
            />
            <Section
              title="Church Elders"
              people={teamData.elders}
              description="Supporting the mission through wisdom, prayer, and administration."
            />
            <Section
              title="Ministry Leaders"
              people={teamData.ministers}
              description="Spearheading various ministries to serve our community effectively."
            />
            <Section
              title="Department Heads"
              people={teamData.departmentHeads}
              description="Coordinating the vital functions and daily operations of the church."
            />
          </>
        )}
      </div>

      {/* Modal Overlay */}
      {selectedPerson && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden relative transform transition-all scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 z-10 bg-white/20 hover:bg-black/10 backdrop-blur-md p-2 rounded-full transition-colors text-gray-700"
            >
              <X size={20} />
            </button>

            {/* Modal Header Image */}
            <div className="h-32 bg-green-800"></div>

            <div className="px-8 pb-8 -mt-16">
              <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white mx-auto mb-4">
                <img
                  src={selectedPerson.image || "https://picsum.photos/200"}
                  alt={selectedPerson.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  {selectedPerson.name}
                </h3>
                <p className="text-green-600 font-medium">
                  {selectedPerson.role}
                </p>
              </div>

              <div className="space-y-4">
                {selectedPerson.description && (
                  <div className="bg-gray-50 p-4 rounded-xl text-gray-700 text-sm leading-relaxed border border-gray-100">
                    {selectedPerson.description}
                  </div>
                )}

                {/* Contact Info */}
                <div className="flex flex-col gap-2">
                  {selectedPerson.email && (
                    <a
                      href={`mailto:${selectedPerson.email}`}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-green-50 text-gray-600 hover:text-green-700 transition-colors"
                    >
                      <Mail size={18} />
                      <span className="text-sm font-medium">
                        {selectedPerson.email}
                      </span>
                    </a>
                  )}
                  {selectedPerson.phone && (
                    <a
                      href={`tel:${formatPhoneNumber(selectedPerson.phone)}`}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-green-50 text-gray-600 hover:text-green-700 transition-colors"
                    >
                      <Phone size={18} />
                      <span className="text-sm font-medium">
                        {selectedPerson.phone}
                      </span>
                    </a>
                  )}
                </div>

                {/* Social Links */}
                {selectedPerson.socials && (
                  <div className="flex justify-center gap-4 pt-4 border-t border-gray-100">
                    {selectedPerson.socials.facebook && (
                      <a
                        href={selectedPerson.socials.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors"
                      >
                        <Facebook size={20} />
                      </a>
                    )}
                    {selectedPerson.socials.twitter && (
                      <a
                        href={selectedPerson.socials.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-sky-50 text-sky-500 rounded-full hover:bg-sky-100 transition-colors"
                      >
                        <Twitter size={20} />
                      </a>
                    )}
                    {selectedPerson.socials.whatsapp && (
                      <a
                        href={`https://wa.me/${formatPhoneNumber(selectedPerson.socials.whatsapp)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-green-50 text-green-600 rounded-full hover:bg-green-100 transition-colors"
                      >
                        <MessageCircle size={20} />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Profile;
