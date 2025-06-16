// import React, { useEffect } from "react";
// import { useParams } from "react-router-dom";
// import AOS from "aos";
// import "aos/dist/aos.css";
// import Footer from "./Footer";

// function MinistryJoinForm() {
//   const { ministryName } = useParams();

//   useEffect(() => {
//     AOS.init({ duration: 1000 });
//   }, []);

//   return (
//     <>
//       <section
//         className="bg-white py-20 px-6 mt-20 flex items-center justify-center"
//         data-aos="fade-up"
//       >
//         <div
//           className="bg-white p-8 rounded-2xl shadow-lg max-w-lg w-full"
//           data-aos="fade-up"
//         >
//           <h2 className="text-3xl font-bold text-green-800 mb-6 text-center">
//             Join {decodeURIComponent(ministryName)}
//           </h2>
//           <form className="space-y-5">
//             <div>
//               <label className="block text-sm font-medium text-green-700 mb-1">
//                 Full Name
//               </label>
//               <input
//                 type="text"
//                 placeholder="Your full name"
//                 className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-green-700 mb-1">
//                 Email Address
//               </label>
//               <input
//                 type="email"
//                 placeholder="you@example.com"
//                 className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-green-700 mb-1">
//                 Phone Number
//               </label>
//               <input
//                 type="tel"
//                 placeholder="07XX XXX XXX"
//                 className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-green-700 mb-1">
//                 Why do you want to join?
//               </label>
//               <textarea
//                 rows="3"
//                 placeholder="Share your reason..."
//                 className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
//                 required
//               ></textarea>
//             </div>
//             <button
//               type="submit"
//               className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition"
//             >
//               Submit Application
//             </button>
//           </form>
//         </div>
//       </section>
//       <Footer />
//     </>
//   );
// }

// export default MinistryJoinForm;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import Footer from "./Footer";
import Toast from "./Toast"; // Make sure path is correct

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
  const [toast, setToast] = useState(null); // 👈 Toast state

  useEffect(() => {
    AOS.init({ duration: 1000 });
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
        setToast({ type: "success", message: data.message || "Application submitted!" });
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

      <section
        className="bg-white py-20 px-6 mt-20 flex items-center justify-center"
        data-aos="fade-up"
      >
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-lg w-full" data-aos="fade-up">
          <h2 className="text-3xl font-bold text-green-800 mb-6 text-center">
            Join {decodedMinistry}
          </h2>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-green-700 mb-1">Full Name</label>
              <input
                name="fullName"
                type="text"
                placeholder="Your full name"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
                required
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-green-700 mb-1">Email Address</label>
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-green-700 mb-1">Phone Number</label>
              <input
                name="phoneNumber"
                type="tel"
                placeholder="07XX XXX XXX"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
                required
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-green-700 mb-1">
                Why do you want to join?
              </label>
              <textarea
                name="reason"
                rows="3"
                placeholder="Share your reason..."
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
                required
                value={formData.reason}
                onChange={handleChange}
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Application"}
            </button>
          </form>
        </div>
      </section>

      {/* <Footer /> */}
    </>
  );
}

export default MinistryJoinForm;
