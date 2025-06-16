import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Footer from './Footer';

const About = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div className="about-page mt-16">
      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center bg-no-repeat text-white py-32 px-6"
        style={{
          backgroundImage: `url('https://picsum.photos/400/250?random=1')`,
        }}
        data-aos="fade-down"
      >
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="relative z-10 text-center">
          <h1 className="text-5xl font-extrabold mb-4">About EUSDA Church</h1>
          <p className="text-lg max-w-2xl mx-auto">
            Discover our story, mission, and the heart behind our ministry.
          </p>
        </div>
      </section>

      {/* History Section */}
      <section className="bg-white py-16 px-6 text-center" data-aos="fade-up">
        <h2 className="text-3xl font-bold text-green-800 mb-6">Our Story</h2>
        <p className="text-gray-700 max-w-4xl mx-auto text-lg leading-relaxed">
          The Egerton University Seventh-day Adventist (EUSDA) Church was born out of a vision to create a spiritual haven for students and staff at Egerton University. 
          What started as a small prayer group has grown into a thriving community of believers who gather each Sabbath to worship, share, and serve.
          <br /><br />
          Over the years, EUSDA has become more than just a church—it’s a family. We’ve witnessed the power of faith in action through vibrant worship services, 
          inspiring sermons, passionate youth ministries, and impactful outreach programs both within and beyond the university. 
          Our members come from diverse backgrounds, united by a shared love for Jesus and a commitment to living out His teachings.
          <br /><br />
          From organizing campus-wide evangelistic campaigns, supporting orphanages and prisons, to leading music ministries and mentorship programs, 
          EUSDA continues to be a light on the hill. We believe that true education is not just academic but spiritual and holistic—preparing students for both this life and eternity.
        </p>
      </section>

      {/* Core Values Section */}
      <section className="bg-green-50 py-16 px-6" data-aos="fade-up">
        <h2 className="text-3xl font-bold text-green-800 text-center mb-10">Our Core Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md" data-aos="zoom-in">
            <h3 className="text-xl font-semibold text-green-700 mb-2">Faith in God</h3>
            <p className="text-gray-700">Christ is the foundation of everything we do—our worship, service, and fellowship.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md" data-aos="zoom-in" data-aos-delay="100">
            <h3 className="text-xl font-semibold text-green-700 mb-2">Unity in Fellowship</h3>
            <p className="text-gray-700">We grow together as a family, celebrating diversity and encouraging one another in love.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md" data-aos="zoom-in" data-aos-delay="200">
            <h3 className="text-xl font-semibold text-green-700 mb-2">Service to Others</h3>
            <p className="text-gray-700">We are called to be the hands and feet of Jesus, reaching out to those in need.</p>
          </div>
        </div>
      </section>

      {/* Beliefs Section */}
      <section className="bg-white py-16 px-6 text-center" data-aos="fade-up">
        <h2 className="text-3xl font-bold text-green-800 mb-6">What We Believe</h2>
        <p className="text-gray-700 max-w-4xl mx-auto text-lg leading-relaxed">
          EUSDA Church embraces the global beliefs of the Seventh-day Adventist Church. We believe in the Bible as God’s inspired Word,
          salvation through Jesus Christ, the observance of the Sabbath, and the soon second coming of our Lord.
          <br /><br />
          Our faith is rooted in love, truth, and hope. We seek to follow Christ in all aspects of life—spiritually, socially, and academically.
        </p>
      </section>

      {/* Join Us Section */}
      <section className="bg-green-200 py-16 px-6 text-center mb-[-2rem]" data-aos="zoom-in">
        <h2 className="text-3xl font-bold text-green-900 mb-4">You're Welcome!</h2>
        <p className="text-lg text-green-800 mb-6 max-w-xl mx-auto">
          Whether you're new to campus, seeking spiritual growth, or simply curious—there’s a place for you at EUSDA Church.
        </p>
        <a
          href="/contact"
          className="inline-block bg-green-700 hover:bg-green-800 text-white py-3 px-6 rounded-full shadow-md transition duration-300"
        >
          Contact Us
        </a>
      </section>

      {/* <Footer /> */}
    </div>
  );
};

export default About;
