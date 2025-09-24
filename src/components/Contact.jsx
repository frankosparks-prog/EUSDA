import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { FaWhatsapp } from "react-icons/fa";
import { Phone, Mail } from "lucide-react";
import Toast from "./Toast";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

function Contact() {
  const [toast, setToast] = useState(null);
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

    try {
      const res = await fetch(`${SERVER_URL}/api/send-mail`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setToast({ type: "success", message: data.success || "Message sent!" });
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setToast({
          type: "error",
          message: data.error || "Failed to send message.",
        });
      }
    } catch (err) {
      setToast({ type: "error", message: "Server error. Please try again." });
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
      <div className="pt-24 md:pt-32 pb-10 px-4 md:px-16 bg-white min-h-screen md:mt-12 mt-2">
        {/* Header */}
        <div className="flex justify-center items-center text-4xl font-bold text-center text-green-700 mb-10 gap-4">
          <h2>Contact Us</h2>
          <span>
            <Phone className="text-green-600" />
          </span>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Form */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-lg space-y-6">
            <h3 className="text-2xl font-semibold">Send us a message</h3>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-green-500"
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-green-500"
              />
              <input
                type="text"
                name="subject"
                placeholder="Subject (optional)"
                value={formData.subject}
                onChange={handleChange}
                className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-green-500"
              />
              <textarea
                name="message"
                placeholder="Your Message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-green-500"
              ></textarea>
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700 transition"
              >
                Send Message
              </button>
            </form>

            {/* WhatsApp */}
            <a
              href="https://wa.me/254740925164"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center mt-4 bg-green-500 text-white py-3 rounded-md hover:bg-green-600 transition"
            >
              <FaWhatsapp className="mr-2 text-2xl" />
              Chat with us on WhatsApp
            </a>

            {/* Phone + Email */}
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3 text-gray-700">
                <Phone className="text-green-600" />
                <a href="tel:+254740925164" className="hover:text-green-500">
                  +254 740 925 164
                </a>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Mail className="text-green-600" />
                <a
                  href="mailto:eusdachurch@gmail.com"
                  className="hover:text-green-500"
                >
                  eusdachurch@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Google Maps */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold mb-4">Our Location</h3>

            <iframe
              title="Our Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5669.633017743352!2d35.92524872639778!3d-0.3652322451711406!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1829874425da9613%3A0x8c73e0f9df3cef0c!2sB1%20CLASS%20EGERTON%20UNIVERSITY!5e0!3m2!1sen!2ske!4v1752762239981!5m2!1sen!2ske"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              className="h-full min-h-[400px] w-full rounded-lg"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </>
  );
}

export default Contact;
