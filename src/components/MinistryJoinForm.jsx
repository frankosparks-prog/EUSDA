import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Footer from './Footer';

function MinistryJoinForm() {
  const { ministryName } = useParams();

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <>
    <div className="bg-green-50 min-h-screen py-20 px-6 flex items-center justify-center mt-20">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-lg w-full" data-aos="fade-up">
        <h2 className="text-3xl font-bold text-green-800 mb-6 text-center">
          Join {decodeURIComponent(ministryName)}
        </h2>
        <form className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-green-700 mb-1">Full Name</label>
            <input
              type="text"
              placeholder="Your full name"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-green-700 mb-1">Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-green-700 mb-1">Phone Number</label>
            <input
              type="tel"
              placeholder="07XX XXX XXX"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-green-700 mb-1">Why do you want to join?</label>
            <textarea
              rows="3"
              placeholder="Share your reason..."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            Submit Application
          </button>
        </form>
      </div>
    </div>
      <Footer />
      </>
  );
}

export default MinistryJoinForm;
