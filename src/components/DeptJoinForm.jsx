import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { User, Mail, Phone, Briefcase, Send, Loader2, ChevronDown } from "lucide-react";
import Toast from "./Toast";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

// Extracted data for cleaner code and easier updates
const DEPARTMENTS = [
  "Secretary’s Office",
  "Class Sabbath School",
  "Treasury Department",
  "Deaconry Department",
  "Audit Department",
  "Sabbath School Department",
  "Personal Ministry",
  "Children Ministry",
  "Public Campus Ministries",
  "Interest Coordination",
  "Church Development Committee",
  "Stewardship Department",
  "Social, Health & Temperance Department",
  "Publishing Department",
  "Music Department",
  "Transport & Public Address Department",
  "Communication & Publicity Department",
  "Prayer and Fellowship Department",
  "Master Guide Department",
  "Medical Missionary Department",
  "Voice of Prophecy Department",
  "Charity Department",
  "Adventist Muslim Relations Department",
  "ALO & AMO Department",
  "EUSDA Chaplaincy Office",
];

function DeptJoinForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    department: "",
  });

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${SERVER_URL}/api/joinDepartment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setToast({
          type: "success",
          message: data.message || "Successfully submitted!",
        });
        setFormData({
          fullName: "",
          email: "",
          phoneNumber: "",
          department: "",
        });
      } else {
        setToast({
          type: "error",
          message: data.message || "Submission failed.",
        });
      }
    } catch (error) {
      console.error(error);
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

      <section className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-2 md:py-16">
        <div 
          className="bg-white w-full max-w-5xl rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row"
          data-aos="fade-up"
        >
          {/* Decorative Sidebar (Visible on Desktop) */}
          <div className="md:w-5/12 bg-green-900 text-white p-10 flex flex-col justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-green-800 to-green-950 opacity-100"></div>
            {/* Pattern Overlay */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>
            
            <div className="relative z-10">
              <h3 className="text-3xl font-bold mb-6">Serve With Us</h3>
              <p className="text-green-100 text-lg leading-relaxed mb-8">
                "For even the Son of Man came not to be served but to serve, and to give his life as a ransom for many."
              </p>
              <div className="w-12 h-1 bg-green-400 rounded-full"></div>
              <p className="mt-4 text-sm text-green-300 font-medium tracking-wide">
                MARK 10:45
              </p>
            </div>
          </div>

          {/* Form Section */}
          <div className="md:w-7/12 p-8 md:p-12">
            <div className="text-left mb-8">
              <h2 className="text-2xl font-bold text-gray-800">Department Sign Up</h2>
              <p className="text-gray-600 mt-2">
                Fill in your details below to join a ministry.
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Full Name */}
              <div className="relative">
                <label className="text-sm font-semibold text-gray-700 mb-1 block">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>

              {/* Email & Phone Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="relative">
                  <label className="text-sm font-semibold text-gray-700 mb-1 block">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="relative">
                  <label className="text-sm font-semibold text-gray-700 mb-1 block">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                      placeholder="0712 345 678"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Department Select */}
              <div className="relative">
                <label className="text-sm font-semibold text-gray-700 mb-1 block">Select Department</label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white appearance-none cursor-pointer"
                    required
                  >
                    <option value="">-- Choose a Ministry --</option>
                    {DEPARTMENTS.map((dept, index) => (
                      <option key={index} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                  {/* Custom Arrow Icon */}
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-green-700 hover:bg-green-800 text-white font-bold py-3.5 px-6 rounded-lg shadow-lg hover:shadow-green-900/20 transform transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Interest <Send size={18} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}

export default DeptJoinForm;