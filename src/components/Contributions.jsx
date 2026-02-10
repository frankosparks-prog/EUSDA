// import React, { useEffect, useState } from "react";
// import AOS from "aos";
// import "aos/dist/aos.css";
// // import axios from "axios";
// import Toast from "./Toast";
// import SuccessModal from "./SuccessModal";
// // import { LoaderCircle } from "lucide-react";
// // import io from "socket.io-client";
// import PledgeModal from "./PledgeModal";

// // const socket = io(process.env.REACT_APP_SERVER_URL, {
// //   transports: ["websocket"],
// // });

// // const SERVER_URL = process.env.REACT_APP_SERVER_URL;

// function Contributions() {
//   const [formData, setFormData] = useState({
//     phone: "",
//     purpose: "",
//     amount: "",
//     paymentMethod: "mpesa",
//   });
//   const [customPurpose, setCustomPurpose] = useState("");
//   const [toast, setToast] = useState(null);
//   const [loading, setLoading] = useState(false);
//   // const [isPolling, setIsPolling] = useState(false);
//   const [transaction, setTransaction] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [showPledgeModal, setShowPledgeModal] = useState(false);

//   useEffect(() => {
//     AOS.init({ duration: 1000 });
//   }, []);

//   const handleChange = (e) => {
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setToast(null); // clear any previous toast

//     const { phone, amount, purpose, paymentMethod } = formData;
//     const finalPurpose =
//       formData.purpose === "Other" ? customPurpose : formData.purpose;

//     if (paymentMethod === "mpesa" && !phone.match(/^0(7|1)\d{8}$/)) {
//       setToast({ message: "Invalid phone number format.", type: "error" });
//       return;
//     }

//     if (!purpose || !amount) {
//       setToast({
//         message: "Please fill in all required fields.",
//         type: "warning",
//       });
//       return;
//     }

//     if (paymentMethod === "mpesa" && !phone) {
//       setToast({
//         message: "Phone number is required for M-Pesa payments.",
//         type: "warning",
//       });
//       return;
//     }

//     // const formattedPhone = "254" + phone.slice(1); // convert 07.. to 2547..
//     try {
//       // if (paymentMethod === "mpesa") {
//       //   const res = await axios.post(`${SERVER_URL}/api/mpesa/pay`, {
//       //     phone: formattedPhone,
//       //     amount,
//       //     purpose: finalPurpose,
//       //   });

//       //   if (res.data.message === "STK Push sent") {
//       //     const checkoutID = res.data.checkoutRequestID;

//       //     setToast({
//       //       message: "Payment initiated. Awaiting confirmation...",
//       //       type: "info",
//       //     });
//       //     setIsPolling(true);

//       //     let attempts = 0;
//       //     const maxAttempts = 15; // max 15 attempts (1 minute)

//       //     // Start polling
//       //     const intervalId = setInterval(async () => {
//       //       attempts++;
//       //       if (attempts > maxAttempts) {
//       //         clearInterval(intervalId);
//       //         setToast({
//       //           message:
//       //             "Payment timed out. Please try again or check your M-Pesa app.",
//       //           type: "error",
//       //         });
//       //         setIsPolling(false);
//       //         return;
//       //       }

//       //       try {
//       //         const txnRes = await axios.get(
//       //           `${SERVER_URL}/api/mpesa/transactions/${checkoutID}`
//       //         );
//       //         const txn = txnRes.data;

//       //         if (txn.status !== "Pending") {
//       //           clearInterval(intervalId);
//       //           setTransaction(txn);
//       //           setShowModal(true);
//       //           setToast(null); // clear the toast
//       //           setIsPolling(false);

//       //           // Emit live update to socket server
//       //           socket.emit("new-contribution", {
//       //             amount: Number(amount),
//       //             purpose,
//       //           });
//       //         }
//       //       } catch (err) {
//       //         clearInterval(intervalId);
//       //         setToast({
//       //           message: "Error checking payment status.",
//       //           type: "error",
//       //         });
//       //         setIsPolling(false);
//       //         console.error("Polling error:", err);
//       //       } finally {
//       //         setLoading(false);
//       //       }
//       //     }, 4000); // poll every 4s
//       //   } else {
//       //     setToast({
//       //       message: res.data.message || "Payment initiation failed.",
//       //       type: "error",
//       //     });
//       //   }
//       // }

//       if (paymentMethod === "mpesa") {
//         setToast({ message: "Mpesa payment coming soon...", type: "info" });
//         setLoading(false);
//         return;
//       } else if (paymentMethod === "card") {
//         setToast({ message: "Card payment coming soon...", type: "info" });
//         setLoading(false);
//         return;
//       }
//       // Reset form
//       setFormData({
//         phone: "",
//         purpose: "",
//         amount: "",
//         paymentMethod: "mpesa",
//       });
//       setCustomPurpose("");
//     } catch (err) {
//       console.error("Payment error:", err);
//       setToast({ message: "An error occurred during payment.", type: "error" });
//       setLoading(false);
//     }

//     if (!finalPurpose || !amount) {
//       setToast({
//         message: "Please fill in all required fields.",
//         type: "warning",
//       });
//       setLoading(false);
//       return;
//     }
//   };
//   const handlePledgeSubmit = (data) => {
//     console.log("Pledge submitted:", data);
//     setToast({
//       type: "success",
//       message: "Pledge submitted successfully!",
//     });
//   };
//   return (
//     <>
//       {toast && (
//         <Toast {...toast} duration={4000} onClose={() => setToast(null)} />
//       )}

//       <div className="bg-green-50 min-h-screen py-20 px-6  flex items-center justify-center md:mt-24">
//         <div
//           className="bg-white p-8 rounded-2xl shadow-xl max-w-lg w-full"
//           data-aos="fade-up"
//         >
//           <h2 className="text-3xl font-bold text-green-800 mb-6 text-center">
//             Make a Contribution
//           </h2>

//           <form onSubmit={handleSubmit} className="space-y-5">
//             {/* Payment Method */}
//             <div>
//               <label className="block text-sm font-medium text-green-700 mb-1">
//                 Payment Method
//               </label>
//               <select
//                 name="paymentMethod"
//                 value={formData.paymentMethod}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
//               >
//                 <option value="mpesa">M-Pesa</option>
//                 <option value="card">Credit/Debit Card</option>
//               </select>
//             </div>

//             {/* Phone Number (Only for M-Pesa) */}
//             {formData.paymentMethod === "mpesa" && (
//               <div>
//                 <label className="block text-sm font-medium text-green-700 mb-1">
//                   M-Pesa Phone Number
//                 </label>
//                 <input
//                   type="tel"
//                   name="phone"
//                   placeholder="07XX XXX XXX"
//                   value={formData.phone}
//                   onChange={handleChange}
//                   className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
//                   required={formData.paymentMethod === "mpesa"}
//                 />
//               </div>
//             )}

//             {/* Purpose */}
//             <div>
//               <label className="block text-sm font-medium text-green-700 mb-1">
//                 Contribution For
//               </label>
//               <select
//                 name="purpose"
//                 value={formData.purpose}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
//                 required
//               >
//                 <option value="">-- Select --</option>
//                 <option value="Tithe">Tithe</option>
//                 <option value="Offering">Offering</option>
//                 <option value="Thanksgiving">Thanksgiving</option>
//                 <option value="Building Fund">CDC</option>
//                 <option value="Special Giving">Special Giving</option>
//                 <option value="Other">Other</option>
//               </select>

//               {formData.purpose === "Other" && (
//                 <input
//                   type="text"
//                   placeholder="Please specify"
//                   value={customPurpose}
//                   onChange={(e) => setCustomPurpose(e.target.value)}
//                   className="mt-2 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
//                   required
//                 />
//               )}
//             </div>

//             {/* Amount */}
//             <div>
//               <label className="block text-sm font-medium text-green-700 mb-1">
//                 Amount (KES)
//               </label>
//               <input
//                 type="number"
//                 name="amount"
//                 placeholder="e.g. 500"
//                 value={formData.amount}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
//                 required
//               />
//             </div>

//             {/* Submit */}
//             <button
//               type="submit"
//               disabled={loading}
//               className={`w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition ${
//                 loading ? "opacity-50 cursor-not-allowed bg-green-700" : ""
//               }`}
//             >
//               {loading
//                 ? "Submitting request..."
//                 : ` ${
//                     formData.paymentMethod === "mpesa"
//                       ? "Send via M-Pesa"
//                       : "Proceed to Card Payment"
//                   } `}
//             </button>
//           </form>
//           {/* {isPolling && (
//             <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex flex-col items-center justify-center rounded-lg">
//               <LoaderCircle className="animate-spin-slow text-white w-10 h-10 mb-4" />
//               <p className="text-white text-sm">
//                 Awaiting M-Pesa confirmation...
//               </p>
//             </div>
//           )} */}
//         </div>
//       </div>
//       {showModal && transaction && (
//         <SuccessModal
//           transaction={transaction}
//           onClose={() => {
//             setShowModal(false);
//             setTransaction(null);
//           }}
//         />
//       )}
//       <div className="text-center bg-green-50 py-8 mt-[-6rem] md:mt-[-4rem] mb-[-3rem] md:mb-[-2rem]">
//         {/* Paybill Information Section */}
//         <div
//           className="bg-white p-6  mb-10 mx-auto max-w-lg rounded-xl shadow-md border border-green-200"
//           data-aos="fade-up"
//         >
//           <h3 className="text-xl font-bold text-green-800 text-center mb-3">
//             Direct M-Pesa Giving
//           </h3>

//           <p className="text-center text-gray-700 mb-1">
//             If you prefer giving manually via M-Pesa:
//           </p>

//           <div className="mt-4 space-y-2 text-center">
//             <p className="text-lg font-semibold text-green-700">
//               **PAYBILL: 4072615**
//             </p>

//             <p className="text-gray-800 font-medium">
//               **Name:** SEVENTH DAY ADVENTIST EGERTON
//             </p>

//             <p className="text-gray-700">
//               **Account:**
//               <span className="font-semibold">
//                 Tithe, Offering, Subscription, Mission, Camp Meeting, etc.
//               </span>
//             </p>

//             <p className="text-sm text-gray-500 mt-2 italic">
//               Enter the purpose of your giving as the account.
//             </p>
//           </div>
//         </div>

//         {/* <button
//         onClick={() => setShowPledgeModal(true)}
//         className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 px-6 rounded-full shadow-lg transition duration-300"
//       >
//         Make a Pledge
//       </button> */}

//         <PledgeModal
//           isOpen={showPledgeModal}
//           onClose={() => setShowPledgeModal(false)}
//           onSubmit={handlePledgeSubmit}
//           setToast={setToast}
//         />
//       </div>
//     </>
//   );
// }

// export default Contributions;


import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Toast from "./Toast";
import SuccessModal from "./SuccessModal";
import PledgeModal from "./PledgeModal";
import { 
  Smartphone, CreditCard, Banknote, MessageCircle, 
  Copy, Check, Heart, ShieldCheck 
} from "lucide-react";

function Contributions() {
  const [formData, setFormData] = useState({
    phone: "",
    purpose: "",
    amount: "",
    paymentMethod: "mpesa",
  });
  const [customPurpose, setCustomPurpose] = useState("");
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [transaction, setTransaction] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showPledgeModal, setShowPledgeModal] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCopyPaybill = () => {
    navigator.clipboard.writeText("4072615");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    setToast({ type: "success", message: "Paybill copied to clipboard!" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setToast(null);

    const { phone, amount, purpose, paymentMethod } = formData;
    const finalPurpose = formData.purpose === "Other" ? customPurpose : formData.purpose;

    // Validation Logic
    if (paymentMethod === "mpesa" && !phone.match(/^0(7|1)\d{8}$/)) {
      setToast({ message: "Invalid phone number format.", type: "error" });
      setLoading(false);
      return;
    }

    if (!purpose || !amount) {
      setToast({ message: "Please fill in all required fields.", type: "warning" });
      setLoading(false);
      return;
    }

    if (paymentMethod === "mpesa" && !phone) {
      setToast({ message: "Phone number is required for M-Pesa payments.", type: "warning" });
      setLoading(false);
      return;
    }

    try {
      // Simulation of Logic based on provided snippet
      if (paymentMethod === "mpesa") {
        // Keeps the existing logic structure
        setToast({ message: "Mpesa payment coming soon...", type: "info" });
        setLoading(false);
        return;
      } else if (paymentMethod === "card") {
        setToast({ message: "Card payment coming soon...", type: "info" });
        setLoading(false);
        return;
      }

      // Reset form (If successful in future logic)
      setFormData({
        phone: "",
        purpose: "",
        amount: "",
        paymentMethod: "mpesa",
      });
      setCustomPurpose("");
    } catch (err) {
      console.error("Payment error:", err);
      setToast({ message: "An error occurred during payment.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handlePledgeSubmit = (data) => {
    console.log("Pledge submitted:", data);
    setToast({
      type: "success",
      message: "Pledge submitted successfully!",
    });
  };

  return (
    <>
      {toast && (
        <Toast {...toast} duration={4000} onClose={() => setToast(null)} />
      )}

      <div className="min-h-screen bg-gray-50 pt-24 pb-20 px-4 md:px-6 mt-[-8rem] md:mt-[-4rem] overflow-x-hidden">
        
        {/* Header Section */}
        <div className="text-center mb-12" data-aos="fade-down">
          <span className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <Heart size={16} className="fill-green-800" /> Giving & Tithe
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Make a <span className="text-green-700">Contribution</span>
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            "Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver."
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 items-start">
          
          {/* Left Column: Payment Form */}
          <div 
            className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100" 
            data-aos="fade-right"
          >
            <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
              <div className="p-3 bg-green-50 rounded-full text-green-600">
                <CreditCard size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Online Giving</h2>
                <p className="text-sm text-gray-500">Secure instant payment</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Payment Method */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Select Method</label>
                <div className="grid grid-cols-2 gap-4">
                  <label className={`cursor-pointer border-2 rounded-xl p-3 flex items-center justify-center gap-2 transition-all ${formData.paymentMethod === 'mpesa' ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 hover:border-green-200'}`}>
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="mpesa" 
                      checked={formData.paymentMethod === "mpesa"} 
                      onChange={handleChange} 
                      className="hidden"
                    />
                    <Smartphone size={20} /> M-Pesa
                  </label>
                  <label className={`cursor-pointer border-2 rounded-xl p-3 flex items-center justify-center gap-2 transition-all ${formData.paymentMethod === 'card' ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 hover:border-green-200'}`}>
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="card" 
                      checked={formData.paymentMethod === "card"} 
                      onChange={handleChange} 
                      className="hidden"
                    />
                    <CreditCard size={20} /> Card
                  </label>
                </div>
              </div>

              {/* Phone Number */}
              {formData.paymentMethod === "mpesa" && (
                <div className="animate-in fade-in slide-in-from-top-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">M-Pesa Number</label>
                  <div className="relative">
                    <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="tel"
                      name="phone"
                      placeholder="07XX XXX XXX"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                      required={formData.paymentMethod === "mpesa"}
                    />
                  </div>
                </div>
              )}

              {/* Purpose Selection */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Contribution For</label>
                <div className="relative">
                  <MessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <select
                    name="purpose"
                    value={formData.purpose}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all appearance-none"
                    required
                  >
                    <option value="">-- Select Purpose --</option>
                    <option value="Tithe">Tithe</option>
                    <option value="Offering">Offering</option>
                    <option value="Thanksgiving">Thanksgiving</option>
                    <option value="Building Fund">CDC / Building Fund</option>
                    <option value="Special Giving">Special Giving</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                {formData.purpose === "Other" && (
                  <input
                    type="text"
                    placeholder="Please specify purpose"
                    value={customPurpose}
                    onChange={(e) => setCustomPurpose(e.target.value)}
                    className="mt-3 w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all animate-in fade-in"
                    required
                  />
                )}
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Amount (KES)</label>
                <div className="relative">
                  <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="number"
                    name="amount"
                    placeholder="e.g. 500"
                    value={formData.amount}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-700 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-green-800 hover:shadow-green-900/20 transform transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
              >
                {loading ? "Processing..." : (
                  <>
                    <ShieldCheck size={20} /> 
                    {formData.paymentMethod === "mpesa" ? "Pay via M-Pesa" : "Proceed to Card"}
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Column: Manual Paybill Info */}
          <div className="space-y-6" data-aos="fade-left">
            
            {/* Paybill Card */}
            <div className="bg-gradient-to-br from-green-800 to-green-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
              {/* Decorative Circles */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-10 -mb-10 blur-xl"></div>

              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Smartphone className="text-green-300" /> Manual M-Pesa
              </h3>

              <div className="space-y-6 relative z-10">
                <div>
                  <p className="text-green-200 text-sm mb-1 uppercase tracking-wider">Paybill Number</p>
                  <div className="flex items-center gap-3">
                    <span className="text-4xl font-mono font-bold tracking-widest text-white">4072615</span>
                    <button 
                      onClick={handleCopyPaybill}
                      className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                      title="Copy Paybill"
                    >
                      {copied ? <Check size={20} className="text-green-300"/> : <Copy size={20} />}
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-green-200 text-sm mb-1 uppercase tracking-wider">Account Name</p>
                  <p className="font-semibold text-lg">SEVENTH DAY ADVENTIST EGERTON</p>
                </div>

                <div className="bg-white/10 p-4 rounded-xl border border-white/10">
                  <p className="text-green-200 text-sm mb-1">Account No. (Purpose)</p>
                  <p className="text-white text-sm">
                    Enter the purpose as the account number: <br/>
                    <span className="font-mono text-green-300">Tithe, Offering, CDC, etc.</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Pledge CTA (Optional - Uncomment if needed) */}
            {/* <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-2xl text-center">
              <h4 className="text-lg font-bold text-yellow-800 mb-2">Make a Pledge?</h4>
              <p className="text-yellow-700 text-sm mb-4">Commit to supporting upcoming church projects.</p>
              <button
                onClick={() => setShowPledgeModal(true)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-6 rounded-full shadow-md transition-all"
              >
                Create Pledge
              </button>
            </div> 
            */}

          </div>
        </div>

        {/* Modals */}
        {showModal && transaction && (
          <SuccessModal
            transaction={transaction}
            onClose={() => {
              setShowModal(false);
              setTransaction(null);
            }}
          />
        )}

        <PledgeModal
          isOpen={showPledgeModal}
          onClose={() => setShowPledgeModal(false)}
          onSubmit={handlePledgeSubmit}
          setToast={setToast}
        />
      </div>
    </>
  );
}

export default Contributions;