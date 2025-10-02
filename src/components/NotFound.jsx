import React from "react";
import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-green-50 to-green-100 text-center px-6 md:mt-32 mt-2 mb-[-2rem]">
      {/* Icon */}
      <AlertTriangle className="w-20 h-20 text-yellow-500 mb-6 animate-bounce" />

      {/* Heading */}
      <h1 className="text-6xl md:text-8xl font-extrabold text-green-800 mb-4">
        404
      </h1>
      <h2 className="text-2xl md:text-3xl font-bold text-green-700 mb-6">
        Oops! Page Not Found
      </h2>

      {/* Message */}
      <p className="text-gray-600 max-w-md mb-8">
        The page you’re looking for doesn’t exist or has been moved.  
        Let’s guide you back home safely.
      </p>

      {/* Button */}
      <Link
        to="/"
        className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg font-semibold transition transform hover:scale-105"
      >
        ⬅ Back to Home
      </Link>

      {/* Footer note */}
      <p className="mt-10 text-sm text-gray-500 italic">
        “For I know the plans I have for you…” — Jeremiah 29:11
      </p>
    </div>
  );
}

export default NotFound;
