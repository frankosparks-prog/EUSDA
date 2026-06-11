import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { User, Mail, Phone, MessageSquare, Send, Loader2, ArrowLeft, X, MessageCircle, ExternalLink } from "lucide-react";
import Toast from "./Toast";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const ministryLinks = {
  "Heavenly Voyagers": process.env.REACT_APP_HV_URL,
  "Calvary Ministers": process.env.REACT_APP_CALVARY_URL,
  "Revelation of Love Ministry": process.env.REACT_APP_ROL_URL,
};

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
  const [openDialog, setOpenDialog] = useState(false);

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

  const getWhatsAppLink = () => {
    return ministryLinks[decodedMinistry] || null;
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

        setOpenDialog(true);
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

  const handleJoinWhatsApp = () => {
    const link = getWhatsAppLink();
    if (link) {
      window.open(link, "_blank", "noopener,noreferrer");
    }
    setOpenDialog(false);
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

      {/* WhatsApp Group Dialog */}
      {openDialog && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center px-4 animate-fadeIn">
          <div 
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform animate-scaleIn"
            data-aos="zoom-in"
          >
            {/* Dialog Header */}
            <div className="bg-gradient-to-r from-green-700 to-green-900 p-6 relative">
              <button
                onClick={() => setOpenDialog(false)}
                className="absolute top-4 right-4 text-green-200 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
                aria-label="Close dialog"
                id="dialog-close-btn"
              >
                <X size={20} />
              </button>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <MessageCircle size={26} className="text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white" id="dialog-title">
                    Join the Ministry Group
                  </h3>
                  <p className="text-green-200 text-sm">{decodedMinistry}</p>
                </div>
              </div>
            </div>

            {/* Dialog Body */}
            <div className="p-6">
              <p className="text-gray-600 leading-relaxed mb-6">
                You can now join the <span className="font-semibold text-gray-800">WhatsApp group</span> for updates and coordination. Stay connected with fellow members and ministry leaders.
              </p>

              {/* WhatsApp Preview */}
              <div className="bg-green-50 border border-green-100 rounded-xl p-4 mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="white">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-green-800 text-sm">WhatsApp Group</p>
                  <p className="text-green-600 text-xs">{decodedMinistry} — Members Group</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleJoinWhatsApp}
                  className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 px-5 rounded-xl font-bold shadow-lg hover:shadow-green-700/25 transition-all duration-200 active:scale-[0.98]"
                  id="join-whatsapp-btn"
                >
                  Join WhatsApp Group
                  <ExternalLink size={18} />
                </button>
                <button
                  onClick={() => setOpenDialog(false)}
                  className="flex-1 sm:flex-none px-5 py-3 border border-gray-200 text-gray-600 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200"
                  id="dialog-secondary-close-btn"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
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

      {/* Dialog animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out forwards;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out forwards;
        }
      `}</style>
    </>
  );
}

export default MinistryJoinForm;