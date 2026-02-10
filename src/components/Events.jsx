import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom"; // ✅ Use hook for navigation
import AOS from "aos";
import "aos/dist/aos.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules"; // Added Autoplay
import { CalendarDays, Clock, MapPin, Mic, ArrowRight, CheckCircle2 } from "lucide-react";
import Toast from "./Toast";
import CircularProgress from "@mui/material/CircularProgress";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

export default function Events() {
  const [events, setEvents] = useState([]);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  
  const navigate = useNavigate(); // ✅ Hook for SPA navigation

  /* ─── boot ─── */
  useEffect(() => {
    AOS.init({ duration: 800, easing: "ease-out-cubic" });

    (async () => {
      try {
        const res = await fetch(`${SERVER_URL}/api/events`);
        const data = await res.json();

        const saved = JSON.parse(localStorage.getItem("registeredEvents")) || [];
        // Sort events by date (nearest first) if needed, or keep API order
        const prepared = data.map(ev => ({ ...ev, isRegistered: saved.includes(ev._id) }));
        setEvents(prepared);
      } catch (err) {
        console.error(err);
        setToast({ message: "Could not load events.", type: "error" });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ─── RSVP ─── */
  const toggleRSVP = async (id, currentlyRegistered) => {
    if (busyId) return;
    setBusyId(id);

    const action = currentlyRegistered ? "unregister" : "register";

    try {
      const res = await fetch(`${SERVER_URL}/api/events/${id}/rsvp`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: action })
      });
      const serverDoc = await res.json();
      if (!res.ok) throw new Error(serverDoc?.message || "RSVP failed");

      setEvents(prev =>
        prev.map(ev => ev._id === id
          ? { ...ev, isRegistered: !currentlyRegistered, attendees: serverDoc.attendees }
          : ev)
      );

      const saved = new Set(JSON.parse(localStorage.getItem("registeredEvents")) || []);
      if (action === "register") saved.add(id);
      else saved.delete(id);
      localStorage.setItem("registeredEvents", JSON.stringify([...saved]));

      setToast({
        message: action === "register" ? "🎉 You’re on the list!" : "You’re no longer registered.",
        type: action === "register" ? "success" : "neutral"
      });
    } catch (err) {
      console.error(err);
      setToast({ message: err.message, type: "error" });
    } finally {
      setBusyId(null);
      setTimeout(() => setToast(null), 3000);
    }
  };

  /* ─── go Details ─── */
  const openDetails = evObj => {
    // Logic maintained: Save to LS then navigate
    localStorage.setItem("selectedEvent", JSON.stringify(evObj));
    navigate("/events/event-details"); // ✅ SPA Navigation
  };

  /* ─── structured data (Event list) ─── */
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: events.map((ev, idx) => ({
      "@type": "Event",
      position: idx + 1,
      name: ev.title,
      description: ev.description,
      startDate: ev.date,
      location: {
        "@type": "Place",
        name: ev.venue,
        address: ev.venue
      },
      image: [ev.image],
      organizer: {
        "@type": "Organization",
        name: "EUSDA",
        url: "https://eusda.co.ke"
      }
    }))
  };

  /* ─── render ─── */
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="text-center">
           <CircularProgress color="success" size={50} thickness={4} />
           <p className="mt-4 text-gray-500 font-medium animate-pulse">Loading Events...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Upcoming Events | EUSDA</title>
        <meta name="description" content="Discover upcoming EUSDA events. View dates, venues, speakers, and RSVP to attend." />
        <link rel="canonical" href="https://eusda.co.ke/events" />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      {toast && (
        <Toast {...toast} duration={3000} onClose={() => setToast(null)} />
      )}

      {/* Main Container - Fixed Padding */}
      <div className="min-h-screen bg-gray-50 pt-24 pb-20 px-4 md:px-6 mt-[-8rem] md:mt-[-4rem]">
        
        <div className="text-center mb-12" data-aos="fade-down">
          <span className="text-green-600 font-semibold tracking-wider uppercase text-sm">Join the Fellowship</span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mt-2">
            Upcoming <span className="text-green-700">Events</span>
          </h2>
          <p className="text-gray-600 mt-3 max-w-xl mx-auto">
            Don't miss out on what's happening. RSVP to secure your spot and join us in worship and learning.
          </p>
        </div>

        {events.length ? (
          <div className="max-w-5xl mx-auto">
            <Swiper
              slidesPerView={1}
              spaceBetween={40}
              pagination={{ clickable: true, dynamicBullets: true }}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              modules={[Pagination, Autoplay]}
              className="pb-12 px-4"
            >
              {events.map(ev => (
                <SwiperSlide key={ev._id} className="pb-10">
                  <div
                    className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 flex flex-col md:flex-row group transition-all duration-300 hover:shadow-2xl"
                    data-aos="zoom-in"
                  >
                    {/* Image Section */}
                    <div className="md:w-1/2 relative overflow-hidden h-64 md:h-auto">
                      <div className="absolute inset-0 bg-green-900/10 group-hover:bg-transparent transition-colors z-10"></div>
                      <img
                        src={ev.image}
                        alt={`${ev.title} event poster`}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                      />
                      {/* Date Badge */}
                      <div className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg text-center border border-gray-100">
                        <span className="block text-xs font-bold text-gray-500 uppercase">{new Date(ev.date).toLocaleString('default', { month: 'short' })}</span>
                        <span className="block text-2xl font-black text-green-700">{new Date(ev.date).getDate()}</span>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="md:w-1/2 p-8 flex flex-col justify-center">
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 leading-tight">
                        {ev.title}
                      </h3>
                      
                      <p className="text-gray-600 mb-6 line-clamp-2 leading-relaxed">
                        {ev.description}
                      </p>

                      {/* Meta Grid */}
                      <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm text-gray-700 mb-8 bg-gray-50 p-4 rounded-2xl">
                        <Meta icon={CalendarDays} label={ev.day || new Date(ev.date).toLocaleDateString('en-US', { weekday: 'long' })} />
                        <Meta icon={Clock} label={ev.time} />
                        <Meta icon={MapPin} label={ev.venue} />
                        <Meta icon={Mic} label={ev.speaker} />
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col sm:flex-row gap-3 mt-auto">
                        <button
                          onClick={() => toggleRSVP(ev._id, ev.isRegistered)}
                          disabled={busyId === ev._id}
                          className={`flex-1 py-3 px-6 rounded-xl font-bold shadow-md transition-all flex items-center justify-center gap-2
                            ${ev.isRegistered 
                              ? "bg-white text-green-700 border-2 border-green-600 hover:bg-green-50" 
                              : "bg-green-700 text-white hover:bg-green-800 border-2 border-transparent hover:-translate-y-0.5"
                            }
                            ${busyId === ev._id ? "opacity-50 cursor-wait" : ""}`}
                        >
                          {ev.isRegistered ? (
                            <><CheckCircle2 size={18} /> Registered</>
                          ) : (
                            "RSVP Now"
                          )}
                        </button>

                        <button
                          onClick={() => openDetails(ev)}
                          className="flex-1 py-3 px-6 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 group/btn"
                        >
                          Details <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-dashed border-gray-300 max-w-2xl mx-auto">
            <CalendarDays size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800">No events scheduled</h3>
            <p className="text-gray-500 mt-2">Check back later for upcoming programs.</p>
          </div>
        )}
      </div>
    </>
  );
}

/* Helper Component */
const Meta = ({ icon: Icon, label }) => (
  <div className="flex items-center gap-2.5">
    <div className="w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center shadow-sm shrink-0">
       <Icon className="text-green-600 w-4 h-4" />
    </div>
    <span className="truncate font-medium">{label}</span>
  </div>
);