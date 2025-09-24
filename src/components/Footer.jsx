import React, { useState } from "react";
import { Facebook, Mail } from "lucide-react"; // Removed Twitter & Instagram
import Toast from "./Toast";
import axios from "axios";
import { FaWhatsapp } from "react-icons/fa";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

// ✅ Custom SVG for X (Twitter)
const XIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 24 24"
    className={className}
  >
    <path d="M18.244 2H21.5l-7.34 8.39L22 22h-6.79l-5.13-6.82L4.22 22H1l7.82-8.94L2 2h6.91l4.66 6.18L18.24 2zm-2.39 18h2.1L8.26 4h-2.2L15.85 20z" />
  </svg>
);

// ✅ Custom SVG for TikTok
const TikTokIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 24 24"
    className={className}
  >
    <path d="M12.95 2h3.1c.2 1.53 1.36 2.72 2.95 2.92V8c-1.16-.03-2.27-.37-3.2-.96v7.14c0 3.73-3.19 6.77-7.12 6.77C5.72 21 2.5 18 2.5 14.27c0-3.48 2.84-6.32 6.34-6.32.55 0 1.08.07 1.6.2v3.27a3.3 3.3 0 0 0-1.6-.42c-1.6 0-2.9 1.29-2.9 2.88 0 1.6 1.3 2.9 2.9 2.9 1.57 0 2.86-1.26 2.9-2.82V2h2.31z" />
  </svg>
);

const Footer = () => {
  const [email, setEmail] = useState("");
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${SERVER_URL}/api/subscribe`, { email });

      setToast({
        type: "success",
        message: `Thank you for subscribing: ${email}`,
      });
      setEmail("");
    } catch (err) {
      setToast({
        type: "error",
        message: "Subscription failed. Please try again.",
      });
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
            We are a community bound by faith, hope, and love. Join us in
            worship, outreach, and service as we walk together in Christ’s
            light.
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
                <a
                  href={link.path}
                  className="hover:text-yellow-300 hover:underline transition"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Connect & Newsletter */}
        <div>
          <h2 className="text-2xl font-bold text-yellow-400 mb-4">
            Connect with Us
          </h2>
          <div className="flex gap-4 mb-4 text-yellow-300">
            <a
              href="https://www.facebook.com/eusdaofficial"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a
              href="https://x.com/egertonunisda"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition"
            >
              <XIcon className="w-5 h-5" />
            </a>
            <a
              href="https://vm.tiktok.com/ZMABWehGC/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition"
            >
              <TikTokIcon className="w-5 h-5" />
            </a>
            <a
              href="mailto:eusdachurch@gmail.com"
              className="hover:text-white transition"
            >
              <Mail className="w-5 h-5" />
            </a>
            <a
              href="https://whatsapp.com/channel/0029VbBZptUGOj9pt3EoVt38"
              className="hover:text-white transition"
            >
              <FaWhatsapp className="w-5 h-5" />
            </a>
          </div>

          <p className="text-xs italic text-gray-400 mb-4">
            “For where two or three gather in my name, there am I with them.” —
            Matthew 18:20
          </p>

          {/* Newsletter */}
          <h3 className="text-lg font-semibold mb-2 text-yellow-400">
            EUSDA Community
          </h3>
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
        © {new Date().getFullYear()}{" "}
        <span className="text-white font-medium">EUSDA</span>. All rights
        reserved.
      </div>
    </footer>
  );
};

export default Footer;
