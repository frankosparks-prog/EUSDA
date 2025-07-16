import React, { useState } from "react";
import { Facebook, Twitter, Instagram, Mail } from "lucide-react";
import Toast from "./Toast";
import axios from "axios";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const Footer = () => {
  const [email, setEmail] = useState("");
  const [toast, setToast] = useState(null); // 👈 Toast state
    const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${SERVER_URL}/api/subscribe`, { email });
      
      setToast({ type: "success", message: `Thank you for subscribing: ${email}` });
      setEmail("");
    } catch (err) {
      setToast({ type: "error", message: "Subscription failed. Please try again." })
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <footer className="bg-gradient-to-r from-green-700 to-green-900 text-white py-10 px-6 rounded-t-3xl shadow-inner mt-10">
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* About Church */}
        <div>
          <h2 className="text-2xl font-bold mb-4">About Us</h2>
          <p className="text-sm leading-relaxed">
            We are a community bound by faith, hope, and love. Join us in
            worship, outreach, and service as we walk together in Christ’s
            light.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Quick Links</h2>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href="/about"
                className="hover:underline hover:text-yellow-300"
              >
                About
              </a>
            </li>
            <li>
              <a
                href="/events"
                className="hover:underline hover:text-yellow-300"
              >
                Events
              </a>
            </li>
            <li>
              <a
                href="/contributions"
                className="hover:underline hover:text-yellow-300"
              >
                Donate || Contribute
              </a>
            </li>
            <li>
              <a
                href="/departments"
                className="hover:underline hover:text-yellow-300"
              >
                Departments
              </a>
            </li>
            <li>
              <a
                href="/ministries"
                className="hover:underline hover:text-yellow-300"
              >
                Ministries
              </a>
            </li>
            <li>
              <a
                href="/announcements"
                className="hover:underline hover:text-yellow-300"
              >
                Announcements
              </a>
            </li>
            <li>
              <a
                href="/gallery"
                className="hover:underline hover:text-yellow-300"
              >
                Gallery
              </a>
            </li>
            <li>
              <a
                href="/contact"
                className="hover:underline hover:text-yellow-300"
              >
                Contact Us
              </a>
            </li>
          </ul>
        </div>

        {/* Contact + Social Media */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Connect with Us</h2>
          <div className="flex gap-4 mb-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-yellow-300"
            >
              <Facebook />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-yellow-300"
            >
              <Twitter />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-yellow-300"
            >
              <Instagram />
            </a>
            <a href="mailto:info@church.com" className="hover:text-yellow-300">
              <Mail />
            </a>
          </div>

          {/* Small Bible Verse */}
          <p className="text-xs italic">
            “For where two or three gather in my name, there am I with them.” —
            Matthew 18:20
          </p>
          {/* Newsletter */}
          <div>
            <h3 className="text-xl font-semibold mb-4 mt-8">EUSDA Community</h3>
            <p className="text-sm mb-3 opacity-90">
              Join our community & stay informed about our latest events &
              programs.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
              <input
                type="email"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="px-3 py-2 rounded bg-white text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-300"
              />
              <button
                type="submit"
                className="bg-yellow-400 hover:bg-yellow-500 text-black py-2 rounded font-semibold transition"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Subscribe"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom copyright */}
      <div className="text-center text-xs mt-10 opacity-75">
        © {new Date().getFullYear()} EUSDA. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
