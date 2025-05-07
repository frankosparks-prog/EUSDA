// import React, { useEffect } from 'react';
// import AOS from 'aos';
// import 'aos/dist/aos.css';
// import Footer from './Footer';

// function Announcements() {
//   useEffect(() => {
//     AOS.init({ duration: 1000 });
//   }, []);

//   const mockAnnouncements = [
//     {
//       title: 'Upcoming Revival Meeting',
//       date: 'May 12, 2025',
//       description:
//         'Join us for a powerful evening of worship, word, and revival. The service starts at 6:00 PM at the main sanctuary.',
//     },
//     {
//       title: 'Youth Conference 2025 Registration Now Open',
//       date: 'May 1, 2025',
//       description:
//         'Don’t miss out on this year’s youth conference! Register online or at the church office before June 5.',
//     },
//     {
//       title: 'Monthly Fasting & Prayer Week',
//       date: 'April 28 – May 4, 2025',
//       description:
//         'Let’s seek God together through fasting and prayer. Daily morning devotion will be held from 6:00 AM to 7:00 AM.',
//     },
//   ];

//   return (
//     <>
//     <section className="bg-green-50 py-20 px-6 min-h-screen mt-20">
//       <div className="max-w-5xl mx-auto" data-aos="fade-up">
//         <h1 className="text-4xl font-bold text-green-900 mb-10 text-center">Church Announcements 📢</h1>

//         <div className="space-y-6">
//           {mockAnnouncements.map((announcement, index) => (
//             <div
//               key={index}
//               className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition"
//               data-aos="fade-up"
//               data-aos-delay={index * 100}
//             >
//               <h2 className="text-2xl font-semibold text-green-800 mb-1">{announcement.title}</h2>
//               <p className="text-sm text-gray-500 mb-3">{announcement.date}</p>
//               <p className="text-gray-700">{announcement.description}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//     <Footer />
//     </>
//   );
// }

// export default Announcements;

import React, { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Footer from './Footer';

function Announcements() {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const announcements = [
    {
      title: 'Upcoming Revival Meeting',
      date: 'May 12, 2025',
      description:
        'Join us for a powerful evening of worship, word, and revival. The service starts at 6:00 PM at the main sanctuary.',
    },
    {
      title: 'Youth Conference 2025 Registration Now Open',
      date: 'May 1, 2025',
      description:
        'Don’t miss out on this year’s youth conference! Register online or at the church office before June 5.',
    },
    {
      title: 'Monthly Fasting & Prayer Week',
      date: 'April 28 – May 4, 2025',
      description:
        'Let’s seek God together through fasting and prayer. Daily morning devotion will be held from 6:00 AM to 7:00 AM.',
    },
    {
      title: 'Baptism Service - June 15',
      date: 'June 15, 2025',
      description:
        'All those who want to be baptized are encouraged to attend the baptism class every Sunday after service.',
    },
    {
      title: 'Men’s Fellowship Breakfast',
      date: 'May 18, 2025',
      description:
        'All men are invited to a morning of brotherhood, word, and breakfast at the fellowship hall at 7:30 AM.',
    },
    {
      title: 'Church Cleaning Day',
      date: 'May 10, 2025',
      description:
        'Let’s come together to keep God’s house clean. Join us for a church-wide clean-up starting at 9:00 AM.',
    },
    {
      title: 'New Members Orientation',
      date: 'May 25, 2025',
      description:
        'Are you new to our church? Come learn about our values, ministries, and how to get involved.',
    },
    {
      title: 'Night of Worship',
      date: 'May 31, 2025',
      description:
        'A special night of extended praise and worship with guest worship leaders and our choir.',
    },
  ];

  const filteredAnnouncements = announcements.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
    <section className="bg-green-50 py-20 px-6 min-h-screen mt-20 mb-[-2rem]">
      <div className="max-w-6xl mx-auto" data-aos="fade-up">
        <h1 className="text-4xl font-bold text-green-900 mb-10 text-center">📢 Church Announcements</h1>

        {/* Search Input */}
        <div className="mb-10 max-w-md mx-auto">
          <input
            type="text"
            placeholder="Search announcements..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-green-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Announcements List */}
        <div className="space-y-6">
          {filteredAnnouncements.length > 0 ? (
            filteredAnnouncements.map((announcement, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <h2 className="text-2xl font-semibold text-green-800 mb-1">{announcement.title}</h2>
                <p className="text-sm text-gray-500 mb-3">{announcement.date}</p>
                <p className="text-gray-700">{announcement.description}</p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No announcements found.</p>
          )}
        </div>
      </div>
    </section>
    <Footer />
    </>
  );
}

export default Announcements;
