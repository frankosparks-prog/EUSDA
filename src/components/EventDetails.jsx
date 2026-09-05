import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import Toast from "./Toast";
import {
  CalendarDays,
  MapPin,
  Users,
  Timer,
  Info,
  ArrowLeft,
  Share2,
  Ticket,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import TicketModal from "./TicketModal";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

export default function EventDetails() {
  const [event, setEvent] = useState(null);
  const [registered, setRegistered] = useState(false);
  const [toast, setToast] = useState(null);
  const [busy, setBusy] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);

  const nav = useNavigate();
  const { eventId } = useParams();

  /* ─── load event & local RSVP flag ─── */
  useEffect(() => {
    const picked = JSON.parse(localStorage.getItem("selectedEvent"));
    const saved = JSON.parse(localStorage.getItem("registeredEvents")) || [];

    const fetchEvent = async (id) => {
      try {
        const res = await fetch(`${SERVER_URL}/api/events/${id}`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setEvent(data);
        setRegistered(saved.includes(data._id));
      } catch (err) {
        console.error(err);
        setToast({ message: "Could not fetch event data.", type: "error" });
        if (picked && picked._id === id) {
          setEvent(picked); // Fallback to LS data
          setRegistered(saved.includes(picked._id));
        } else {
          // If no LS fallback and fetch failed, go back
          nav("/events");
        }
      }
    };

    if (picked && picked._id === eventId) {
      setEvent(picked);
      setRegistered(saved.includes(picked._id));
      // Still refresh from server
      fetchEvent(eventId);
    } else if (eventId) {
      fetchEvent(eventId);
    } else if (picked) {
      // Fallback for cases where ID might not be in URL but picked is in LS
      setEvent(picked);
      setRegistered(saved.includes(picked._id));
      fetchEvent(picked._id);
    } else {
      nav("/events");
    }
  }, [nav, eventId]);

  /* ─── countdown ─── */
  useEffect(() => {
    if (!event) return;
    const target = new Date(event.date).getTime();

    const int = setInterval(() => {
      const diff = Math.max(0, target - Date.now());
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / (1000 * 60)) % 60);
      const s = Math.floor((diff / 1000) % 60);
      setTimeLeft({
        days: String(d).padStart(2, "0"),
        hours: String(h).padStart(2, "0"),
        minutes: String(m).padStart(2, "0"),
        seconds: String(s).padStart(2, "0"),
      });
    }, 1000);

    return () => clearInterval(int);
  }, [event]);

  /* ─── register / unregister ─── */
  const toggle = async () => {
    if (!event || busy) return;
    setBusy(true);

    const action = registered ? "unregister" : "register";
    try {
      const res = await fetch(`${SERVER_URL}/api/events/${event._id}/rsvp`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: action }),
      });
      const updated = await res.json();
      if (!res.ok) throw new Error("Server error");

      setEvent(updated);
      setRegistered(!registered);

      // keep localStorage in sync
      const saved = new Set(
        JSON.parse(localStorage.getItem("registeredEvents")) || [],
      );
      if (action === "register") saved.add(event._id);
      else saved.delete(event._id);
      localStorage.setItem("registeredEvents", JSON.stringify([...saved]));

      setToast({
        message:
          action === "register" ? "You're registered!" : "You've unregistered.",
        type: action === "register" ? "success" : "neutral",
      });
    } catch (err) {
      console.error(err);
      setToast({ message: "Something went wrong.", type: "error" });
    } finally {
      setBusy(false);
      setTimeout(() => setToast(null), 3000);
    }
  };

  /* ─── share event ─── */
  const shareEvent = async () => {
    if (!event) return;
    const url = `${window.location.origin}/events/${event._id}`;
    const sharePayload = {
      title: event.title,
      text: event.description?.slice(0, 120) || "Check out this event",
      url,
    };

    try {
      if (navigator.share) {
        await navigator.share(sharePayload);
        setToast({ message: "Event shared successfully.", type: "success" });
      } else if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
        setToast({
          message: "Event link copied to clipboard.",
          type: "success",
        });
      } else {
        const ta = document.createElement("textarea");
        ta.value = url;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        setToast({
          message: "Event link copied to clipboard.",
          type: "success",
        });
      }
    } catch (err) {
      console.error(err);
      setToast({ message: "Could not share the event.", type: "error" });
    } finally {
      setTimeout(() => setToast(null), 3000);
    }
  };

  /* ─── buy ticket click handler (modal on mobile, page on desktop) ─── */
  const handleBuyTicket = () => {
    if (!event) return;
    localStorage.setItem("selectedEvent", JSON.stringify(event));

    // For mobile and smaller handheld devices (< 768px), open dialog box in-place.
    // For laptops and bigger screens (>= 768px), keep the current dedicated page redirect.
    if (window.innerWidth < 768) {
      setIsTicketModalOpen(true);
    } else {
      nav(`/events/${event._id}/ticket`);
    }
  };

  if (!event) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <CircularProgress color="success" size={60} />
      </div>
    );
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    startDate: event.date,
    location: { "@type": "Place", name: event.venue, address: event.venue },
    image: [event.image],
    description: event.description,
    organizer: {
      "@type": "Organization",
      name: "EUSDA",
      url: "https://eusda.co.ke",
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 overflow-x-hidden mt-[-6rem] md:mt-[-4rem]">
      <Helmet>
        <title>{event.title} | EUSDA Events</title>
        <meta name="description" content={event.description?.slice(0, 160)} />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      {toast && (
        <Toast {...toast} duration={3000} onClose={() => setToast(null)} />
      )}

      {/* Hero Section with Blur Backdrop */}
      <div className="relative h-[40vh] min-h-[350px] md:min-h-[400px] w-full overflow-hidden">
        {/* Blurred Background */}
        <div
          className="absolute inset-0 bg-cover bg-center blur-sm scale-110 opacity-50"
          style={{ backgroundImage: `url(${event.image || "https://eusda.co.ke/eusda-logo.png"})` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent"></div>

        {/* Navigation Bar */}
        <div className="absolute top-20 md:top-24 left-0 right-0 px-4 md:px-6 z-20 flex justify-between items-start max-w-7xl mx-auto">
          <button
            onClick={() => nav("/events")}
            className="flex items-center gap-2 text-white/90 hover:text-white bg-black/30 hover:bg-black/50 backdrop-blur-md px-3 md:px-4 py-2 rounded-full transition-all text-sm md:text-base"
          >
            <ArrowLeft size={18} /> Back
          </button>
        </div>

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 pb-6 md:pb-12 z-10">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-6">
              {/* Main Event Image (Thumbnail) - Hidden on mobile */}
              <img
                src={event.image || "https://eusda.co.ke/eusda-logo.png"}
                alt={event.title}
                className="w-32 h-32 md:w-48 md:h-48 object-cover rounded-2xl border-4 border-white shadow-2xl hidden md:block"
              />

              <div className="flex-1 text-white">
                <div className="flex flex-wrap gap-2 md:gap-4 text-xs md:text-sm font-medium text-green-300 mb-2">
                  <span className="flex items-center gap-1 bg-green-900/40 px-2 md:px-3 py-1 rounded-full backdrop-blur-md border border-green-500/30">
                    <CalendarDays size={14} />{" "}
                    {new Date(event.date).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1 bg-green-900/40 px-2 md:px-3 py-1 rounded-full backdrop-blur-md border border-green-500/30">
                    <MapPin size={14} /> {event.venue}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold leading-tight mb-2">
                  {event.title}
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-3 sm:px-4 md:px-6 -mt-6 md:-mt-8 relative z-20">
        <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
          {/* Left Col: Details */}
          <div className="lg:col-span-2 space-y-6 md:space-y-8">
            {/* Countdown Timer */}
            <div className="bg-white rounded-2xl md:rounded-3xl shadow-xl p-4 md:p-8 border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
              <div className="flex items-center gap-3 text-gray-700">
                <div className="p-2 md:p-3 bg-blue-50 text-blue-600 rounded-full">
                  <Timer size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-base md:text-lg">Event Starts In</h3>
                  <p className="text-xs md:text-sm text-gray-500">Don't be late!</p>
                </div>
              </div>

              <div className="flex gap-2 md:gap-3 text-center">
                <TimeBox value={timeLeft.days} label="Days" />
                <span className="text-xl md:text-2xl font-bold text-gray-300 mt-2">:</span>
                <TimeBox value={timeLeft.hours} label="Hrs" />
                <span className="text-xl md:text-2xl font-bold text-gray-300 mt-2">:</span>
                <TimeBox value={timeLeft.minutes} label="Mins" />
                <span className="text-xl md:text-2xl font-bold text-gray-300 mt-2">:</span>
                <TimeBox value={timeLeft.seconds} label="Secs" />
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl md:rounded-3xl shadow-sm p-4 md:p-8 border border-gray-100">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2 mb-4 md:mb-6">
                <Info className="text-green-600" /> About the Event
              </h2>
              <div className="prose prose-green max-w-none text-gray-600 leading-relaxed">
                <p className="text-base md:text-lg">{event.description}</p>
                {event.longDescription && (
                  <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-gray-100">
                    <p className="whitespace-pre-line text-sm md:text-base">
                      {event.longDescription}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Col: Sidebar Action */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl md:rounded-3xl shadow-lg p-4 md:p-6 border border-gray-100 md:sticky md:top-24">
              <div className="text-center mb-4 md:mb-6">
                <p className="text-xs md:text-sm text-gray-500 uppercase font-bold tracking-wider mb-1">
                  Attendance
                </p>
                <div className="flex items-center justify-center gap-2 text-2xl md:text-3xl font-black text-gray-900">
                  <Users className="text-green-600" size={24} />
                  {event.attendees}
                </div>
                <p className="text-xs md:text-sm text-gray-400">people going</p>
              </div>

              {/* Actions */}
              {event.ticketed ? (
                <>
                  <button
                    onClick={handleBuyTicket}
                    className="w-full py-3 md:py-4 px-4 md:px-6 rounded-xl md:rounded-2xl font-bold text-base md:text-lg bg-green-600 text-white hover:bg-green-700 hover:shadow-green-500/30 shadow-lg transform transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    <Ticket size={18} />
                    {event.ticketPrice > 0
                      ? `Buy Ticket · KES ${event.ticketPrice.toLocaleString()}`
                      : "Get Free Ticket"}
                  </button>

                  <p className="text-xs text-center text-gray-400 mt-3 md:mt-4 px-2 md:px-4">
                    Tickets are required for entry to this event.
                  </p>
                </>
              ) : (
                <>
                  <button
                    onClick={toggle}
                    disabled={busy}
                    className={`w-full py-3 md:py-4 px-4 md:px-6 rounded-xl md:rounded-2xl font-bold text-base md:text-lg shadow-lg transform transition-all active:scale-95
                            ${registered
                        ? "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
                        : "bg-green-600 text-white hover:bg-green-700 hover:shadow-green-500/30"
                      } ${busy ? "opacity-70 cursor-wait" : ""}`}
                  >
                    {busy
                      ? "Updating..."
                      : registered
                        ? "Cancel Registration"
                        : "Register Now"}
                  </button>

                  <p className="text-xs text-center text-gray-400 mt-3 md:mt-4 px-2 md:px-4">
                    {registered
                      ? "You are on the list. We look forward to seeing you!"
                      : "Seats are filling up fast. Secure your spot today."}
                  </p>
                </>
              )}

              <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-gray-100 flex justify-center gap-4">
                {/* Placeholder for social share */}
                <button
                  onClick={shareEvent}
                  className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-green-600 transition-colors"
                >
                  <Share2 size={16} /> Share Event
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Responsive Ticket Dialog */}
      <TicketModal
        isOpen={isTicketModalOpen}
        onClose={() => setIsTicketModalOpen(false)}
        event={event}
      />
    </div>
  );
}

/* Helper for Countdown Blocks */
const TimeBox = ({ value, label }) => (
  <div className="flex flex-col items-center">
    <div className="bg-gray-900 text-white font-mono text-xl sm:text-2xl md:text-3xl font-bold px-2 sm:px-3 py-1.5 md:py-2 rounded-lg shadow-md min-w-[2.5rem] sm:min-w-[3.5rem]">
      {value}
    </div>
    <span className="text-[10px] md:text-xs text-gray-500 font-medium mt-1 uppercase">
      {label}
    </span>
  </div>
);