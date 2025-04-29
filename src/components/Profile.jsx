import React from "react";
import Footer from "./Footer";

function Profile() {
  // Fake Data for Church Leadership and Members
  const leadership = [
    {
      name: "Pastor John Doe",
      role: "Senior Pastor",
      image: "https://picsum.photos/200/200?random=6",
      description:
        "Pastor John Doe is passionate about leading the congregation with love and faith, providing spiritual guidance and inspiration.",
    },
    {
      name: "Elder Jane Smith",
      role: "Church Elder",
      image: "https://picsum.photos/200/200?random=7",
      description:
        "Elder Jane Smith serves with a heart for community, supporting both members and leadership in every aspect of church life.",
    },
    {
      name: "Minister James Brown",
      role: "Youth Minister",
      image: "https://picsum.photos/200/200?random=8",
      description:
        "Minister James Brown is dedicated to guiding the youth in their spiritual growth and connecting them with opportunities to serve the church.",
    },
  ];

  const churchMembers = [
    {
      name: "Anna White",
      role: "Worship Leader",
      image: "https://picsum.photos/200/200?random=9",
    },
    {
      name: "David Black",
      role: "Volunteer Coordinator",
      image: "https://picsum.photos/200/200?random=10",
    },
    {
      name: "Sarah Green",
      role: "Children's Ministry Leader",
      image: "https://picsum.photos/200/200?random=11",
    },
  ];

  return (
    <div className="bg-gray-50 py-10 px-6 md:px-20 min-h-screen">
      {/* Church Leadership Section */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-5xl font-bold text-blue-800 mb-6">
          Church Leadership
        </h1>
        <p className="text-gray-600 text-md md:text-lg mb-8">
          Meet our dedicated leaders who guide and nurture the church community.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 mb-12">
        {leadership.map((leader, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <img
              src={leader.image}
              alt={leader.name}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h2 className="text-xl font-bold text-blue-800 mb-2">{leader.name}</h2>
            <p className="text-gray-500 text-sm mb-2">{leader.role}</p>
            <p className="text-gray-600">{leader.description}</p>
          </div>
        ))}
      </div>

      {/* Church Members Section */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-5xl font-bold text-blue-800 mb-6">
          Church Members
        </h1>
        <p className="text-gray-600 text-md md:text-lg mb-8">
          Learn more about our active members who contribute to church life.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
        {churchMembers.map((member, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <img
              src={member.image}
              alt={member.name}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h2 className="text-xl font-bold text-blue-800 mb-2">{member.name}</h2>
            <p className="text-gray-500 text-sm mb-2">{member.role}</p>
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
}

export default Profile;
