import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Ticket,
  CheckCircle2,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import Toast from "./Toast";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const styles = (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap');
    .tk { font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; }
    .tk-serif { font-family: 'Fraunces', Georgia, serif; }
    .tk-ink { color: #16261C; } .tk-muted { color: #6B7568; } .tk-gold { color: #C89B3C; }
    .tk-err { color: #B3452C; }
    .tk-card { background: #FCFBF8; border: 1px solid #D7DCD2; border-radius: 16px; box-shadow: 0 1px 2px rgba(22,38,28,.04), 0 10px 24px -14px rgba(22,38,28,.18); }
    .tk-field { border: 1px solid #D7DCD2; border-radius: 12px; transition: border-color .15s, box-shadow .15s; }
    .tk-field:focus-within { border-color: #1F6F4A; box-shadow: 0 0 0 3px rgba(31,111,74,.14); }
    .tk-btn { background: #1F6F4A; transition: background-color .15s, transform .1s; }
    .tk-btn:hover:not(:disabled) { background: #17573A; }
    .tk-btn:active:not(:disabled) { transform: scale(.98); }
    .tk-btn:disabled { background: #A9B8AE; }
    @media (prefers-reduced-motion: reduce) { * { transition: none !important; } }
  `}</style>
);

export default function TicketForm({ event, isModal = false, onClose }) {
  const nav = useNavigate();

  const [formData, setFormData] = useState({ fullName: "", email: "", phone: "" });
  const [submitting, setSubmitting] = useState(false);
  const [order, setOrder] = useState(null);
  const [paying, setPaying] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: "", type: "success", duration: 3500 });

  const showToast = (message, type = "success", duration = 3500) =>
    setToast({ visible: true, message, type, duration });

  const isNameValid = formData.fullName.trim().length >= 2 && /^[A-Za-z\s]+$/.test(formData.fullName.trim());
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim());
  const isPhoneValid = /^0[17]\d{8}$/.test(formData.phone.trim());
  const isFormValid = isNameValid && isEmailValid && isPhoneValid;

  const isFree = !event?.ticketPrice || event?.ticketPrice === 0;
  const priceLabel = isFree ? "Free" : `KES ${event?.ticketPrice?.toLocaleString()}`;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const next = { ...prev, [name]: value };
      if (name === "fullName") next.fullName = value.replace(/[^a-zA-Z\s]/g, "");
      if (name === "phone") next.phone = value.replace(/\D/g, "").slice(0, 10);
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isNameValid) return showToast("Name must contain letters and spaces only.", "error");
    if (!isEmailValid) return showToast("Please enter a valid email address.", "error");
    if (!isPhoneValid) return showToast("Phone must be 10 digits starting with 07 or 01.", "error");

    setSubmitting(true);
    try {
      const { data } = await axios.post(`${SERVER_URL}/api/ticket-orders`, {
        eventId: event._id,
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
      });
      setOrder(data);
      showToast("Order placed! Proceed to Payment.", "success", 4000);
    } catch (err) {
      showToast(err.response?.data?.error || "Something went wrong. Please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleProceedToPayment = async (orderId) => {
    setPaying(true);
    try {
      const { data } = await axios.post(`${SERVER_URL}/api/ticket-orders/${orderId}/pay`);
      if (data.reference) {
        setOrder((prev) => ({ ...prev, paystackReference: data.reference }));
      }
      if (data.authorizationUrl) {
        window.location.href = data.authorizationUrl;
      } else {
        showToast("Unable to open payment gateway. Please try again.", "error");
        setPaying(false);
      }
    } catch (err) {
      showToast(err.response?.data?.error || "Failed to initialize payment gateway.", "error");
      setPaying(false);
    }
  };

  const handleReturn = () => {
    if (isModal && onClose) onClose();
    else if (event?._id) nav(`/events/${event._id}`);
    else nav("/events");
  };

  if (!event) return null;

  const fields = [
    { id: "fullName", name: "fullName", type: "text", placeholder: "Full name", icon: User, autoComplete: "name", valid: isNameValid, error: "Letters and spaces only, at least 2 characters" },
    { id: "email", name: "email", type: "email", placeholder: "Email address", icon: Mail, autoComplete: "email", valid: isEmailValid, error: "Enter a valid email address" },
    { id: "phone", name: "phone", type: "tel", placeholder: "Phone number (07XX or 01XX)", icon: Phone, autoComplete: "tel", valid: isPhoneValid, error: "10 digits starting with 07 or 01", maxLength: 10 },
  ];

  return (
    <div className="tk">
      {styles}
      {toast.visible && (
        <Toast message={toast.message} duration={toast.duration} type={toast.type} onClose={() => setToast((p) => ({ ...p, visible: false }))} />
      )}

      {order ? (
        /* Confirmation: attendee details come straight from form state — no extra fetch. */
        <div className="tk-card p-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 text-white" style={{ background: "#1F6F4A" }}>
              <CheckCircle2 size={22} />
            </div>
            <div>
              <h2 className="tk-serif text-xl font-semibold tk-ink">
                {order.amount === 0 ? "You're on the list" : "Order created"}
              </h2>
              <p className="text-sm tk-muted">Ref {String(order.orderId).slice(-8)} · {order.status}</p>
            </div>
          </div>

          <dl className="mt-5 space-y-2 text-sm border-t pt-4" style={{ borderColor: "#EAEDE6" }}>
            <div className="flex items-center justify-between">
              <dt className="tk-muted">Attendee</dt>
              <dd className="font-medium tk-ink">{formData.fullName}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="tk-muted">Email</dt>
              <dd className="font-medium tk-ink">{formData.email}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="tk-muted">Phone</dt>
              <dd className="font-medium tk-ink">{formData.phone}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="tk-muted">Amount</dt>
              <dd className="font-medium tk-ink">{order.amount === 0 ? "Free" : `KES ${order.amount.toLocaleString()}`}</dd>
            </div>
          </dl>

          {order.amount > 0 ? (
            <div className="mt-5 space-y-2">
              <button
                onClick={() => handleProceedToPayment(order.orderId)}
                disabled={paying}
                className="tk-btn w-full text-white py-3 rounded-xl font-semibold text-sm flex justify-center items-center gap-2"
              >
                {paying ? <><Loader2 size={17} className="animate-spin" /> Opening Paystack…</> : `Pay KES ${order.amount.toLocaleString()}`}
              </button>
              <button
                onClick={() => {
                  const ref = order.paystackReference || String(order.orderId);
                  nav(`/payment/callback?reference=${encodeURIComponent(ref)}`);
                }}
                className="w-full text-xs py-2 px-3 rounded-lg border border-green-600 text-green-700 hover:bg-green-50 font-medium transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Already paid via M-Pesa? Verify status</span>
              </button>
              <button onClick={handleReturn} className="w-full text-xs py-1 tk-muted">
                {isModal ? "Close" : "Cancel & return to event"}
              </button>
            </div>
          ) : (
            <button onClick={handleReturn} className="tk-btn w-full mt-5 text-white py-3 rounded-xl font-semibold text-sm">
              {isModal ? "Done" : "Back to event"}
            </button>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          <div className="tk-card p-6">
            <p className="tk-serif text-xl font-semibold tk-ink">Attendee details</p>
            <p className="text-sm tk-muted mt-0.5 mb-4">For check-in and ticket delivery.</p>

            <div className="space-y-3">
              {fields.map(({ id, name, type, placeholder, icon: Icon, autoComplete, valid, error, maxLength }) => (
                <div key={id}>
                  <div className="tk-field relative">
                    <Icon size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#9AA398" }} />
                    <input
                      id={`ticket-${id}`}
                      type={type}
                      name={name}
                      placeholder={placeholder}
                      value={formData[name]}
                      onChange={handleChange}
                      required
                      autoComplete={autoComplete}
                      maxLength={maxLength}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-transparent outline-none text-sm"
                    />
                  </div>
                  {formData[name] && !valid && <p className="text-[11px] tk-err mt-1 ml-1">{error}</p>}
                </div>
              ))}
            </div>

            <div className="flex items-start gap-2 mt-4">
              <ShieldCheck size={15} className="mt-0.5 flex-shrink-0" style={{ color: "#1F6F4A" }} />
              <p className="text-[11px] leading-relaxed tk-muted">
                Used only for event check-in and ticket delivery. Never shared with third parties.
              </p>
            </div>

            <div className="flex items-center justify-between mt-4 px-1">
              <span className="text-sm tk-muted">1 ticket</span>
              <span className="tk-serif text-lg tk-ink">{priceLabel}</span>
            </div>

            <button
              id="ticket-submit"
              type="submit"
              disabled={submitting || !isFormValid}
              className="tk-btn w-full mt-4 text-white py-3 rounded-xl font-semibold text-sm flex justify-center items-center gap-2"
            >
              {submitting ? <><Loader2 size={17} className="animate-spin" /> Reserving…</> : <><Ticket size={16} /> {isFree ? "Reserve free spot" : `Reserve & pay ${priceLabel}`}</>}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}