import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Footer from "./Footer";

function Contributions() {
  const [formData, setFormData] = useState({
    phone: "",
    purpose: "",
    amount: "",
    paymentMethod: "mpesa",
  });

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.purpose || !formData.amount) {
      alert("Please fill in all required fields");
      return;
    }

    if (formData.paymentMethod === "mpesa" && !formData.phone) {
      alert("Please enter your M-Pesa phone number");
      return;
    }

    if (formData.paymentMethod === "mpesa") {
      alert(
        `STK Push Initiated:\nPhone: ${formData.phone}\nPurpose: ${formData.purpose}\nAmount: KES ${formData.amount}`
      );
    } else if (formData.paymentMethod === "card") {
      alert(
        `Redirecting to card payment:\nPurpose: ${formData.purpose}\nAmount: KES ${formData.amount}`
      );
    }

    setFormData({
      phone: "",
      purpose: "",
      amount: "",
      paymentMethod: "mpesa",
    });
  };

  return (
    <>
      <div className="bg-green-50 min-h-screen py-20 px-6  flex items-center justify-center mt-[-5rem] md:mt-20 mb-[-12rem] md:mb-[-2rem]">
        <div
          className="bg-white p-8 rounded-2xl shadow-xl max-w-lg w-full"
          data-aos="fade-up"
        >
          <h2 className="text-3xl font-bold text-green-800 mb-6 text-center">
            Make a Contribution
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium text-green-700 mb-1">
                Payment Method
              </label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
              >
                <option value="mpesa">M-Pesa</option>
                <option value="card">Credit/Debit Card</option>
              </select>
            </div>

            {/* Phone Number (Only for M-Pesa) */}
            {formData.paymentMethod === "mpesa" && (
              <div>
                <label className="block text-sm font-medium text-green-700 mb-1">
                  M-Pesa Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="07XX XXX XXX"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
                  required={formData.paymentMethod === "mpesa"}
                />
              </div>
            )}

            {/* Purpose */}
            <div>
              <label className="block text-sm font-medium text-green-700 mb-1">
                Contribution For
              </label>
              <select
                name="purpose"
                value={formData.purpose}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
                required
              >
                <option value="">-- Select --</option>
                <option value="Tithe">Tithe</option>
                <option value="Offering">Offering</option>
                <option value="Thanksgiving">Thanksgiving</option>
                <option value="Building Fund">CDC</option>
                <option value="Special Giving">Special Giving</option>
              </select>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-green-700 mb-1">
                Amount (KES)
              </label>
              <input
                type="number"
                name="amount"
                placeholder="e.g. 500"
                value={formData.amount}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
                required
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              {formData.paymentMethod === "mpesa"
                ? "Send via M-Pesa"
                : "Proceed to Card Payment"}
            </button>
          </form>
        </div>
      </div>
      {/* <Footer /> */}
    </>
  );
}

export default Contributions;
