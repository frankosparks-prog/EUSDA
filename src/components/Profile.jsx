// import React, { useState } from "react";
// import Footer from "./Footer";
// import { Mail, Phone, Clock, Facebook, Twitter } from "lucide-react";

// function Profile() {
//   const [selectedPerson, setSelectedPerson] = useState(null);
//   const handleOpenModal = (person) => setSelectedPerson(person);
//   const handleCloseModal = () => setSelectedPerson(null);

//   const pastors = [
//     {
//       name: "Pastor John Doe",
//       role: "Senior Pastor",
//       image: "https://picsum.photos/200/200?random=6",
//       description:
//         "Pastor John Doe is passionate about leading the congregation with love and faith, providing spiritual guidance and inspiration.",
//       email: "pastor.john@church.org",
//       phone: "+254 712 345 678",
//       officeHours: "Mon–Fri, 9am–4pm",
//       socials: {
//         facebook: "https://facebook.com/pastorjohn",
//         twitter: "https://twitter.com/pastorjohn",
//       },
//     },
//     {
//       name: "Pastor Mary Wambui",
//       role: "Assistant Pastor",
//       image: "https://picsum.photos/200/200?random=13",
//       description:
//         "Pastor Mary supports church administration and oversees women's ministries with a heart for prayer and compassion.",
//       email: "mary.wambui@church.org",
//       phone: "+254 712 111 222",
//     },
//   ];

//   const elders = [
//     {
//       name: "Elder Jane Smith",
//       role: "Church Elder",
//       image: "https://picsum.photos/200/200?random=7",
//       description:
//         "Elder Jane Smith serves with a heart for community, supporting both members and leadership in every aspect of church life.",
//       email: "jane.smith@church.org",
//       phone: "+254 700 000 001",
//     },
//     {
//       name: "Elder Peter Mwangi",
//       role: "Senior Elder",
//       image: "https://picsum.photos/200/200?random=14",
//       description:
//         "Elder Peter brings decades of spiritual wisdom and mentorship to the body of Christ.",
//       email: "peter.mwangi@church.org",
//     },
//   ];

//   const ministers = [
//     {
//       name: "Minister James Brown",
//       role: "Youth Minister",
//       image: "https://picsum.photos/200/200?random=8",
//       description:
//         "Minister James Brown is dedicated to guiding the youth in their spiritual growth and connecting them with opportunities to serve the church.",
//       email: "james.brown@church.org",
//       phone: "+254 700 000 002",
//       socials: {
//         twitter: "https://twitter.com/ministerjames",
//       },
//     },
//     {
//       name: "Minister Grace Muthoni",
//       role: "Prayer Minister",
//       image: "https://picsum.photos/200/200?random=12",
//       description:
//         "Grace Muthoni leads the prayer ministry with passion, interceding for the needs of the church and the community.",
//       email: "grace.muthoni@church.org",
//       phone: "+254 700 000 004",
//     },
//   ];

//   const departmentHeads = [
//     {
//       name: "Anna White",
//       role: "Worship Leader",
//       image: "https://picsum.photos/200/200?random=9",
//       email: "anna.white@church.org",
//       phone: "+254 700 000 003",
//     },
//     {
//       name: "David Black",
//       role: "Volunteer Coordinator",
//       image: "https://picsum.photos/200/200?random=10",
//     },
//     {
//       name: "Sarah Green",
//       role: "Children's Ministry Leader",
//       image: "https://picsum.photos/200/200?random=11",
//       email: "sarah.green@church.org",
//     },
//   ];

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
//               src={person.image}
//               alt={person.name}
//               className="w-32 h-32 mx-auto object-cover rounded-full mb-4 border-4 border-green-200"
//             />
//             <h2 className="text-xl font-bold text-green-800 mb-2">
//               {person.name}
//             </h2>
//             <p className="text-gray-500 text-sm mb-2">{person.role}</p>

//             {/* ✅ Show email and phone for department heads */}
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

//             {/* Show View Bio if there's a description */}
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

//   return (
//     <>
//       <div className="bg-gray-50 py-10 px-6 md:px-20 min-h-screen mt-20 md:mt-32">
//         <Section
//           title="Pastors"
//           people={pastors}
//           description="Our spiritual leaders guiding the entire church."
//         />
//         <Section
//           title="Elders"
//           people={elders}
//           description="Providing wisdom, oversight, and support to the congregation."
//         />
//         <Section
//           title="Ministers"
//           people={ministers}
//           description="Serving in key roles across various ministries."
//         />
//         <Section
//           title="Heads of Departments & Ministries"
//           people={departmentHeads}
//           description="Leaders responsible for worship, volunteering, children, and more."
//         />
//       </div>

//       <Footer />

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
//               src={selectedPerson.image}
//               alt={selectedPerson.name}
//               className="w-32 h-32 mx-auto object-cover rounded-full mb-4 border-4 border-green-200"
//             />
//             <h2 className="text-xl font-bold text-green-800 mb-1 text-center">
//               {selectedPerson.name}
//             </h2>
//             <p className="text-gray-500 text-sm mb-3 text-center">
//               {selectedPerson.role}
//               {selectedPerson.role.toLowerCase().includes("senior") &&
//                 " (Senior)"}
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
//                   <strong>Email:</strong> {selectedPerson.email}
//                 </p>
//               )}
//               {selectedPerson.phone && (
//                 <p className="flex items-center gap-2">
//                   <Phone size={16} />
//                   <strong>Phone:</strong> {selectedPerson.phone}
//                 </p>
//               )}
//               {selectedPerson.officeHours && (
//                 <p className="flex items-center gap-2">
//                   <Clock size={16} />
//                   <strong>Office Hours:</strong> {selectedPerson.officeHours}
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
//                     className="text-blue-500 hover:text-blue-700"
//                     title="Twitter"
//                   >
//                     <Twitter />
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
  MessageCircleMore,
} from "lucide-react";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

function Profile() {
  const [teamData, setTeamData] = useState({
    pastors: [],
    elders: [],
    ministers: [],
    departmentHeads: [],
  });
  const [selectedPerson, setSelectedPerson] = useState(null);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}/api/leader`);
        const data = response.data;

        // Categorize members based on role
        const grouped = {
          pastors: [],
          elders: [],
          ministers: [],
          departmentHeads: [],
        };

        data.forEach((person) => {
          const role = person.category.toLowerCase();
          if (role.includes("pastor")) {
            grouped.pastors.push(person);
          } else if (role.includes("elder")) {
            grouped.elders.push(person);
          } else if (role.includes("minister")) {
            grouped.ministers.push(person);
          } else {
            grouped.departmentHeads.push(person);
          }
        });

        setTeamData(grouped);
      } catch (error) {
        console.error("Failed to fetch team data:", error);
      }
    };

    fetchTeam();
  }, []);

  const handleOpenModal = (person) => setSelectedPerson(person);
  const handleCloseModal = () => setSelectedPerson(null);

  const Section = ({ title, description, people }) => (
    <div className="mb-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-green-800 mb-4">
          {title}
        </h2>
        {description && (
          <p className="text-gray-600 text-md md:text-lg">{description}</p>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {people.map((person, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 text-center"
          >
            <img
              src={person.image || "https://picsum.photos/200"} // fallback image
              alt={person.name}
              className="w-32 h-32 mx-auto object-cover rounded-full mb-4 border-4 border-green-200"
            />
            <h2 className="text-xl font-bold text-green-800 mb-2">
              {person.name}
            </h2>
            <p className="text-gray-500 text-sm mb-2">{person.role}</p>

            {title === "Heads of Departments & Ministries" && (
              <div className="text-sm text-gray-700 space-y-1 mt-2">
                {person.email && (
                  <p className="flex items-center gap-2 justify-center">
                    <Mail size={16} />
                    {person.email}
                  </p>
                )}
                {person.phone && (
                  <p className="flex items-center gap-2 justify-center">
                    <Phone size={16} />
                    {person.phone}
                  </p>
                )}
              </div>
            )}

            {person.description && (
              <>
                <p className="text-gray-600 truncate">{person.description}</p>
                <button
                  className="mt-3 text-sm text-green-700 underline"
                  onClick={() => handleOpenModal(person)}
                >
                  View Bio
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const formatPhoneNumber = (number) => {
    if (number.startsWith("0")) {
      return `+254${number.slice(1)}`;
    }
    return number; // already in correct format
  };

  return (
    <>
      <div className="bg-gray-50 py-10 px-6 md:px-20 min-h-screen mt-20 md:mt-32">
        <Section
          title="Pastors"
          people={teamData.pastors}
          description="Our spiritual leaders guiding the entire church."
        />
        <Section
          title="Elders"
          people={teamData.elders}
          description="Providing wisdom, oversight, and support to the congregation."
        />
        <Section
          title="Ministry Heads"
          people={teamData.ministers}
          description="Serving in key roles across various ministries."
        />
        <Section
          title="Heads of Departments"
          people={teamData.departmentHeads}
          description="Leaders responsible for worship, volunteering, children, and more."
        />
      </div>
      {/* 
      <Footer /> */}

      {selectedPerson && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
            <button
              onClick={handleCloseModal}
              className="absolute top-1 right-2 text-gray-500 hover:text-red-500 text-lg font-bold"
            >
              &times;
            </button>
            <img
              src={selectedPerson.image || "https://picsum.photos/200"}
              alt={selectedPerson.name}
              className="w-32 h-32 mx-auto object-cover rounded-full mb-4 border-4 border-green-200"
            />
            <h2 className="text-xl font-bold text-green-800 mb-1 text-center">
              {selectedPerson.name}
            </h2>
            <p className="text-gray-500 text-sm mb-3 text-center">
              {selectedPerson.role}
            </p>

            {selectedPerson.description && (
              <p className="text-gray-700 mb-4 text-sm">
                {selectedPerson.description}
              </p>
            )}

            <div className="text-sm text-gray-700 space-y-1">
              {selectedPerson.email && (
                <p className="flex items-center gap-2">
                  <Mail size={16} />
                  <strong>Email:</strong>{" "}
                  <a
                    href={`mailto:${selectedPerson.email}`}
                    className="hover:underline"
                  >
                    {selectedPerson.email}
                  </a>
                </p>
              )}
              {selectedPerson.phone && (
                <p className="flex items-center gap-2">
                  <Phone size={16} />
                  <strong>Phone:</strong>{" "}
                  <a
                    href={`tel:${formatPhoneNumber(selectedPerson.phone)}`}
                    className="hover:underline"
                  >
                    {selectedPerson.phone}
                  </a>
                </p>
              )}
            </div>

            {selectedPerson.socials && (
              <div className="flex gap-4 mt-4 justify-center">
                {selectedPerson.socials.facebook && (
                  <a
                    href={selectedPerson.socials.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                    title="Facebook"
                  >
                    <Facebook />
                  </a>
                )}
                {selectedPerson.socials.twitter && (
                  <a
                    href={selectedPerson.socials.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-grey-500 hover:text-grey-700"
                    title="Twitter"
                  >
                    <Twitter />
                  </a>
                )}
                {selectedPerson.socials.whatsapp && (
                  <a
                    href={selectedPerson.socials.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-500 hover:text-green-700"
                    title="Whatsapp"
                  >
                    <MessageCircleMore />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Profile;
