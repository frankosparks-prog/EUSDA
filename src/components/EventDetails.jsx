// import React, { useEffect, useState } from "react";
// import Footer from "./Footer";
// import Toast from "./Toast";
// import {
//   CalendarDays,
//   MapPin,
//   Users,
//   TimerReset,
//   Info,
//   ArrowLeft,
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// const EventDetails = () => {
//   const [event, setEvent] = useState(null);
//   const [attendees, setAttendees] = useState(0);
//   const [isRegistered, setIsRegistered] = useState(false);
//   const [toast, setToast] = useState(null);
//   const [timeLeft, setTimeLeft] = useState({
//     days: "00",
//     hours: "00",
//     minutes: "00",
//     seconds: "00",
//   });

//   const navigate = useNavigate();

//   useEffect(() => {
//     const storedEvent = JSON.parse(localStorage.getItem("selectedEvent"));
//     if (storedEvent) setEvent(storedEvent);
//   }, []);

//   useEffect(() => {
//     if (!event) return;
//     const eventDate = new Date(event.date);

//     const timer = setInterval(() => {
//       const now = new Date().getTime();
//       const diff = eventDate.getTime() - now;

//       if (diff <= 0) {
//         clearInterval(timer);
//         setTimeLeft({ days: "00", hours: "00", minutes: "00", seconds: "00" });
//       } else {
//         setTimeLeft({
//           days: String(Math.floor(diff / (1000 * 60 * 60 * 24))).padStart(2, "0"),
//           hours: String(Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, "0"),
//           minutes: String(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, "0"),
//           seconds: String(Math.floor((diff % (1000 * 60)) / 1000)).padStart(2, "0"),
//         });
//       }
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [event]);

//   const handleRegister = () => {
//     const newStatus = !isRegistered;
//     setIsRegistered(newStatus);
//     setAttendees(prev => newStatus ? prev + 1 : Math.max(0, prev - 1));

//     const toastMsg = newStatus
//       ? "You’ve successfully registered!"
//       : "You’ve unregistered.";
//     setToast({ message: toastMsg, type: newStatus ? "success" : "error" });

//     setTimeout(() => setToast(null), 3000);
//   };

//   if (!event) {
//     return <p className="text-center py-20 text-gray-500">Loading event details...</p>;
//   }

//   return (
//     <div className="relative min-h-screen bg-gradient-to-br from-gray-50 to-white pt-36 mt-[-4rem] md:mt-[-2rem]">
//       {toast && <Toast message={toast.message} type={toast.type} />}

//       {/* Back Button */}
//       <div className="fixed top-4 left-4 z-20">
//         <button
//           onClick={ () => navigate("/events")}
//           className="flex items-center gap-1 text-white bg-black/50 hover:bg-black/70 px-3 py-2 rounded-full shadow-md transition md:mt-36 mt-20"
//         >
//           <ArrowLeft className="w-4 h-4" />
//           <span className="hidden sm:inline text-sm">Back to Events</span>
//         </button>
//       </div>

//       {/* Hero Section */}
//       <header
//         className="relative h-80 bg-cover bg-center rounded-b-3xl overflow-hidden shadow-lg"
//         style={{ backgroundImage: `url(${event.image})` }}
//       >
//         <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
//         <div className="relative z-10 flex flex-col justify-center items-center h-full text-white text-center px-4">
//           <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{event.title}</h1>
//           <div className="mt-3 flex flex-col sm:flex-row items-center gap-4 text-sm text-gray-200">
//             {event.date && (
//               <div className="flex items-center gap-1">
//                 <CalendarDays className="w-4 h-4" />
//                 {new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
//               </div>
//             )}
//             <div className="flex items-center gap-1">
//               <MapPin className="w-4 h-4" />
//               {event.venue}
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Stats Section */}
//       <section className="max-w-5xl mx-auto mt-16 px-4 grid grid-cols-1 sm:grid-cols-2 gap-6">
//         <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition duration-300">
//           <h2 className="text-xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
//             <TimerReset className="text-blue-500" />
//             Countdown
//           </h2>
//           <p className="text-3xl font-mono text-blue-700">
//             {timeLeft.days}d : {timeLeft.hours}h : {timeLeft.minutes}m : {timeLeft.seconds}s
//           </p>
//         </div>
//         <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition duration-300">
//           <h2 className="text-xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
//             <Users className="text-green-500" />
//             Attendees
//           </h2>
//           <div className="text-3xl text-green-700 flex items-center gap-2">
//             {attendees}
//           </div>
//         </div>
//       </section>

//       {/* Register Button */}
//       <div className="text-center my-10">
//         <button
//           onClick={handleRegister}
//           className={`px-10 py-4 text-lg font-bold rounded-full shadow-lg hover:scale-105 transition-transform duration-300 ${
//             isRegistered ? "bg-red-500 hover:bg-red-600" : "bg-green-600 hover:bg-green-700"
//           } text-white`}
//         >
//           {isRegistered ? "Unregister" : "Register Now"}
//         </button>
//       </div>

//       {/* Descriptions */}
//       <section className="max-w-4xl mx-auto px-6 sm:px-12 mb-20 text-gray-800 space-y-12">
//         <div>
//           <h2 className="text-3xl font-bold mb-4 flex items-center gap-2">
//             <Info className="text-purple-500" />
//             About the Event
//           </h2>
//           <p className="leading-relaxed text-lg">{event.description}</p>
//         </div>

//         {event.longDescription && (
//           <div>
//             <h2 className="text-2xl font-semibold mb-4">Details</h2>
//             <p className="leading-relaxed text-base whitespace-pre-line">{event.longDescription}</p>
//           </div>
//         )}
//       </section>

//       <Footer />
//     </div>
//   );
// };

// export default EventDetails;
import React, { useEffect, useState } from "react";
import Footer from "./Footer";
import Toast  from "./Toast";
import {
  CalendarDays, MapPin, Users, TimerReset, Info, ArrowLeft
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

export default function EventDetails() {
  const [event,        setEvent]        = useState(null);
  const [registered,   setRegistered]   = useState(false);
  const [toast,        setToast]        = useState(null);
  const [busy,         setBusy]         = useState(false);
  const [timeLeft,     setTimeLeft]     = useState({days:"00",hours:"00",minutes:"00",seconds:"00"});

  const nav = useNavigate();

  /* ─── load event & local RSVP flag ─── */
  useEffect(() => {
    const picked  = JSON.parse(localStorage.getItem("selectedEvent"));
    const saved   = JSON.parse(localStorage.getItem("registeredEvents")) || [];

    if (!picked) return;

    (async () => {
      try {
        const res  = await fetch(`${SERVER_URL}/api/events/${picked._id}`);
        const data = await res.json();
        setEvent(data);
        setRegistered(saved.includes(data._id));
      } catch (err) { console.error(err); }
    })();
  }, []);

  /* ─── countdown ─── */
  useEffect(() => {
    if (!event) return;
    const target = new Date(event.date).getTime();

    const int = setInterval(() => {
      const diff = Math.max(0, target - Date.now());
      const d = Math.floor(diff / (1000*60*60*24));
      const h = Math.floor(diff / (1000*60*60) % 24);
      const m = Math.floor(diff / (1000*60)    % 60);
      const s = Math.floor(diff / 1000          % 60);
      setTimeLeft({
        days    : String(d).padStart(2,"0"),
        hours   : String(h).padStart(2,"0"),
        minutes : String(m).padStart(2,"0"),
        seconds : String(s).padStart(2,"0"),
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
        method : "PATCH",
        headers: { "Content-Type": "application/json" },
        body   : JSON.stringify({ type: action })
      });
      const updated = await res.json();
      if (!res.ok) throw new Error("Server error");

      setEvent(updated);
      setRegistered(!registered);

      /* keep localStorage in-sync */
      const saved = new Set(JSON.parse(localStorage.getItem("registeredEvents")) || []);
      if (action === "register") saved.add(event._id);
      else                       saved.delete(event._id);
      localStorage.setItem("registeredEvents", JSON.stringify([...saved]));

      setToast({
        message: action === "register" ? "You’re registered!" : "You’ve unregistered.",
        type   : action === "register" ? "success" : "error"
      });
    } catch (err) {
      console.error(err);
      setToast({ message: "Something went wrong.", type: "error" });
    } finally {
      setBusy(false);
      setTimeout(() => setToast(null), 3000);
    }
  };

  if (!event) {
    return <div className="flex justify-center items-center py-60"><CircularProgress color="success" size={60} /></div>;
  }

  /* ─── UI ─── */
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-50 to-white pt-36 mt-[-4rem] md:mt-[-2rem]">
      {toast && <Toast {...toast} duration={3000} onClose={() => setToast(null)}/>}

      {/* back */}
      <button
        onClick={() => nav("/events")}
        className="fixed top-24 md:top-40 left-4 flex items-center gap-1 text-white bg-black/50 hover:bg-black/70 px-3 py-2 rounded-full shadow-md z-20"
      >
        <ArrowLeft className="w-4 h-4"/> <span className="hidden sm:inline text-sm">Back to Events</span>
      </button>

      {/* hero */}
      <header className="relative h-80 bg-cover bg-center rounded-b-3xl shadow-lg"
              style={{ backgroundImage:`url(${event.image})`}}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-white text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold">{event.title}</h1>
          <div className="mt-3 flex flex-col sm:flex-row gap-4 text-sm text-gray-200">
            <Meta icon={CalendarDays} label={new Date(event.date).toLocaleDateString()} />
            <Meta icon={MapPin}       label={event.venue}/>
          </div>
        </div>
      </header>

      {/* stats */}
      <section className="max-w-5xl mx-auto mt-16 px-4 grid sm:grid-cols-2 gap-6">
        <Stat icon={TimerReset} color="text-blue-500"  label="Countdown"
              value={`${timeLeft.days}d : ${timeLeft.hours}h : ${timeLeft.minutes}m : ${timeLeft.seconds}s`} />
        <Stat icon={Users}      color="text-green-500" label="Attendees" value={event.attendees}/>
      </section>

      {/* button */}
      <div className="text-center my-10">
        <button
          onClick={toggle}
          disabled={busy}
          className={`px-10 py-4 text-lg font-bold rounded-full shadow-lg transition
            ${registered ? "bg-red-500 hover:bg-red-600" : "bg-green-600 hover:bg-green-700"}
            ${busy && "opacity-40 cursor-not-allowed"} text-white`}
        >
          {registered ? "Unregister" : "Register Now"}
        </button>
      </div>

      {/* description */}
      <section className="max-w-4xl mx-auto px-6 sm:px-12 mb-20 space-y-12 text-gray-800">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-2"><Info className="text-purple-500"/> About</h2>
          <p className="leading-relaxed text-lg">{event.description}</p>
        </div>
        {event.longDescription && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Details</h2>
            <p className="whitespace-pre-line">{event.longDescription}</p>
          </div>
        )}
      </section>

      <Footer/>
    </div>
  );
}

/* helpers */
const Meta = ({ icon:Icon, label }) => (
  <div className="flex items-center gap-1"><Icon className="w-4 h-4"/> {label}</div>
);
const Stat = ({ icon:Icon, color, label, value }) => (
  <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition">
    <h2 className="text-xl font-semibold flex items-center gap-2">
      <Icon className={color}/> {label}
    </h2>
    <div className="text-3xl font-mono mt-1 text-blue-700">{value}</div>
  </div>
);

