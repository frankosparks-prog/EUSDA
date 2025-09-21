import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";   // ✅ for SEO
import AOS from "aos";
import "aos/dist/aos.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import { CalendarDays, Clock, MapPin, Mic } from "lucide-react";
import Toast from "./Toast";
import CircularProgress from "@mui/material/CircularProgress";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

export default function Events() {
  const [events, setEvents] = useState([]);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  /* ─── boot ─── */
  useEffect(() => {
    AOS.init({ duration: 1000 });

    (async () => {
      try {
        const res = await fetch(`${SERVER_URL}/api/events`);
        const data = await res.json();

        const saved = JSON.parse(localStorage.getItem("registeredEvents")) || [];
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
        type: action === "register" ? "success" : "error"
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
    localStorage.setItem("selectedEvent", JSON.stringify(evObj));
    window.location.href = "/events/event-details";
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
      <div className="flex justify-center items-center py-60">
        <CircularProgress color="success" size={60} />
      </div>
    );
  }

  return (
    <>
      {/* ✅ SEO tags */}
      <Helmet>
        <title>Upcoming Events | EUSDA</title>
        <meta name="description" content="Discover upcoming EUSDA events. View dates, venues, speakers, and RSVP to attend." />
        <meta name="keywords" content="EUSDA, events, university, workshops, conferences, seminars" />
        <link rel="canonical" href="https://eusda.co.ke/events" />

        {/* Open Graph */}
        <meta property="og:title" content="Upcoming Events | EUSDA" />
        <meta property="og:description" content="Stay updated with upcoming EUSDA events and RSVP today." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://eusda.co.ke/events" />
        {events[0]?.image && <meta property="og:image" content={events[0].image} />}

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Upcoming Events | EUSDA" />
        <meta name="twitter:description" content="Stay updated with upcoming EUSDA events and RSVP today." />
        {events[0]?.image && <meta name="twitter:image" content={events[0].image} />}

        {/* JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      {toast && (
        <Toast {...toast} duration={3000} onClose={() => setToast(null)} />
      )}

      <div className="min-h-screen bg-gray-50 py-20 px-6 md:mt-20 mt-8 mb-[-2rem]">
        <h2
          className="text-4xl font-bold text-center text-green-800 mb-12"
          data-aos="fade-down"
        >
          Upcoming Events
        </h2>

        {events.length ? (
          <Swiper
            slidesPerView={1}
            spaceBetween={30}
            pagination={{ clickable: true }}
            modules={[Pagination]}
            className="max-w-4xl mx-auto"
          >
            {events.map(ev => (
              <SwiperSlide key={ev._id}>
                <div
                  className="bg-white p-6 rounded-3xl shadow-xl text-center mb-20"
                  data-aos="zoom-in"
                >
                  <img
                    src={ev.image}
                    alt={`${ev.title} event poster`}
                    className="w-full h-60 object-cover rounded-2xl mb-6"
                  />

                  <h3 className="text-2xl font-bold text-green-700 mb-2">{ev.title}</h3>
                  <p className="text-gray-600 mb-4">{ev.description}</p>

                  {/* meta */}
                  <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-700 mb-6">
                    <Meta icon={CalendarDays} label={`${new Date(ev.date).toLocaleDateString()} (${ev.day})`} />
                    <Meta icon={Clock} label={ev.time} />
                    <Meta icon={MapPin} label={ev.venue} />
                    <Meta icon={Mic} label={ev.speaker} />
                  </div>

                  {/* actions */}
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={() => toggleRSVP(ev._id, ev.isRegistered)}
                      disabled={busyId === ev._id}
                      className={`px-5 py-2 rounded-xl text-white shadow transition
                        ${ev.isRegistered ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
                        ${busyId === ev._id ? "opacity-50 cursor-not-allowed" : ""}`}
                      aria-label={ev.isRegistered ? "Unregister from event" : "RSVP to event"}
                    >
                      {ev.isRegistered ? "Unregister" : "RSVP Now"}
                    </button>

                    <button
                      onClick={() => openDetails(ev)}
                      className="border border-green-600 text-green-700 px-5 py-2 rounded-xl hover:bg-green-100 transition"
                      aria-label={`Learn more about ${ev.title}`}
                    >
                      Learn More
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <p className="text-center text-gray-500">No upcoming events found.</p>
        )}

        <p className="text-center text-gray-600 mt-6">
          Click “RSVP Now” to join or leave an event. Then hit “Learn More” for full details.
        </p>
      </div>
    </>
  );
}

/* helper */
const Meta = ({ icon: Icon, label }) => (
  <div className="flex items-center gap-2">
    <Icon className="text-green-600 w-5 h-5" aria-hidden="true" /> <span>{label}</span>
  </div>
);
