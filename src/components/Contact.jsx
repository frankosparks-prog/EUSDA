import React from "react";
import { FaWhatsapp } from "react-icons/fa";
import { Phone, Mail } from "lucide-react";
import Footer from "./Footer";

function Contact() {
  return (
    <>
      <div className="pt-24 md:pt-32 pb-10 px-4 md:px-16 bg-white min-h-screen mt-12">
        {/* Header Section */}
        <div className="flex justify-center items-center text-4xl font-bold text-center text-green-700 mb-10 gap-4">
          <h2>Contact Us</h2>
          <span>
            <Phone className="text-green-600" />
          </span>
        </div>

        {/* Main Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Contact Form Section */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-lg space-y-6">
            <h3 className="text-2xl font-semibold">Send us a message</h3>
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                type="email"
                placeholder="Your Email"
                className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <textarea
                placeholder="Your Message"
                rows={5}
                className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              ></textarea>
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700 transition"
              >
                Send Message
              </button>
            </form>

            {/* WhatsApp Button */}
            <a
              href="https://wa.me/254712345678"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center mt-4 bg-green-500 text-white py-3 rounded-md hover:bg-green-600 transition"
            >
              <FaWhatsapp className="mr-2 text-2xl" />
              Chat with us on WhatsApp
            </a>

            {/* Phone and Email */}
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3 text-gray-700">
                <Phone className="text-green-600" />
                <a
                  href="tel:+254712345678"
                  className="hover:text-green-500 transition duration-300"
                >
                  +254 712 345 678
                </a>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Mail className="text-green-600" />
                <a
                  href="mailto:info@yourchurch.org"
                  className="hover:text-green-500 transition duration-300"
                >
                  info@yourchurch.org
                </a>
              </div>
            </div>
          </div>

          {/* Google Maps Section */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold mb-4">Our Location</h3>
            <div className="rounded-lg overflow-hidden shadow-lg">
              <iframe
                title="Our Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3975.926065417317!2d36.82194657487547!3d-1.2920653356417284!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f10d528fd4b3f%3A0x2d5b7289277e474e!2sNairobi!5e0!3m2!1sen!2ske!4v1683208748496!5m2!1sen!2ske"
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
      </div>
      <Footer />
    </>
  );
}

export default Contact;
