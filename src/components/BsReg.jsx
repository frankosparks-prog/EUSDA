import React, { useState } from "react";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import {
  BookOpen,
  CheckCircle,
  Loader2,
  MapPin,
  Home,
  Users,
  User,
  Phone,
  Calendar,
} from "lucide-react";
import Toast from "./Toast";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

// ✅ Data Structure: Region -> Residence -> Group Name
const BS_STRUCTURE = {
  "In Campus": {
    Nairobi: "Mt Moriah A",
    Eldoret: "Mt Moriah A",
    Mombasa: "Mt Moriah B",
    Argentina: "Mt Moriah B",
    CBD: "Mt Pisgah A",
    Mara: "Mt Pisgah A",
    Maringo: "Mt Pisgah B",
    Ruwenzori: "Mt Pisgah B",
    Uganda: "Gilead A",
    Barret: "Gilead A",
    "Old Hall": "Gilead A",
    Taifa: "Gilead B",
    "Mama Ngina": "Gilead B",
    Hollywood: "Bethany A",
    "Buruburu Block B": "Bethany A",
    "River View": "Bethany B",
    "Buruburu Block A": "Bethany B",
  },
  Diaspora: {
    "Sumkam & Surrounding": "Jerusalem A",
    "Rubis & Surrounding": "Jerusalem B",
    420: "Gethsemane A",
    "Booster (Diaspora)": "Gethsemane A",
    "Herbage & Surrounding": "Gethsemane B",
    "Ng'ondu & Surrounding": "Mt Olives A",
    "Wright & Surrounding": "Mt Olives B",
  },
  Njokerio: {
    "Grace Hill": "Eden A",
    "Mzalendo & Surrounding": "Judea A",
    "Brothers & Surrounding": "Judea B",
    "Ngumu Industrial Area": "Zion A",
    "Booster (Njokerio) & Surrounding": "Zion B",
  },
  Ahero: {
    "Ahero General": "Mt Sinai A",
  },
};

function BsReg() {
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    gender: "Male",
    yearOfStudy: "1.1",
    region: "",
    catchmentArea: "",
    groupName: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "success",
    duration: 3000,
  });
  const [registeredGroupName, setRegisteredGroupName] = useState("");

  // Handle Inputs
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const newData = { ...prev, [name]: value };

      // 1. Reset dependents if Region changes
      if (name === "region") {
        newData.catchmentArea = "";
        newData.groupName = "";
      }

      // 2. Auto-set Group Name based on Residence
      if (name === "catchmentArea" && value !== "") {
        const regionData = BS_STRUCTURE[prev.region];
        if (regionData && regionData[value]) {
          newData.groupName = regionData[value];
        }
      }

      // 3. Input sanitization: name -> letters/spaces only, phone -> digits only
      if (name === "fullName") {
        // allow letters and spaces only
        newData.fullName = value.replace(/[^a-zA-Z\s]/g, "");
      }

      if (name === "phoneNumber") {
        // allow digits only, limit to 15 chars
        newData.phoneNumber = value.replace(/\D/g, "").slice(0, 15);
      }

      return newData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Client-side validations
    const nameTrim = formData.fullName.trim();
    const phone = formData.phoneNumber.trim();
    const nameValid = /^[A-Za-z\s]+$/.test(nameTrim) && nameTrim.length > 1;
    const phoneValid = /^\d{10}$/.test(phone);

    if (!nameValid) {
      setToast({
        visible: true,
        message: "Name must contain letters and spaces only.",
        type: "error",
        duration: 3500,
      });
      setLoading(false);
      return;
    }

    if (!phoneValid) {
      setToast({
        visible: true,
        message: "Phone number must be digits only (10 digits).",
        type: "error",
        duration: 3500,
      });
      setLoading(false);
      return;
    }
    try {
      // preserve assigned group name for success UI before clearing
      const assignedGroup = formData.groupName;
      await axios.post(`${SERVER_URL}/api/bs/register`, formData);
      setRegisteredGroupName(assignedGroup);
      setSuccess(true);
      setToast({
        visible: true,
        message: "Registration successful. Welcome!",
        type: "success",
        duration: 3000,
      });
      setFormData({
        fullName: "",
        phoneNumber: "",
        gender: "Male",
        yearOfStudy: "1.1",
        region: "",
        catchmentArea: "",
        groupName: "",
      });
    } catch (err) {
      setToast({
        visible: true,
        message: "Registration failed. Please try again.",
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
        <title>Bible Study Registration | EUSDA</title>
        <meta
          name="description"
          content="Register for Bible Study groups at Egerton University SDA Church. Find your spiritual family based on your residence."
        />
      </Helmet>

      <div className="min-h-screen bg-gray-50 flex justify-center items-center md:py-8 px-4">
        <div className="bg-white max-w-2xl w-full rounded-2xl shadow-xl p-8 border-t-4 border-green-700 animate-in fade-in zoom-in duration-300">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen size={32} className="text-green-700" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              Bible Study Registration
            </h2>
            <p className="text-gray-500 mt-2">
              Join a family of believers near you.
            </p>
          </div>

          {success ? (
            <div className="text-center py-10 bg-green-50 rounded-xl border border-green-100">
              <CheckCircle
                size={64}
                className="text-green-600 mx-auto mb-4 animate-bounce"
              />
              <h3 className="text-2xl font-bold text-green-800">
                Welcome Home!
              </h3>
              <p className="text-gray-600 mt-2 max-w-sm mx-auto">
                You have successfully registered. You belong to the{" "}
                <span className="font-bold text-green-900">
                  {registeredGroupName}
                </span>{" "}
                family.
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

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="relative">
                    <User
                      size={18}
                      className="absolute left-3 top-3.5 text-gray-400"
                    />
                    <input
                      type="text"
                      name="fullName"
                      placeholder="Full Name"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-white transition-all"
                    />
                  </div>

                  <div className="relative">
                    <Phone
                      size={18}
                      className="absolute left-3 top-3.5 text-gray-400"
                    />
                    <input
                      type="tel"
                      name="phoneNumber"
                      placeholder="Phone Number"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      minLength={10}
                      maxLength={10}
                      required
                      className="w-full pl-10 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="relative">
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-white appearance-none"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  <div className="relative">
                    <Calendar
                      size={18}
                      className="absolute left-3 top-3.5 text-gray-400 pointer-events-none"
                    />
                    <select
                      name="yearOfStudy"
                      value={formData.yearOfStudy}
                      onChange={handleChange}
                      className="w-full pl-10 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-white appearance-none"
                    >
                      {[
                        "1.1",
                        "1.2",
                        "2.1",
                        "2.2",
                        "3.1",
                        "3.2",
                        "4.1",
                        "4.2",
                        "5.1",
                        "5.2",
                      ].map((y) => (
                        <option key={y} value={y}>
                          Year {y}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Location Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Location & Group
                </h3>

                {/* 1. Region */}
                <div
                  className={`transition-all duration-300 ${formData.groupName ? "opacity-50" : "opacity-100"}`}
                >
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-1">
                    <MapPin size={16} className="text-green-600" /> Select
                    Region
                  </label>
                  <select
                    name="region"
                    value={formData.region}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-white"
                  >
                    <option value="">-- Choose Region --</option>
                    {Object.keys(BS_STRUCTURE).map((region) => (
                      <option key={region} value={region}>
                        {region}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. Residence */}
                {formData.region && (
                  <div className="animate-in slide-in-from-top-2">
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-1">
                      <Home size={16} className="text-green-600" /> Select
                      Residence
                    </label>
                    <select
                      name="catchmentArea"
                      value={formData.catchmentArea}
                      onChange={handleChange}
                      required
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-white"
                    >
                      <option value="">-- Choose Residence --</option>
                      {Object.keys(BS_STRUCTURE[formData.region]).map(
                        (area) => (
                          <option key={area} value={area}>
                            {area}
                          </option>
                        ),
                      )}
                    </select>
                  </div>
                )}

                {/* 3. Assigned Group Badge */}
                {formData.groupName && (
                  <div className="animate-in zoom-in duration-300 mt-4">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-center justify-between shadow-sm">
                      <div>
                        <p className="text-xs text-green-600 font-bold uppercase mb-1">
                          You belong to
                        </p>
                        <p className="text-xl font-extrabold text-green-900 flex items-center gap-2">
                          <Users size={22} /> {formData.groupName}
                        </p>
                      </div>
                      <CheckCircle className="text-green-500" size={32} />
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-800 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-900 hover:shadow-lg transition-all transform active:scale-95 flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
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
      {/* Toast notifications */}
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

export default BsReg;
