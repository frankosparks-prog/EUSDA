import React, { useState } from "react";
import { Facebook, Mail, MapPin, ChevronRight, Heart } from "lucide-react";
import Toast from "./Toast";
import axios from "axios";
import { FaWhatsapp, FaYoutube } from "react-icons/fa";

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

  const socialLinks = [
    { icon: Facebook, href: "https://www.facebook.com/eusdaofficial" },
    { icon: XIcon, href: "https://x.com/egertonunisda" },
    { icon: TikTokIcon, href: "https://vm.tiktok.com/ZMABWehGC/" },
    { icon: FaYoutube, href: "https://www.youtube.com/@eusdachurch" },
    { icon: FaWhatsapp, href: "https://whatsapp.com/channel/0029VbBZptUGOj9pt3EoVt38" },
    { icon: Mail, href: "mailto:eusdachurch@gmail.com" },
  ];

  return (
    <footer className="bg-gray-950 text-white pt-16 pb-8 rounded-t-[3rem] mt-12 relative overflow-hidden">
      {/* Decorative Gradient Blob */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-24 bg-yellow-500/10 blur-[100px] pointer-events-none"></div>

      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* 1. About Us */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              EUSDA <span className="text-yellow-500">Church</span>
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              We are a community bound by faith, hope, and love. Join us in
              worship, outreach, and service as we walk together in Christ’s
              light.
            </p>
            <div className="flex items-start gap-3 text-gray-400 text-sm">
                <MapPin className="w-5 h-5 text-yellow-500 shrink-0" />
                <span>Egerton University, Njoro<br/>Kenya</span>
            </div>
          </div>

          {/* 2. Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6 border-b border-gray-800 pb-2 inline-block">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { label: "About Us", path: "/about" },
                { label: "Our Ministries", path: "/ministries" },
                { label: "Events Calendar", path: "/events" },
                { label: "Gallery", path: "/gallery" },
                { label: "BS Registration", path: "/bible-study" },
              ].map((link, i) => (
                <li key={i}>
                  <a
                    href={link.path}
                    className="group flex items-center text-gray-400 hover:text-yellow-400 transition-colors text-sm"
                  >
                    <ChevronRight className="w-4 h-4 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Resources & Contact */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6 border-b border-gray-800 pb-2 inline-block">Resources</h3>
            <ul className="space-y-3">
              {[
                {label: "Resources", path: "/resources"},
                { label: "Church Departments", path: "/departments" },
                { label: "Announcements", path: "/announcements" },
                { label: "Offering / Tithe", path: "/contributions" },
                { label: "Contact Support", path: "/contact" },
              ].map((link, i) => (
                <li key={i}>
                  <a
                    href={link.path}
                    className="group flex items-center text-gray-400 hover:text-yellow-400 transition-colors text-sm"
                  >
                    <ChevronRight className="w-4 h-4 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* 4. Newsletter & Socials */}
          <div className="space-y-6">
            <div>
                <h3 className="text-lg font-bold text-white mb-2">Stay Connected</h3>
                <p className="text-xs text-gray-500 mb-4">
                    Subscribe to receive latest news and updates.
                </p>
                <form onSubmit={handleSubscribe} className="relative">
                    <input
                        type="email"
                        value={email}
                        required
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email address"
                        className="w-full bg-gray-900 border border-gray-800 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all placeholder:text-gray-600"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="absolute right-1 top-1 bg-yellow-500 hover:bg-yellow-400 text-black text-xs font-bold px-4 py-2.5 rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? "..." : "Join"}
                    </button>
                </form>
            </div>

            <div>
                <h4 className="text-sm font-semibold text-gray-400 mb-3">Follow Us</h4>
                <div className="flex flex-wrap gap-3">
                    {socialLinks.map((social, idx) => (
                        <a
                            key={idx}
                            href={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-gray-900 hover:bg-yellow-500 hover:text-black text-gray-400 p-2.5 rounded-full transition-all duration-300 transform hover:-translate-y-1 shadow-lg border border-gray-800 hover:border-yellow-500"
                        >
                            <social.icon className="w-4 h-4" />
                        </a>
                    ))}
                </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>
            © {new Date().getFullYear()} <span className="text-gray-300 font-medium">EUSDA</span>. All rights reserved.
          </p>
          <p className="italic flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> for the Glory of God.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;