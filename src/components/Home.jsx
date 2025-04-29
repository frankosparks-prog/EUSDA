import React from 'react';
import { Link } from 'react-router-dom';
import Footer from './Footer';

const Home = () => {
  return (
    <div className="cont">
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-green-100 to-green-300 text-center px-6 py-12 mt-8">
      
      {/* Hero Section */}
      <h1 className="text-4xl md:text-6xl font-extrabold text-green-900 mb-6 leading-tight">
        Welcome to EUSDA Family ✝️
      </h1>

      <p className="text-lg md:text-2xl text-green-800 mb-10 max-w-2xl">
        A place to be, where hearts are healed, hope is restored, and lives are transformed by God's amazing love.
      </p>

      {/* Buttons */}
      <div className="flex gap-6">
        <Link
          to="/about"
          className="bg-green-700 hover:bg-green-800 text-white font-bold py-3 px-6 rounded-full transition duration-300 shadow-lg"
        >
          Learn More
        </Link>
        <Link
          to="/events"
          className="bg-white hover:bg-green-100 text-green-700 font-bold py-3 px-6 rounded-full border-2 border-green-700 transition duration-300 shadow-lg"
        >
          Upcoming Events
        </Link>
      </div>

      {/* Inspirational Quote */}
      <div className="mt-16 italic text-green-900 text-sm md:text-base max-w-md">
        "Let all that you do be done in love." — 1 Corinthians 16:14
      </div>
    </div>
    <Footer />
      </div>
  );
};

export default Home;
