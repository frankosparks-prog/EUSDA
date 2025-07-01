import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";
import Toast from "./Toast";
import SuccessModal from "./SuccessModal";
import { LoaderCircle } from "lucide-react";
import io from "socket.io-client";

const socket = io(process.env.REACT_APP_SERVER_URL, {
  transports: ["websocket"],
});

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

function Contributions() {
  const [formData, setFormData] = useState({
    phone: "",
    purpose: "",
    amount: "",
    paymentMethod: "mpesa",
  });
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  const [transaction, setTransaction] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setToast(null); // clear any previous toast

    const { phone, amount, purpose, paymentMethod } = formData;

    if (paymentMethod === "mpesa" && !phone.match(/^0(7|1)\d{8}$/)) {
      setToast({ message: "Invalid phone number format.", type: "error" });
      return;
    }

    if (!purpose || !amount) {
      setToast({
        message: "Please fill in all required fields.",
        type: "warning",
      });
      return;
    }

    if (paymentMethod === "mpesa" && !phone) {
      setToast({
        message: "Phone number is required for M-Pesa payments.",
        type: "warning",
      });
      return;
    }

    const formattedPhone = "254" + phone.slice(1); // convert 07.. to 2547..
    try {
      if (paymentMethod === "mpesa") {
        const res = await axios.post(`${SERVER_URL}/api/mpesa/pay`, {
          phone: formattedPhone,
          amount,
          purpose,
        });

        if (res.data.message === "STK Push sent") {
          const checkoutID = res.data.checkoutRequestID;

          setToast({
            message: "Payment initiated. Awaiting confirmation...",
            type: "info",
          });
          setIsPolling(true);

          let attempts = 0;
          const maxAttempts = 15; // max 15 attempts (1 minute)

          // Start polling
          const intervalId = setInterval(async () => {
            attempts++;
            if (attempts > maxAttempts) {
              clearInterval(intervalId);
              setToast({
                message:
                  "Payment timed out. Please try again or check your M-Pesa app.",
                type: "error",
              });
              setIsPolling(false);
              return;
            }

            try {
              const txnRes = await axios.get(
                `${SERVER_URL}/api/mpesa/transactions/${checkoutID}`
              );
              const txn = txnRes.data;

              if (txn.status !== "Pending") {
                clearInterval(intervalId);
                setTransaction(txn);
                setShowModal(true);
                setToast(null); // clear the toast
                setIsPolling(false);

                // Emit live update to socket server
                socket.emit("new-contribution", {
                  amount: Number(amount),
                  purpose,
                });
              }
            } catch (err) {
              clearInterval(intervalId);
              setToast({
                message: "Error checking payment status.",
                type: "error",
              });
              setIsPolling(false);
              console.error("Polling error:", err);
            } finally {
              setLoading(false);
            }
          }, 4000); // poll every 4s
        } else {
          setToast({
            message: res.data.message || "Payment initiation failed.",
            type: "error",
          });
        }
      } else if (paymentMethod === "card") {
        setToast({ message: "Card payment coming soon...", type: "info" });
        setLoading(false);
        return;
      }

      // Reset form
      setFormData({
        phone: "",
        purpose: "",
        amount: "",
        paymentMethod: "mpesa",
      });
    } catch (err) {
      console.error("Payment error:", err);
      setToast({ message: "An error occurred during payment.", type: "error" });
      setLoading(false);
    }
  };
  return (
    <>
      {toast && (
        <Toast {...toast} duration={4000} onClose={() => setToast(null)} />
      )}

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
              disabled={loading}
              className={`w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition ${
                loading ? "opacity-50 cursor-not-allowed bg-green-700" : ""
              }`}
            >
              {loading
                ? "Submitting request..."
                : ` ${
                    formData.paymentMethod === "mpesa"
                      ? "Send via M-Pesa"
                      : "Proceed to Card Payment"
                  } `}
            </button>
          </form>
          {isPolling && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex flex-col items-center justify-center rounded-lg">
              <LoaderCircle className="animate-spin-slow text-white w-10 h-10 mb-4" />
              <p className="text-white text-sm">
                Awaiting M-Pesa confirmation...
              </p>
            </div>
          )}
        </div>
      </div>
      {showModal && transaction && (
        <SuccessModal
          transaction={transaction}
          onClose={() => {
            setShowModal(false);
            setTransaction(null);
          }}
        />
      )}
    </>
  );
}

export default Contributions;
