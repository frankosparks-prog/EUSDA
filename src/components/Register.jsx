import React, { useState } from "react";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import {
  UserPlus,
  CheckCircle,
  Loader2,
  User,
  Phone,
  Mail,
  ShieldCheck,
} from "lucide-react";
import Toast from "./Toast";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    gender: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "success",
    duration: 3000,
  });

  const isNameValid = formData.fullName.trim().length >= 2 && /^[A-Za-z\s]+$/.test(formData.fullName.trim());
  const isPhoneValid = /^0[17]\d{8}$/.test(formData.phoneNumber.trim());
  const isGenderSelected = formData.gender === "Male" || formData.gender === "Female";
  const isFormValid = isNameValid && isPhoneValid && isGenderSelected;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const newData = { ...prev, [name]: value };

      if (name === "fullName") {
        newData.fullName = value.replace(/[^a-zA-Z\s]/g, "");
      }

      if (name === "phoneNumber") {
        newData.phoneNumber = value.replace(/\D/g, "").slice(0, 10);
      }

      return newData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!isNameValid) {
      setToast({
        visible: true,
        message: "Name must contain letters and spaces only.",
        type: "error",
        duration: 3500,
      });
      setLoading(false);
      return;
    }

    if (!isPhoneValid) {
      setToast({
        visible: true,
        message: "Phone number must be exactly 10 digits.",
        type: "error",
        duration: 3500,
      });
      setLoading(false);
      return;
    }

    if (!isGenderSelected) {
      setToast({
        visible: true,
        message: "Please select your gender.",
        type: "error",
        duration: 3500,
      });
      setLoading(false);
      return;
    }

    try {
      await axios.post(`${SERVER_URL}/api/register`, formData);
      setSuccess(true);
      setToast({
        visible: true,
        message: "Registration successful",
        type: "success",
        duration: 3000,
      });
      setFormData({
        fullName: "",
        phoneNumber: "",
        gender: "",
        email: "",
      });
    } catch (err) {
      setToast({
        visible: true,
        message: err.response?.data?.error || "Registration failed. Please try again.",
        type: "error",
        duration: 4000,
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>First-Year Registration | EUSDA</title>
        <meta
          name="description"
          content="Register as a first-year student at Egerton University SDA Church. Join the EUSDA family today."
        />
      </Helmet>

      <div className="min-h-screen bg-gray-50 flex justify-center items-center md:py-8 px-4">
        <div className="bg-white max-w-2xl w-full rounded-2xl shadow-xl p-8 border-t-4 border-green-700 animate-in fade-in zoom-in duration-300">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserPlus size={32} className="text-green-700" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              First-Year Registration
            </h2>
            <p className="text-gray-500 mt-2">
              Welcome to EUSDA! Register to join our family.
            </p>
          </div>

          {success ? (
            <div className="text-center py-10 bg-green-50 rounded-xl border border-green-100">
              <CheckCircle
                size={64}
                className="text-green-600 mx-auto mb-4 animate-bounce"
              />
              <h3 className="text-2xl font-bold text-green-800">
                Welcome to EUSDA!
              </h3>
              <p className="text-gray-600 mt-2 max-w-sm mx-auto">
                Member Registration Successfull!
              </p>
              <button
                onClick={() => setSuccess(false)}
                className="mt-6 text-sm text-green-700 underline hover:text-green-900"
              >
                Register someone else
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Info Section */}
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 space-y-4">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Personal Details
                </h3>

                {/* Full Name */}
                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-3 top-3.5 text-gray-400"
                  />
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Full Name *"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-white transition-all"
                  />
                  {formData.fullName && !isNameValid && (
                    <p className="text-red-500 text-xs mt-1 ml-1">Name must be at least 2 letters (letters and spaces only)</p>
                  )}
                </div>

                {/* Phone Number */}
                <div className="relative">
                  <Phone
                    size={18}
                    className="absolute left-3 top-3.5 text-gray-400"
                  />
                  <input
                    type="tel"
                    name="phoneNumber"
                    placeholder="Phone Number e.g. 07XX or 01XX XXX XXX *"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    maxLength={10}
                    required
                    className="w-full pl-10 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-white transition-all"
                  />
                  {formData.phoneNumber && !isPhoneValid && (
                    <p className="text-red-500 text-xs mt-1 ml-1">Must be 10 digits</p>
                  )}
                </div>

                {/* Email */}
                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-3 top-3.5 text-gray-400"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address (Optional)"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-gray-500 mb-2 block">
                    Gender *
                  </label>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="radio"
                        name="gender"
                        value="Male"
                        checked={formData.gender === "Male"}
                        onChange={handleChange}
                        className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500 accent-green-600"
                      />
                      <span className="text-gray-700 group-hover:text-green-700 transition-colors font-medium">
                        Male
                      </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="radio"
                        name="gender"
                        value="Female"
                        checked={formData.gender === "Female"}
                        onChange={handleChange}
                        className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500 accent-green-600"
                      />
                      <span className="text-gray-700 group-hover:text-green-700 transition-colors font-medium">
                        Female
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2 px-1">
                <ShieldCheck size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-gray-500 leading-relaxed">
                  Your information will only be used for church planning .
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || !isFormValid}
                className="w-full bg-green-800 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-900 hover:shadow-lg transition-all transform active:scale-95 flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Complete Registration"
                )}
              </button>
            </form>
          )}
        </div>
      </div>

      {toast.visible && (
        <Toast
          message={toast.message}
          duration={toast.duration}
          type={toast.type}
          onClose={() => setToast((prev) => ({ ...prev, visible: false }))}
        />
      )}
    </>
  );
}

export default Register;
