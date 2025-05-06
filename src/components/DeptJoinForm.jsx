import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Footer from './Footer';

function DeptJoinForm() {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <>
    <section className="bg-white py-20 px-6 mt-20" data-aos="fade-up">
      <div className="max-w-3xl mx-auto bg-green-50 rounded-2xl shadow-lg p-10">
        <h2 className="text-3xl font-bold text-green-800 mb-4 text-center">Join a Department</h2>
        <p className="text-center text-gray-700 mb-10">
          Fill out the form below to express your interest in serving with us. We'd love to have you on board!
        </p>

        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              placeholder="John Doe"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              type="tel"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              placeholder="+254 712 345 678"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Department</label>
            <select
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              required
            >
              <option value="">-- Choose a Department --</option>
              <option value="Bible Study">Bible Study</option>
              <option value="Music Ministry">Music Ministry</option>
              <option value="Youth & Teens">Youth & Teens</option>
              <option value="Community Service">Community Service</option>
              <option value="Missions & Evangelism">Missions & Evangelism</option>
              <option value="Education Department">Education Department</option>
              <option value="Prayer Ministry">Prayer Ministry</option>
              <option value="Security & Protocol">Security & Protocol</option>
              <option value="Hospitality">Hospitality</option>
              <option value="Environment & Beautification">Environment & Beautification</option>
              <option value="Welfare & Counseling">Welfare & Counseling</option>
              <option value="Ushering">Deconry</option>
            </select>
          </div>

          <div className="text-center pt-6">
            <button
              type="submit"
              className="bg-green-700 hover:bg-green-800 text-white py-3 px-8 rounded-full font-medium shadow-md transition duration-300"
            >
              Submit Interest
            </button>
          </div>
        </form>
      </div>
    </section>
    <Footer />
    </>
  );
}

export default DeptJoinForm;
