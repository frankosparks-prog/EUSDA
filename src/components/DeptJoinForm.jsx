import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Toast from "./Toast"; // Reuse Toast component

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

function DeptJoinForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    department: "",
  });

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null); // Toast handler

  useEffect(() => {
    AOS.init({ duration: 1000 });
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

      <section className="bg-white py-20 px-6 mt-20" data-aos="fade-up">
        <div className="max-w-3xl mx-auto bg-green-50 rounded-2xl shadow-lg p-10">
          <h2 className="text-3xl font-bold text-green-800 mb-4 text-center">
            Join a Department
          </h2>
          <p className="text-center text-gray-700 mb-10">
            Fill out the form below to express your interest in serving with us.
            We'd love to have you on board!
          </p>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                placeholder="+254 712 345 678"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Department
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                required
              >
                <option value="">-- Choose a Department --</option>
                <option value="Secretary’s Office">Secretary’s Office</option>
                <option value="Class Sabbath School">
                  Class Sabbath School
                </option>
                <option value="Treasury Department">Treasury Department</option>
                <option value="Deaconry Department">Deaconry Department</option>
                <option value="Audit Department">Audit Department</option>
                <option value="Sabbath School Department">
                  Sabbath School Department
                </option>
                <option value="Personal Ministry">Personal Ministry</option>
                <option value="Children Ministry">Children Ministry</option>
                <option value="Public Campus Ministries">
                  Public Campus Ministries
                </option>
                <option value="Interest Coordination">
                  Interest Coordination
                </option>
                <option value="Church Development Committee">
                  Church Development Committee
                </option>
                <option value="Stewardship Department">
                  Stewardship Department
                </option>
                <option value="Social, Health & Temperance Department">
                  Social, Health & Temperance Department
                </option>
                <option value="Publishing Department">
                  Publishing Department
                </option>
                <option value="Music Department">Music Department</option>
                <option value="Transport & Public Address Department">
                  Transport & Public Address Department
                </option>
                <option value="Communication & Publicity Department">
                  Communication & Publicity Department
                </option>
                <option value="Prayer and Fellowship Department">
                  Prayer and Fellowship Department
                </option>
                <option value="Master Guide Department">
                  Master Guide Department
                </option>
                <option value="Medical Missionary Department">
                  Medical Missionary Department
                </option>
                <option value="Voice of Prophecy Department">
                  Voice of Prophecy Department
                </option>
                <option value="Charity Department">Charity Department</option>
                <option value="Adventist Muslim Relations Department">
                  Adventist Muslim Relations Department
                </option>
                <option value="ALO & AMO Department">
                  ALO & AMO Department
                </option>
                <option value="EUSDA Chaplaincy Office">
                  EUSDA Chaplaincy Office
                </option>
              </select>
            </div>

            <div className="text-center pt-6">
              <button
                type="submit"
                className="bg-green-700 hover:bg-green-800 text-white py-3 px-8 rounded-full font-medium shadow-md transition duration-300"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit Interest"}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* <Footer /> */}
    </>
  );
}

export default DeptJoinForm;
