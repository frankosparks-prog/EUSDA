import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { User, Mail, Phone, MessageSquare, Send, Loader2, ArrowLeft } from "lucide-react";
import Toast from "./Toast";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

function MinistryJoinForm() {
  const { ministryName } = useParams();
  const decodedMinistry = decodeURIComponent(ministryName);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    reason: "",
  });

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 800, easing: "ease-out-cubic", once: true });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ministry: decodedMinistry,
      ...formData,
    };

    try {
      const response = await fetch(`${SERVER_URL}/api/joinMinistry`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        setToast({ type: "success", message: data.message || "Application submitted successfully!" });
        setFormData({
          fullName: "",
          email: "",
          phoneNumber: "",
          reason: "",
        });
      } else {
        setToast({ type: "error", message: data.message || "Submission failed." });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setToast({ type: "error", message: "An unexpected error occurred." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <section className="min-h-screen bg-gradient-to-br from-green-50 to-gray-100 py-20 px-4 md:px-6 flex items-center justify-center mt-[-4rem] md:mt-0">
        <div 
          className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden"
          data-aos="fade-up"
        >
          {/* Header Section */}
          <div className="bg-green-900 p-8 text-center relative">
            {/* Back Button */}
            <Link 
              to="/ministries" 
              className="absolute top-6 left-6 text-green-200 hover:text-white transition-colors"
              title="Back to Ministries"
            >
              <ArrowLeft size={24} />
            </Link>

            <h2 className="text-3xl font-bold text-white mb-2">
              Join Ministry
            </h2>
            <p className="text-green-100">
              You are applying to join <br/>
              <span className="font-bold text-white text-lg underline decoration-green-400 underline-offset-4">
                {decodedMinistry}
              </span>
            </p>
          </div>

          {/* Form Section */}
          <div className="p-8 md:p-10">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    name="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all"
                    required
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    name="phoneNumber"
                    type="tel"
                    placeholder="07XX XXX XXX"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all"
                    required
                    value={formData.phoneNumber}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Reason Textarea */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Why do you want to join?
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-4 text-gray-400" size={20} />
                  <textarea
                    name="reason"
                    rows="4"
                    placeholder="Share your motivation or experience..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all resize-none"
                    required
                    value={formData.reason}
                    onChange={handleChange}
                  ></textarea>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-green-700 hover:bg-green-800 text-white py-3.5 rounded-lg font-bold shadow-lg hover:shadow-green-900/20 transform transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Processing...
                  </>
                ) : (
                  <>
                    Submit Application <Send size={18} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}

export default MinistryJoinForm;