import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import {
  BookOpen,
  Music,
  Users,
  HeartHandshake,
  Globe,
  School,
  Book,
  ShieldCheck,
  HelpingHand,
  Coffee,
  Leaf,
  Smile,
} from 'lucide-react';
import Footer from './Footer';

function Departments() {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const departments = [
    {
      title: 'Bible Study',
      description: 'Deepening spiritual understanding through scripture, discussion, and reflection.',
      icon: <BookOpen size={40} className="text-green-700 mx-auto" />,
    },
    {
      title: 'Music Ministry',
      description: 'Ministering through song and worship. Includes choir, praise teams, and instrumentals.',
      icon: <Music size={40} className="text-green-700 mx-auto" />,
    },
    {
      title: 'Youth & Teens',
      description: 'Engaging and mentoring young people through dynamic spiritual and social activities.',
      icon: <Users size={40} className="text-green-700 mx-auto" />,
    },
    {
      title: 'Community Service',
      description: 'Reaching out to the community through acts of kindness, visitations, and aid.',
      icon: <HeartHandshake size={40} className="text-green-700 mx-auto" />,
    },
    {
      title: 'Missions & Evangelism',
      description: 'Spreading the gospel through mission trips, Bible studies, and outreach.',
      icon: <Globe size={40} className="text-green-700 mx-auto" />,
    },
    {
      title: 'Education Department',
      description: 'Focusing on academic excellence, mentorship, and sharing knowledge.',
      icon: <School size={40} className="text-green-700 mx-auto" />,
    },
    {
      title: 'Prayer Ministry',
      description: 'Leading in intercessory prayer sessions, prayer chains, and fasting programs.',
      icon: <Book size={40} className="text-green-700 mx-auto" />,
    },
    {
      title: 'Security & Protocol',
      description: 'Ensuring order and security during services and events.',
      icon: <ShieldCheck size={40} className="text-green-700 mx-auto" />,
    },
    {
      title: 'Hospitality',
      description: 'Welcoming visitors and members, preparing meals and refreshments.',
      icon: <Coffee size={40} className="text-green-700 mx-auto" />,
    },
    {
      title: 'Environment & Beautification',
      description: 'Keeping the church clean and green. Promoting stewardship of God’s creation.',
      icon: <Leaf size={40} className="text-green-700 mx-auto" />,
    },
    {
      title: 'Welfare & Counseling',
      description: 'Supporting members emotionally, spiritually, and materially.',
      icon: <HelpingHand size={40} className="text-green-700 mx-auto" />,
    },
    {
      title: 'Deconry',
      description: 'Creating a warm, organized worship environment and helping members feel welcome.',
      icon: <Smile size={40} className="text-green-700 mx-auto" />,
    },
  ];

  return (
    <div className="departments-page mt-16">
      {/* Hero Section */}
      <section
        className="relative h-[60vh] flex items-center justify-center text-white text-center"
        style={{
          backgroundImage: 'url(https://picsum.photos/400/250?random=5)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
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
        <h2 className="text-3xl font-bold text-center text-green-800 mb-12" data-aos="fade-up">
          Ministry Through Service
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
          {departments.map((dept, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300 text-center"
              data-aos="zoom-in"
              data-aos-delay={index * 80}
            >
              <div className="mb-4">{dept.icon}</div>
              <h3 className="text-xl font-semibold text-green-800 mb-2">{dept.title}</h3>
              <p className="text-gray-600">{dept.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Join a Department Section */}
      <section className="bg-green-100 py-20 px-6 text-center mb-[-2rem]" data-aos="fade-up">
        <h2 className="text-3xl font-bold text-green-900 mb-6">Join a Department</h2>
        <p className="text-lg max-w-2xl mx-auto text-green-800 mb-8">
          Are you passionate about serving? There’s a place for you in our departments. Get involved and be part of the EUSDA family.
        </p>
        <a
          href="/departments/join"
          className="inline-block bg-green-700 hover:bg-green-800 text-white py-3 px-6 rounded-full shadow-md transition duration-300"
        >
          Get Involved
        </a>
      </section>
      <Footer />
    </div>
  );
}

export default Departments;
