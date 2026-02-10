import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { FaWhatsapp, FaMapMarkerAlt } from "react-icons/fa";
import { Phone, Mail, Send, Loader2 } from "lucide-react";
import Toast from "./Toast";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

function Contact() {
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, message } = formData;

    if (!name || !email || !message) {
      setToast({
        type: "warning",
        message: "Please fill all required fields.",
      });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${SERVER_URL}/api/contact/send-mail`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setToast({ type: "success", message: data.success || "Message sent successfully!" });
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setToast({
          type: "error",
          message: data.error || "Failed to send message.",
        });
      }
    } catch (err) {
      setToast({ type: "error", message: "Server error. Please try again later." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ✅ Toast Notifications */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      {/* ✅ SEO Meta */}
      <Helmet>
        <title>Contact Us | Egerton University SDA Church (EUSDA)</title>
        <meta
          name="description"
          content="Get in touch with Egerton University SDA Church. Contact us via phone, email, WhatsApp, or visit us at B1 Class, Egerton University. We’re here to serve and connect with you."
        />
        <meta
          name="keywords"
          content="EUSDA contact, Egerton SDA Church contacts, SDA Egerton email, Egerton SDA WhatsApp, B1 Class Egerton location, SDA Church Kenya"
        />
        <meta property="og:title" content="Contact Us | Egerton University SDA Church" />
        <meta
          property="og:description"
          content="Reach out to Egerton University SDA Church via WhatsApp, email, or visit us at our location inside Egerton University."
        />
        <meta
          property="og:image"
          content="https://eusda.co.ke/eusda-logo.png"
        />
        <meta
          property="og:url"
          content="https://eusda.co.ke/contact"
        />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://eusda.co.ke/contact" />

        {/* ✅ Structured Data (LocalBusiness / Church) */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Church",
            name: "Egerton University SDA Church (EUSDA)",
            image: "https://eusda.co.ke/eusda-logo.png",
            url: "https://eusda.co.ke",
            telephone: "+254740925164",
            email: "eusdachurch@gmail.com",
            address: {
              "@type": "PostalAddress",
              streetAddress: "B1 Class, Egerton University",
              addressLocality: "Njoro",
              addressRegion: "Nakuru",
              postalCode: "20115",
              addressCountry: "KE",
            },
            sameAs: [
              "https://facebook.com/eusdaegerton",
              "https://twitter.com/eusdaegerton",
              "https://instagram.com/eusdaegerton",
            ],
            geo: {
              "@type": "GeoCoordinates",
              latitude: -0.3652322,
              longitude: 35.9252487,
            },
            openingHours: "Mo-Su 08:00-20:00",
          })}
        </script>
      </Helmet>

      {/* ✅ Page Content */}
      <div className="min-h-screen bg-gray-50 pt-24 pb-20 px-4 md:px-8 mt-[-8rem] md:mt-[-4rem]">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-green-600 font-bold tracking-wider uppercase text-sm">Get in Touch</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mt-2 mb-4">
            Contact <span className="text-green-700">Us</span>
          </h1>
          <p className="text-gray-600 text-lg">
            We'd love to hear from you. Whether you have a question about our services, need prayer, or just want to say hello!
          </p>
        </div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12">
          
          {/* Left Column: Contact Info & Map */}
          <div className="space-y-8">
            
            {/* Info Cards */}
            <div className="grid sm:grid-cols-2 gap-4">
              <a href="tel:+254740925164" className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all group">
                <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-600 group-hover:text-white transition-colors">
                  <Phone size={24} />
                </div>
                <h3 className="font-bold text-gray-900">Phone</h3>
                <p className="text-gray-500 text-sm mt-1">+254 740 925 164</p>
              </a>

              <a href="mailto:eusdachurch@gmail.com" className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all group">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Mail size={24} />
                </div>
                <h3 className="font-bold text-gray-900">Email</h3>
                <p className="text-gray-500 text-sm mt-1">eusdachurch@gmail.com</p>
              </a>
            </div>

            {/* WhatsApp CTA */}
            <a
              href="https://wa.me/254740925164"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 bg-[#25D366] text-white py-4 px-6 rounded-2xl shadow-lg hover:bg-[#20bd5a] transition-transform hover:-translate-y-1"
            >
              <FaWhatsapp size={24} />
              <span className="font-bold text-lg">Chat on WhatsApp</span>
            </a>

            {/* Google Map */}
            <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-200 h-80 relative overflow-hidden">
               <iframe 
                 title="EUSDA Location"
                 src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.7645163625345!2d35.9333333!3d-0.3666667!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1829f7b025555555%3A0x123456789abcdef!2sEgerton%20University!5e0!3m2!1sen!2ske!4v1700000000000!5m2!1sen!2ske"
                 width="100%" 
                 height="100%" 
                 style={{border:0, borderRadius: "12px"}} 
                 allowFullScreen="" 
                 loading="lazy" 
                 referrerPolicy="no-referrer-when-downgrade"
               ></iframe>
               <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-4 py-2 rounded-lg shadow text-xs font-semibold text-gray-700 flex items-center gap-2">
                 <FaMapMarkerAlt className="text-red-500" /> Egerton University, Njoro
               </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h3>
            
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Subject</label>
                <input
                  type="text"
                  name="subject"
                  placeholder="Prayer Request, Inquiry, etc."
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Message</label>
                <textarea
                  name="message"
                  placeholder="How can we help you?"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all resize-none"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-green-900/20 transform transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} /> Sending...
                  </>
                ) : (
                  <>
                    Send Message <Send size={18} />
                  </>
                )}
              </button>
            </form>
          </div>

        </div>
      </div>
    </>
  );
}

export default Contact;