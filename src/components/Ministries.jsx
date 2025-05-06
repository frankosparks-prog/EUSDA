import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Link } from 'react-router-dom';
import Footer from './Footer';

function Ministries() {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const ministries = [
    {
      title: 'Revelation of Love Ministry',
      short: 'Empowering the next generation to lead with faith and purpose.',
      full: 'This ministry is dedicated to nurturing spiritual growth among the youth and young adults. Through mentorship programs, interactive Bible studies, music sessions, and outreach events, we cultivate leadership, responsibility, and bold faith in the next generation.',
      delay: 0,
    },
    {
      title: 'Heavenly Voyagers',
      short: 'A sisterhood rooted in love, support, and spiritual growth.',
      full: 'Heavenly Voyagers offers a nurturing space for women of all ages to grow spiritually and emotionally. We hold monthly sisterhood gatherings, prayer breakfasts, counseling support, and host empowerment seminars — all centered around building Christ-like character and community.',
      delay: 100,
    },
    {
      title: 'Calvary Ministers',
      short: 'Building strong spiritual leaders through fellowship and service.',
      full: 'This ministry grooms and supports those called to spiritual leadership — whether in teaching, prayer, evangelism, or service. With regular leadership workshops, discipleship groups, and mission outreaches, we raise dependable stewards of the Gospel.',
      delay: 200,
    },
  ];

  return (
    <>
      <section className="bg-white py-20 px-6 mt-20" data-aos="fade-up">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-center text-green-900 mb-12" data-aos="fade-down">Explore Our Ministries</h1>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-16" data-aos="fade-up">
            Our ministries are the heartbeat of our community — each designed to serve, uplift, and draw people closer to God in unique ways.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {ministries.map((ministry, idx) => (
              <div
                key={idx}
                className="bg-green-50 p-6 rounded-2xl shadow hover:shadow-lg transition duration-300 flex flex-col justify-between"
                data-aos="zoom-in"
                data-aos-delay={ministry.delay}
              >
                <div>
                  <h2 className="text-2xl font-semibold text-green-800 mb-3">{ministry.title}</h2>
                  <p className="text-gray-700 italic mb-2">"{ministry.short}"</p>
                  <p className="text-gray-600 text-sm mb-4">{ministry.full}</p>
                </div>
                <div className="mt-auto text-center">
                  <Link
                    to={`/ministries/join/${encodeURIComponent(ministry.title)}`}
                    className="inline-block mt-4 px-5 py-2 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition"
                  >
                    Join This Ministry
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default Ministries;
