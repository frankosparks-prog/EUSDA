import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  Users,
  FileText,
  Users2,
  Wallet,
  Smile,
  ClipboardCheck,
  BookOpenCheck,
  HandHeart,
  Baby,
  Network,
  Target,
  Hammer,
  Coins,
  HeartPulse,
  Library,
  Music2,
  Truck,
  Megaphone,
  HandHelping,
  Compass,
  Stethoscope,
  ScrollText,
  HandCoins,
  Handshake,
  UserCheck,
  UserPlus,
} from "lucide-react";

function Departments() {
  const [showAll, setShowAll] = useState(false);
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const departments = [
    {
      title: "Elder’s Council",
      description:
        "Provides spiritual leadership, supervises all departments, and supports doctrinal integrity.",
      icon: <Users size={40} className="text-green-700 mx-auto" />,
    },
    {
      title: "Secretary’s Office",
      description:
        "Maintains records, handles correspondence, keeps membership lists, and documents meetings.",
      icon: <FileText size={40} className="text-green-700 mx-auto" />,
    },
    {
      title: "Class Sabbath School",
      description:
        "Coordinates class-based spiritual activities, fosters member engagement through class reps.",
      icon: <Users2 size={40} className="text-green-700 mx-auto" />,
    },
    {
      title: "Treasury Department",
      description:
        "Manages EUSDA’s finances, keeps accounts, and prepares financial reports.",
      icon: <Wallet size={40} className="text-green-700 mx-auto" />,
    },
    {
      title: "Deaconry Department",
      description:
        "Handles venue preparation, member welfare, and ushers during services. Deaconesses assist especially in women's needs and communion services.",
      icon: <Smile size={40} className="text-green-700 mx-auto" />,
    },
    {
      title: "Audit Department",
      description:
        "Ensures constitutional compliance, audits finances and ministries, and handles member clearances.",
      icon: <ClipboardCheck size={40} className="text-green-700 mx-auto" />,
    },
    {
      title: "Sabbath School Department",
      description:
        "Plans and executes Sabbath school programs, lesson discussions, and distributes study materials.",
      icon: <BookOpenCheck size={40} className="text-green-700 mx-auto" />,
    },
    {
      title: "Personal Ministry",
      description:
        "Leads outreach, visitation, and evangelism. Also coordinates Sabbath worship and prepares bulletins.",
      icon: <HandHeart size={40} className="text-green-700 mx-auto" />,
    },
    {
      title: "Children Ministry",
      description:
        "Focuses on spiritual growth and education of children through faith-based programs.",
      icon: <Baby size={40} className="text-green-700 mx-auto" />,
    },
    {
      title: "Public Campus Ministries",
      description:
        "Links EUSDA to other Adventist university groups and plans joint events like rallies and retreats.",
      icon: <Network size={40} className="text-green-700 mx-auto" />,
    },
    {
      title: "Interest Coordination",
      description:
        "Tracks and follows up with individuals showing interest in the church and supports evangelism.",
      icon: <Target size={40} className="text-green-700 mx-auto" />,
    },
    {
      title: "Church Development Committee",
      description:
        "Plans and manages fundraising and church infrastructure projects, including the Gate to Heaven (GTH) building program.",
      icon: <Hammer size={40} className="text-green-700 mx-auto" />,
    },
    {
      title: "Stewardship Department",
      description:
        "Educates members on responsible giving, budgeting, and resource management in the church.",
      icon: <Coins size={40} className="text-green-700 mx-auto" />,
    },
    {
      title: "Social, Health & Temperance Department",
      description:
        "Organizes social and health events and promotes healthy living and temperance.",
      icon: <HeartPulse size={40} className="text-green-700 mx-auto" />,
    },
    {
      title: "Publishing Department",
      description:
        "Manages church library materials, literature evangelism, and promotes spiritual reading.",
      icon: <Library size={40} className="text-green-700 mx-auto" />,
    },
    {
      title: "Music Department",
      description:
        "Leads and coordinates church music, singing groups, and instrumentalists for worship.",
      icon: <Music2 size={40} className="text-green-700 mx-auto" />,
    },
    {
      title: "Transport & Public Address Department",
      description:
        "Manages church transport logistics and PA system setup, maintenance, and training.",
      icon: <Truck size={40} className="text-green-700 mx-auto" />,
    },
    {
      title: "Communication & Publicity Department",
      description:
        "Handles publicity, online platforms, and visual support during church functions.",
      icon: <Megaphone size={40} className="text-green-700 mx-auto" />,
    },
    {
      title: "Prayer and Fellowship Department",
      description:
        "Organizes devotions, vespers, prayer meetings, and fosters a culture of prayer.",
      icon: <HandHelping size={40} className="text-green-700 mx-auto" />,
    },
    {
      title: "Master Guide Department",
      description:
        "Trains members in leadership and spiritual discipline through the Master Guide curriculum.",
      icon: <Compass size={40} className="text-green-700 mx-auto" />,
    },
    {
      title: "Medical Missionary Department",
      description:
        "Promotes healthful living, conducts medical outreach, and educates on vegetarian diets.",
      icon: <Stethoscope size={40} className="text-green-700 mx-auto" />,
    },
    {
      title: "Voice of Prophecy Department",
      description:
        "Focuses on Bible prophecy studies, outreach to non-Adventists, and shielding members from doctrinal errors.",
      icon: <ScrollText size={40} className="text-green-700 mx-auto" />,
    },
    {
      title: "Charity Department",
      description:
        "Organizes support for the needy, including hospital and children’s home visits.",
      icon: <HandCoins size={40} className="text-green-700 mx-auto" />,
    },
    {
      title: "Adventist Muslim Relations Department",
      description:
        "Trains members for respectful outreach to Muslims and builds cross-cultural understanding.",
      icon: <Handshake size={40} className="text-green-700 mx-auto" />,
    },
    {
      title: "ALO & AMO Department",
      description:
        "Supports and empowers SDA ladies through forums, visitations, and spiritual growth. And engages SDA men in social, physical, and spiritual development activities.",
      icon: <UserPlus size={40} className="text-green-700 mx-auto" />,
    },
    {
      title: "EUSDA Chaplaincy Office",
      description:
        "Composed of the Chaplain and Patron(s), they offer spiritual guidance, mentorship, and liaison with the university and church conference.",
      icon: <UserCheck size={40} className="text-green-700 mx-auto" />,
    },
  ];

  return (
    <div className="departments-page mt-16">
      {/* Hero Section */}
      <section
        className="relative h-[60vh] flex items-center justify-center text-white text-center"
        style={{
          backgroundImage: "url(https://picsum.photos/400/250?random=5)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="relative z-10 px-6">
          <h1 className="text-5xl font-extrabold mb-4">Our Departments</h1>
          <p className="text-lg max-w-xl mx-auto">
            Discover the departments that keep EUSDA alive and thriving.
          </p>
        </div>
      </section>

      {/* Departments Section */}
      <section className="bg-gray-50 py-20 px-6">
        <h2
          className="text-3xl font-bold text-center text-green-800 mb-12"
          data-aos="fade-up"
        >
          Ministry Through Service
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
          {(showAll ? departments : departments.slice(0, 9)).map(
            (dept, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300 text-center"
                data-aos="zoom-in"
                data-aos-delay={index * 80}
              >
                <div className="mb-4">{dept.icon}</div>
                <h3 className="text-xl font-semibold text-green-800 mb-2">
                  {dept.title}
                </h3>
                <p className="text-gray-600">{dept.description}</p>
              </div>
            )
          )}
        </div>
        <div className="text-center mt-10">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-green-700 border border-green-700 hover:bg-green-700 hover:text-white transition duration-300 px-6 py-2 rounded-full shadow-md font-semibold"
            data-aos="fade-up"
          >
            {showAll ? "Show Less" : "Show More"}
          </button>
        </div>
      </section>

      {/* Join a Department Section */}
      <section
        className="bg-green-100 py-20 px-6 text-center mb-[-2rem]"
        data-aos="fade-up"
      >
        <h2 className="text-3xl font-bold text-green-900 mb-6">
          Join a Department
        </h2>
        <p className="text-lg max-w-2xl mx-auto text-green-800 mb-8">
          Are you passionate about serving? There’s a place for you in our
          departments. Get involved and be part of the EUSDA family.
        </p>
        <a
          href="/departments/join"
          className="inline-block bg-green-700 hover:bg-green-800 text-white py-3 px-6 rounded-full shadow-md transition duration-300"
        >
          Get Involved
        </a>
      </section>
      {/* <Footer /> */}
    </div>
  );
}

export default Departments;
