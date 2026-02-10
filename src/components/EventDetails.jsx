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
  Clock,
  Share2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";

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

  const nav = useNavigate();

  /* ─── load event & local RSVP flag ─── */
  useEffect(() => {
    const picked = JSON.parse(localStorage.getItem("selectedEvent"));
    const saved = JSON.parse(localStorage.getItem("registeredEvents")) || [];

    // Logic maintenance: If no event in LS, redirect back
    if (!picked) {
      nav("/events");
      return;
    }

    (async () => {
      try {
        const res = await fetch(`${SERVER_URL}/api/events/${picked._id}`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setEvent(data);
        setRegistered(saved.includes(data._id));
      } catch (err) {
        console.error(err);
        setToast({ message: "Could not refresh event data.", type: "error" });
        setEvent(picked); // Fallback to LS data
      }
    })();
  }, [nav]);

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
          action === "register" ? "You’re registered!" : "You’ve unregistered.",
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
    <div className="min-h-screen bg-gray-50 pb-20 overflow-x-hidden mt-[-8rem] md:mt-[-4rem]">
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
      <div className="relative h-[50vh] min-h-[400px] w-full overflow-hidden">
        {/* Blurred Background */}
        <div
          className="absolute inset-0 bg-cover bg-center blur-sm scale-110 opacity-50"
          style={{ backgroundImage: `url(${event.image})` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent"></div>

        {/* Navigation Bar */}
        <div className="absolute top-24 left-0 right-0 px-6 z-20 flex justify-between items-start max-w-7xl mx-auto">
          <button
            onClick={() => nav("/events")}
            className="flex items-center gap-2 text-white/90 hover:text-white bg-black/30 hover:bg-black/50 backdrop-blur-md px-4 py-2 rounded-full transition-all"
          >
            <ArrowLeft size={18} /> Back
          </button>
        </div>

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 p-8 pb-12 z-10">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end gap-6">
              {/* Main Event Image (Thumbnail) */}
              <img
                src={event.image}
                alt={event.title}
                className="w-32 h-32 md:w-48 md:h-48 object-cover rounded-2xl border-4 border-white shadow-2xl hidden md:block"
              />

              <div className="flex-1 text-white">
                <div className="flex flex-wrap gap-4 text-sm font-medium text-green-300 mb-2">
                  <span className="flex items-center gap-1 bg-green-900/40 px-3 py-1 rounded-full backdrop-blur-md border border-green-500/30">
                    <CalendarDays size={14} />{" "}
                    {new Date(event.date).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1 bg-green-900/40 px-3 py-1 rounded-full backdrop-blur-md border border-green-500/30">
                    <MapPin size={14} /> {event.venue}
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-2">
                  {event.title}
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-8 relative z-20">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Col: Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Countdown Timer */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3 text-gray-700">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-full">
                  <Timer size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Event Starts In</h3>
                  <p className="text-sm text-gray-500">Don't be late!</p>
                </div>
              </div>

              <div className="flex gap-3 text-center">
                <TimeBox value={timeLeft.days} label="Days" />
                <span className="text-2xl font-bold text-gray-300 mt-2">:</span>
                <TimeBox value={timeLeft.hours} label="Hrs" />
                <span className="text-2xl font-bold text-gray-300 mt-2">:</span>
                <TimeBox value={timeLeft.minutes} label="Mins" />
                <span className="text-2xl font-bold text-gray-300 mt-2">:</span>
                <TimeBox value={timeLeft.seconds} label="Secs" />
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-3xl shadow-sm p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2 mb-6">
                <Info className="text-green-600" /> About the Event
              </h2>
              <div className="prose prose-green max-w-none text-gray-600 leading-relaxed">
                <p className="text-lg">{event.description}</p>
                {event.longDescription && (
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <p className="whitespace-pre-line">
                      {event.longDescription}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Col: Sidebar Action */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100 sticky top-24">
              <div className="text-center mb-6">
                <p className="text-sm text-gray-500 uppercase font-bold tracking-wider mb-1">
                  Attendance
                </p>
                <div className="flex items-center justify-center gap-2 text-3xl font-black text-gray-900">
                  <Users className="text-green-600" />
                  {event.attendees}
                </div>
                <p className="text-sm text-gray-400">people going</p>
              </div>

              <button
                onClick={toggle}
                disabled={busy}
                className={`w-full py-4 px-6 rounded-2xl font-bold text-lg shadow-lg transform transition-all active:scale-95
                        ${
                          registered
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

              <p className="text-xs text-center text-gray-400 mt-4 px-4">
                {registered
                  ? "You are on the list. We look forward to seeing you!"
                  : "Seats are filling up fast. Secure your spot today."}
              </p>

              <div className="mt-6 pt-6 border-t border-gray-100 flex justify-center gap-4">
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
    </div>
  );
}

/* Helper for Countdown Blocks */
const TimeBox = ({ value, label }) => (
  <div className="flex flex-col items-center">
    <div className="bg-gray-900 text-white font-mono text-2xl md:text-3xl font-bold px-3 py-2 rounded-lg shadow-md min-w-[3.5rem]">
      {value}
    </div>
    <span className="text-xs text-gray-500 font-medium mt-1 uppercase">
      {label}
    </span>
  </div>
);
