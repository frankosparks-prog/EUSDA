import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Mail,
  Phone,
  Facebook,
  Twitter,
  MessageCircleMore,
} from "lucide-react";
import { Helmet } from "react-helmet-async"; // ✅ For SEO

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

        const grouped = {
          pastors: [],
          elders: [],
          ministers: [],
          departmentHeads: [],
        };

        data.forEach((person) => {
          const role = person.category.toLowerCase();
          if (role.includes("pastor")) grouped.pastors.push(person);
          else if (role.includes("elder")) grouped.elders.push(person);
          else if (role.includes("minister")) grouped.ministers.push(person);
          else grouped.departmentHeads.push(person);
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
              src={person.image || "https://picsum.photos/200"}
              alt={`${person.name} - ${person.role}`}
              className="w-32 h-32 mx-auto object-cover rounded-full mb-4 border-4 border-green-200"
              loading="lazy"
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
    if (number.startsWith("0")) return `+254${number.slice(1)}`;
    return number;
  };

  return (
    <>
      {/* ✅ SEO Helmet */}
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
        <link rel="canonical" href="https://eusda.co.ke/leadership" />

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
        <meta property="og:url" content="https://eusda.co.ke/leadership" />

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

      {/* Modal */}
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
