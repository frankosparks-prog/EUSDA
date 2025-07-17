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
    <footer className="bg-neutral-900 text-white py-12 px-6 rounded-t-3xl shadow-inner mt-9">
  {toast && (
    <Toast
      type={toast.type}
      message={toast.message}
      onClose={() => setToast(null)}
    />
  )}
  
  <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
    {/* About Us */}
    <div>
      <h2 className="text-2xl font-bold text-yellow-400 mb-4">About Us</h2>
      <p className="text-sm leading-relaxed text-gray-300">
        We are a community bound by faith, hope, and love. Join us in worship, outreach, and service as we walk together in Christ’s light.
      </p>
    </div>

    {/* Quick Links */}
    <div>
      <h2 className="text-2xl font-bold text-yellow-400 mb-4">Quick Links</h2>
      <ul className="space-y-2 text-sm text-gray-300">
        {[
          { label: "About", path: "/about" },
          { label: "Events", path: "/events" },
          { label: "Donate || Contribute", path: "/contributions" },
          { label: "Departments", path: "/departments" },
          { label: "Ministries", path: "/ministries" },
          { label: "Announcements", path: "/announcements" },
          { label: "Gallery", path: "/gallery" },
          { label: "Contact Us", path: "/contact" },
        ].map((link, i) => (
          <li key={i}>
            <a href={link.path} className="hover:text-yellow-300 hover:underline transition">
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>

    {/* Connect & Newsletter */}
    <div>
      <h2 className="text-2xl font-bold text-yellow-400 mb-4">Connect with Us</h2>
      <div className="flex gap-4 mb-4 text-yellow-300">
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
          <Facebook className="w-5 h-5" />
        </a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
          <Twitter className="w-5 h-5" />
        </a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
          <Instagram className="w-5 h-5" />
        </a>
        <a href="mailto:info@church.com" className="hover:text-white transition">
          <Mail className="w-5 h-5" />
        </a>
      </div>

      <p className="text-xs italic text-gray-400 mb-4">
        “For where two or three gather in my name, there am I with them.” — Matthew 18:20
      </p>

      {/* Newsletter */}
      <h3 className="text-lg font-semibold mb-2 text-yellow-400">EUSDA Community</h3>
      <p className="text-sm text-gray-300 mb-3">
        Stay informed on our latest events & programs.
      </p>
      <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
        <input
          type="email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          className="px-3 py-2 rounded bg-gray-100 text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
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

  {/* Bottom Copyright */}
  <div className="text-center text-xs text-gray-500 mt-10 pt-6 border-t border-gray-700">
    © {new Date().getFullYear()} <span className="text-white font-medium">EUSDA</span>. All rights reserved.
  </div>
</footer>

  );
};

export default Footer;
