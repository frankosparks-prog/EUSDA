import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import {
  User,
  Mail,
  Phone,
  Ticket,
  CalendarDays,
  MapPin,
  ArrowLeft,
  CheckCircle,
  Loader2,
  ShieldCheck,
  Tag,
  Clock,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Toast from "./Toast";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

export default function EventTicket() {
  // ─── Event data ────────────────────────────────────────────────────────────
  const [event, setEvent] = useState(null);
  const [loadingEvent, setLoadingEvent] = useState(true);

  // ─── Form state ────────────────────────────────────────────────────────────
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
  });
  const [submitting, setSubmitting] = useState(false);

  // ─── Success state (holds the created order) ───────────────────────────────
  const [order, setOrder] = useState(null);

  // ─── Toast ─────────────────────────────────────────────────────────────────
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "success",
    duration: 3500,
  });

  const { eventId } = useParams();
  const nav = useNavigate();

  // ─── Inline validation helpers (mirrors Register.jsx conventions) ──────────
  const isNameValid =
    formData.fullName.trim().length >= 2 &&
    /^[A-Za-z\s]+$/.test(formData.fullName.trim());
  const isEmailValid =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim());
  const isPhoneValid = /^0[17]\d{8}$/.test(formData.phone.trim());
  const isFormValid = isNameValid && isEmailValid && isPhoneValid;

  // ─── Fetch event ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (!eventId) {
      nav("/events");
      return;
    }

    // Try localStorage cache first (same approach as EventDetails.jsx)
    const cached = JSON.parse(localStorage.getItem("selectedEvent"));
    if (cached && cached._id === eventId) {
      setEvent(cached);
    }

    const fetchEvent = async () => {
      try {
        const res = await fetch(`${SERVER_URL}/api/events/${eventId}`);
        if (!res.ok) throw new Error("Failed to fetch event");
        const data = await res.json();
        setEvent(data);
      } catch (err) {
        console.error(err);
        if (!cached || cached._id !== eventId) {
          nav("/events");
        }
      } finally {
        setLoadingEvent(false);
      }
    };

    fetchEvent();
  }, [eventId, nav]);

  // ─── Handle input change ───────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const next = { ...prev, [name]: value };

      if (name === "fullName") {
        next.fullName = value.replace(/[^a-zA-Z\s]/g, "");
      }
      if (name === "phone") {
        next.phone = value.replace(/\D/g, "").slice(0, 10);
      }

      return next;
    });
  };

  // ─── Handle submit ─────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isNameValid) {
      return showToast("Name must contain letters and spaces only.", "error");
    }
    if (!isEmailValid) {
      return showToast("Please enter a valid email address.", "error");
    }
    if (!isPhoneValid) {
      return showToast(
        "Phone must be 10 digits starting with 07 or 01.",
        "error"
      );
    }

    setSubmitting(true);
    try {
      const { data } = await axios.post(`${SERVER_URL}/api/ticket-orders`, {
        eventId: event._id,
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
      });

      setOrder(data);
      showToast("Almost there! Proceed to payment to secure your ticket.", "success", 4000);
    } catch (err) {
      const msg =
        err.response?.data?.error || "Something went wrong. Please try again.";
      showToast(msg, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const showToast = (message, type = "success", duration = 3500) => {
    setToast({ visible: true, message, type, duration });
  };

  const [paying, setPaying] = useState(false);

  const handleProceedToPayment = async (orderId) => {
    setPaying(true);
    try {
      const { data } = await axios.post(
        `${SERVER_URL}/api/ticket-orders/${orderId}/pay`
      );
      if (data.authorizationUrl) {
        // Redirect user to Paystack's secure checkout
        window.location.href = data.authorizationUrl;
      } else {
        showToast("Unable to open payment gateway. Please try again.", "error");
        setPaying(false);
      }
    } catch (err) {
      const msg =
        err.response?.data?.error || "Failed to initialize payment gateway.";
      showToast(msg, "error");
      setPaying(false);
    }
  };

  if (loadingEvent) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <CircularProgress color="success" size={60} />
      </div>
    );
  }

  if (!event) return null;

  const formattedDate = new Date(event.date).toLocaleDateString("en-KE", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const isFree = !event.ticketPrice || event.ticketPrice === 0;
  const priceLabel = isFree
    ? "Free"
    : `KES ${event.ticketPrice.toLocaleString()}`;

  // ─── Success screen ────────────────────────────────────────────────────────
  if (order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
        <Helmet>
          <title>Ticket Confirmation | {event.title} | EUSDA</title>
        </Helmet>

        <div className="bg-white max-w-lg w-full rounded-3xl shadow-2xl p-8 border-t-4 border-green-600 text-center">

          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={44} className="text-green-600" />
          </div>

          <h1 className="text-2xl font-extrabold text-gray-900 mb-2">
            {order.amount === 0 ? "You're on the list!" : "Order Created!"}
          </h1>
          <p className="text-gray-500 mb-6 text-sm">
            {order.amount === 0 ? (
              <>
                Your spot for{" "}
                <span className="font-semibold text-gray-700">{event.title}</span>{" "}
                has been reserved.
              </>
            ) : (
              <>
                Complete your payment for{" "}
                <span className="font-semibold text-gray-700">{event.title}</span>{" "}
                to secure your ticket.
              </>
            )}
          </p>

          {/* Order reference card */}
          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 mb-6 text-left space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Order Reference
              </span>
              <span className="font-mono text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                {String(order.orderId)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Status</span>
              <span className="text-sm font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                {order.status}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Amount due</span>
              <span className="text-sm font-bold text-gray-900">
                {order.amount === 0
                  ? "Free"
                  : `KES ${order.amount.toLocaleString()}`}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Name</span>
              <span className="text-sm font-medium text-gray-800">
                {formData.fullName}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Email</span>
              <span className="text-sm font-medium text-gray-800">
                {formData.email}
              </span>
            </div>
          </div>

          {order.amount > 0 ? (
            <div className="space-y-3">
              <button
                onClick={() => handleProceedToPayment(order.orderId)}
                disabled={paying}
                className="w-full bg-green-700 text-white py-4 rounded-2xl font-bold text-base hover:bg-green-800 hover:shadow-lg hover:shadow-green-700/20 transition-all transform active:scale-95 flex justify-center items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {paying ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Opening Paystack…
                  </>
                ) : (
                  <>
                    <span>Proceed to Pay KES {order.amount.toLocaleString()}</span>
                  </>
                )}
              </button>

              <p className="text-xs text-gray-400">
                Supports M-Pesa, Debit/Credit Card, and Bank Transfer via Paystack.
              </p>

              <button
                onClick={() => nav(`/events/${event._id}`)}
                className="w-full text-sm text-gray-500 hover:text-gray-700 py-2 transition-colors"
              >
                Cancel & Return to Event
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                This is a free event, no payment required. Your entry is confirmed.
              </p>
              <button
                onClick={() => nav(`/events/${event._id}`)}
                className="w-full bg-green-700 text-white py-3 rounded-xl font-bold hover:bg-green-800 transition-all"
              >
                Back to Event
              </button>
            </div>
          )}
        </div>

        {toast.visible && (
          <Toast
            message={toast.message}
            duration={toast.duration}
            type={toast.type}
            onClose={() => setToast((p) => ({ ...p, visible: false }))}
          />
        )}
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Get Tickets | {event.title} | EUSDA</title>
        <meta
          name="description"
          content={`Buy a ticket for ${event.title} at ${event.venue}. ${event.description?.slice(0, 100) || ""}`}
        />
      </Helmet>

      {toast.visible && (
        <Toast
          message={toast.message}
          duration={toast.duration}
          type={toast.type}
          onClose={() => setToast((p) => ({ ...p, visible: false }))}
        />
      )}

      <div className="min-h-screen bg-gray-50 pb-20 pt-4">

        <div className="max-w-4xl mx-auto px-4 mb-4">
          <button
            onClick={() => nav(`/events/${event._id}`)}
            className="flex items-center gap-2 text-gray-500 hover:text-green-700 transition-colors text-sm font-medium"
          >
            <ArrowLeft size={16} /> Back to Event
          </button>
        </div>

        <div className="max-w-4xl mx-auto px-4 grid lg:grid-cols-5 gap-6">

          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden sticky top-24">
              {/* Event image */}
              {event.image && (
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-44 object-cover"
                />
              )}

              <div className="p-6 space-y-4">
                {/* Title */}
                <h2 className="text-xl font-extrabold text-gray-900 leading-tight">
                  {event.title}
                </h2>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <CalendarDays size={15} className="text-green-600 flex-shrink-0" />
                    <span>{formattedDate}</span>
                  </div>

                  {event.time && (
                    <div className="flex items-center gap-2">
                      <Clock size={15} className="text-green-600 flex-shrink-0" />
                      <span>{event.time}</span>
                    </div>
                  )}

                  {event.venue && (
                    <div className="flex items-center gap-2">
                      <MapPin size={15} className="text-green-600 flex-shrink-0" />
                      <span>{event.venue}</span>
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-100 pt-4">

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <Tag size={15} className="text-green-600" />
                      <span>Ticket Price</span>
                    </div>
                    <span
                      className={`text-lg font-extrabold ${isFree ? "text-green-600" : "text-gray-900"
                        }`}
                    >
                      {priceLabel}
                    </span>
                  </div>
                </div>

                {event.description && (
                  <p className="text-xs text-gray-400 leading-relaxed border-t border-gray-50 pt-4">
                    {event.description.slice(0, 160)}
                    {event.description.length > 160 && "…"}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">

              {/* Form header */}
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0">
                  <Ticket size={24} className="text-green-700" />
                </div>
                <div>
                  <h1 className="text-2xl font-extrabold text-gray-900">
                    Get Your Ticket
                  </h1>
                  <p className="text-sm text-gray-400">
                    Fill in your details to reserve your spot
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5" noValidate>

                {/* Attendee details section */}
                <div className="bg-gray-50 rounded-2xl border border-gray-100 p-5 space-y-4">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Attendee Details
                  </h3>

                  {/* Full Name */}
                  <div>
                    <div className="relative">
                      <User
                        size={17}
                        className="absolute left-3 top-3.5 text-gray-400 pointer-events-none"
                      />
                      <input
                        id="ticket-fullName"
                        type="text"
                        name="fullName"
                        placeholder="Full Name *"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        autoComplete="name"
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-sm"
                      />
                    </div>
                    {formData.fullName && !isNameValid && (
                      <p className="text-red-500 text-xs mt-1 ml-1">
                        At least 2 letters, letters and spaces only
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <div className="relative">
                      <Mail
                        size={17}
                        className="absolute left-3 top-3.5 text-gray-400 pointer-events-none"
                      />
                      <input
                        id="ticket-email"
                        type="email"
                        name="email"
                        placeholder="Email Address *"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        autoComplete="email"
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-sm"
                      />
                    </div>
                    {formData.email && !isEmailValid && (
                      <p className="text-red-500 text-xs mt-1 ml-1">
                        Enter a valid email address
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <div className="relative">
                      <Phone
                        size={17}
                        className="absolute left-3 top-3.5 text-gray-400 pointer-events-none"
                      />
                      <input
                        id="ticket-phone"
                        type="tel"
                        name="phone"
                        placeholder="Phone Number (07XX or 01XX) *"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        maxLength={10}
                        autoComplete="tel"
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-sm"
                      />
                    </div>
                    {formData.phone && !isPhoneValid && (
                      <p className="text-red-500 text-xs mt-1 ml-1">
                        10 digits starting with 07 or 01
                      </p>
                    )}
                  </div>
                </div>

                {/* Privacy note */}
                <div className="flex items-start gap-2 px-1">
                  <ShieldCheck
                    size={15}
                    className="text-green-600 mt-0.5 flex-shrink-0"
                  />
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Your details are used only for event check in and ticket delivery.
                    We do not share your information with third parties.
                  </p>
                </div>

                {/* Order summary */}
                <div className="bg-green-50 border border-green-100 rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-green-800 text-sm font-medium">
                    <Ticket size={16} />
                    <span>1 × {event.title} Ticket</span>
                  </div>
                  <span className="text-green-800 font-extrabold text-sm">
                    {priceLabel}
                  </span>
                </div>

                {/* Submit button */}
                <button
                  id="ticket-submit"
                  type="submit"
                  disabled={submitting || !isFormValid}
                  className="w-full bg-green-700 text-white py-4 rounded-2xl font-bold text-base hover:bg-green-800 hover:shadow-lg hover:shadow-green-700/20 transition-all transform active:scale-95 flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Reserving your spot…
                    </>
                  ) : (
                    <>
                      <Ticket size={18} />
                      {isFree ? "Reserve Free Spot" : `Reserve & Pay ${priceLabel}`}
                    </>
                  )}
                </button>

                <p className="text-center text-xs text-gray-400">
                  {isFree
                    ? "No payment required for this event."
                    : "You will complete payment in the next step."}
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
