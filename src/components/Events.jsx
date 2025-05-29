// import React, { useEffect, useState } from "react";
// import AOS from "aos";
// import "aos/dist/aos.css";
// import { Swiper, SwiperSlide } from "swiper/react";
// import "swiper/css";
// import "swiper/css/pagination";
// import { Pagination } from "swiper/modules";
// import Footer from "./Footer";
// import { CalendarDays, Clock, MapPin, Mic } from "lucide-react";
// import Toast from "./Toast";

// function Events() {
//   useEffect(() => {
//     AOS.init({ duration: 1000 });
//   }, []);

//   const [showToast, setShowToast] = useState(false);

//   const events = [
//     {
//       title: "Youth Conference 2025",
//       date: "July 20, 2025",
//       day: "Saturday",
//       time: "10:00 AM",
//       speaker: "Pastor Grace M.",
//       venue: "Main Auditorium",
//       description: "Empowering the next generation with faith and purpose.",
//       longDescription:
//         "Youth Conference 2025 is a gathering designed to ignite passion, purpose, and faith in the hearts of young people. Through engaging sessions, worship, and mentorship, attendees will be equipped to lead with courage and clarity in today’s world.",
//       image: "https://picsum.photos/400/250?random=3",
//     },
//     {
//       title: "Family Fun Day",
//       date: "August 10, 2025",
//       day: "Sunday",
//       time: "12:00 PM",
//       speaker: "Pastor John D.",
//       venue: "Church Grounds",
//       description: "Games, laughter, worship, and community for all ages!",
//       longDescription:
//         "Bring your whole family for a day of joyful connection and fellowship. Enjoy games, food, live music, and a time of worship in a relaxed and welcoming atmosphere. It’s a perfect opportunity to bond with your loved ones and meet others in the community.",
//       image: "https://picsum.photos/400/250?random=7",
//     },
//     {
//       title: "Praise & Worship Night",
//       date: "September 5, 2025",
//       day: "Friday",
//       time: "6:30 PM",
//       speaker: "Worship Team",
//       venue: "Sanctuary Hall",
//       description: "Experience an unforgettable night of praise and worship.",
//       longDescription:
//         "Immerse yourself in a spirit-filled evening of praise and worship led by our anointed worship team. This night is about connecting deeply with God through music, prayer, and heartfelt expressions of faith.",
//       image: "https://picsum.photos/400/250?random=5",
//     },
//     {
//       title: "Community Outreach",
//       date: "October 12, 2025",
//       day: "Saturday",
//       time: "9:00 AM",
//       speaker: "Outreach Team",
//       venue: "Community Center",
//       description:
//         "Join us in giving back and spreading love to those in need.",
//       longDescription:
//         "Join our mission to serve and uplift the local community through acts of kindness and generosity. Whether through distributing essentials, offering support, or simply sharing a smile, your presence makes a difference.",
//       image: "https://picsum.photos/400/250?random=4",
//     },
//   ];

//   const handleLearnMore = (event) => {
//     localStorage.setItem("selectedEvent", JSON.stringify(event));
//     window.location.href = "/events/event-details";
//   };

//   return (
//     <>
//       <div className="min-h-screen bg-gray-50 py-20 px-6 mt-20 mb-[-2rem] md:mb-[-2rem] relative">
//         <h2
//           className="text-4xl font-bold text-center text-green-800 mb-12"
//           data-aos="fade-down"
//         >
//           Upcoming Events
//         </h2>

//         {/* Toast popup */}
//         {showToast && (
//           <Toast
//             message="Registered successfully!"
//             duration={3000}
//             onClose={() => setShowToast(false)}
//           />
//         )}

//         <Swiper
//           slidesPerView={1}
//           spaceBetween={30}
//           pagination={{ clickable: true }}
//           modules={[Pagination]}
//           className="max-w-4xl mx-auto"
//         >
//           {events.map((event, index) => (
//             <SwiperSlide key={index}>
//               <div
//                 className="bg-white p-6 rounded-3xl shadow-xl text-center relative mb-20"
//                 data-aos="zoom-in"
//               >
//                 <img
//                   src={event.image}
//                   alt={event.title}
//                   className="w-full h-60 object-cover rounded-2xl mb-6"
//                 />
//                 <h3 className="text-2xl font-bold text-green-700 mb-2">
//                   {event.title}
//                 </h3>
//                 <p className="text-gray-600 mb-4">{event.description}</p>

//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left text-sm text-gray-700 mb-6">
//                   <div className="flex items-center gap-2">
//                     <CalendarDays className="text-green-600 w-5 h-5" />
//                     <span>
//                       {event.date} ({event.day})
//                     </span>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <Clock className="text-green-600 w-5 h-5" />
//                     <span>{event.time}</span>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <MapPin className="text-green-600 w-5 h-5" />
//                     <span>{event.venue}</span>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <Mic className="text-green-600 w-5 h-5" />
//                     <span>{event.speaker}</span>
//                   </div>
//                 </div>

//                 <div className="flex justify-center gap-4">
//                   <button
//                     onClick={() => {
//                       setShowToast(true);
//                       setTimeout(() => setShowToast(false), 3000);
//                     }}
//                     className="bg-green-600 text-white px-5 py-2 rounded-xl shadow hover:bg-green-700 transition duration-300"
//                   >
//                     RSVP Now
//                   </button>

//                   <button
//                     onClick={() => handleLearnMore(event)}
//                     className="border border-green-600 text-green-700 px-5 py-2 rounded-xl hover:bg-green-100 transition duration-300"
//                   >
//                     Learn More
//                   </button>
//                 </div>
//               </div>
//             </SwiperSlide>
//           ))}
//         </Swiper>
//         <p className="text-center text-gray-600 mt-6">
//           Click on the "RSVP Now" button to register for the event and stay
//           updated with all the exciting details. Be sure to mark your calendar!
//           And click "Learn More" to dive deeper into the event details.
//         </p>
//       </div>

//       <Footer />
//     </>
//   );
// }

// export default Events;
import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import { CalendarDays, Clock, MapPin, Mic } from "lucide-react";
import Footer      from "./Footer";
import Toast       from "./Toast";
import CircularProgress from "@mui/material/CircularProgress";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;   // e.g. http://localhost:3002

export default function Events() {
  const [events,  setEvents]        = useState([]);
  const [toast,   setToast]         = useState(null);  // {message,type}
  const [loading, setLoading]       = useState(true);
  const [busyId,  setBusyId]        = useState(null);  // id that’s currently PATCHing

  /* ─── boot ─── */
  useEffect(() => {
    AOS.init({ duration: 1000 });

    (async () => {
      try {
        const res  = await fetch(`${SERVER_URL}/api/events`);
        const data = await res.json();

        // merge any saved RSVP status
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
    if (busyId) return;                 // 1. hard-block spam-clicks
    setBusyId(id);

    const action = currentlyRegistered ? "unregister" : "register";

    try {
      const res = await fetch(`${SERVER_URL}/api/events/${id}/rsvp`, {
        method : "PATCH",
        headers: { "Content-Type": "application/json" },
        body   : JSON.stringify({ type: action })
      });
      const serverDoc = await res.json();
      if (!res.ok) throw new Error(serverDoc?.message || "RSVP failed");

      /* 2️⃣ reflect in React state */
      setEvents(prev =>
        prev.map(ev => ev._id === id
          ? { ...ev, isRegistered: !currentlyRegistered, attendees: serverDoc.attendees }
          : ev));

      /* 3️⃣ persist in localStorage */
      const saved = new Set(JSON.parse(localStorage.getItem("registeredEvents")) || []);
      if (action === "register")   saved.add(id);
      else                         saved.delete(id);
      localStorage.setItem("registeredEvents", JSON.stringify([...saved]));

      /* 4️⃣ toast */
      setToast({
        message: action === "register" ? "🎉 You’re on the list!" : "You’re no longer registered.",
        type   : action === "register" ? "success" : "error"
      });
    } catch (err) {
      console.error(err);
      setToast({ message: err.message, type: "error" });
    } finally {
      setBusyId(null);
      setTimeout(() => setToast(null), 3_000);
    }
  };

  /* ─── go Details ─── */
  const openDetails = evObj => {
    localStorage.setItem("selectedEvent", JSON.stringify(evObj));  // always latest copy
    window.location.href = "/events/event-details";
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
      {toast && (
        <Toast
          {...toast}
          duration={3000}
          onClose={() => setToast(null)}
        />
      )}

      <div className="min-h-screen bg-gray-50 py-20 px-6 mt-20 mb-[-2rem]">
        <h2 className="text-4xl font-bold text-center text-green-800 mb-12" data-aos="fade-down">
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
                <div className="bg-white p-6 rounded-3xl shadow-xl text-center mb-20" data-aos="zoom-in">
                  <img src={ev.image} alt={ev.title} className="w-full h-60 object-cover rounded-2xl mb-6"/>

                  <h3 className="text-2xl font-bold text-green-700 mb-2">{ev.title}</h3>
                  <p className="text-gray-600 mb-4">{ev.description}</p>

                  {/* meta */}
                  <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-700 mb-6">
                    <Meta icon={CalendarDays} label={`${ev.date} (${ev.day})`} />
                    <Meta icon={Clock}        label={ev.time} />
                    <Meta icon={MapPin}       label={ev.venue} />
                    <Meta icon={Mic}          label={ev.speaker} />
                  </div>

                  {/* actions */}
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={() => toggleRSVP(ev._id, ev.isRegistered)}
                      disabled={busyId === ev._id}
                      className={`px-5 py-2 rounded-xl text-white shadow transition
                        ${ev.isRegistered ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
                        ${busyId === ev._id ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      {ev.isRegistered ? "Unregister" : "RSVP Now"}
                    </button>

                    <button
                      onClick={() => openDetails(ev)}
                      className="border border-green-600 text-green-700 px-5 py-2 rounded-xl hover:bg-green-100 transition"
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

      <Footer />
    </>
  );
}

/* small helper */
const Meta = ({ icon: Icon, label }) => (
  <div className="flex items-center gap-2">
    <Icon className="text-green-600 w-5 h-5" /> <span>{label}</span>
  </div>
);
