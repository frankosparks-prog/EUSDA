import React, { useEffect, useState } from "react";
import Footer from "./Footer";
import Toast from "./Toast";
import {
  CalendarDays,
  MapPin,
  Users,
  TimerReset,
  Info,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const EventDetails = () => {
  const [event, setEvent] = useState(null);
  const [attendees, setAttendees] = useState(0);
  const [isRegistered, setIsRegistered] = useState(false);
  const [toast, setToast] = useState(null);
  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const storedEvent = JSON.parse(localStorage.getItem("selectedEvent"));
    if (storedEvent) setEvent(storedEvent);
  }, []);

  useEffect(() => {
    if (!event) return;
    const eventDate = new Date(event.date);

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const diff = eventDate.getTime() - now;

      if (diff <= 0) {
        clearInterval(timer);
        setTimeLeft({ days: "00", hours: "00", minutes: "00", seconds: "00" });
      } else {
        setTimeLeft({
          days: String(Math.floor(diff / (1000 * 60 * 60 * 24))).padStart(2, "0"),
          hours: String(Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, "0"),
          minutes: String(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, "0"),
          seconds: String(Math.floor((diff % (1000 * 60)) / 1000)).padStart(2, "0"),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [event]);

  const handleRegister = () => {
    const newStatus = !isRegistered;
    setIsRegistered(newStatus);
    setAttendees(prev => newStatus ? prev + 1 : Math.max(0, prev - 1));

    const toastMsg = newStatus
      ? "You’ve successfully registered!"
      : "You’ve unregistered.";
    setToast({ message: toastMsg, type: newStatus ? "success" : "error" });

    setTimeout(() => setToast(null), 3000);
  };

  if (!event) {
    return <p className="text-center py-20 text-gray-500">Loading event details...</p>;
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-50 to-white pt-36 mt-[-4rem] md:mt-[-2rem]">
      {toast && <Toast message={toast.message} type={toast.type} />}

      {/* Back Button */}
      <div className="fixed top-4 left-4 z-20">
        <button
          onClick={ () => navigate("/events")}
          className="flex items-center gap-1 text-white bg-black/50 hover:bg-black/70 px-3 py-2 rounded-full shadow-md transition md:mt-36 mt-20"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline text-sm">Back to Events</span>
        </button>
      </div>

      {/* Hero Section */}
      <header
        className="relative h-80 bg-cover bg-center rounded-b-3xl overflow-hidden shadow-lg"
        style={{ backgroundImage: `url(${event.image})` }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
        <div className="relative z-10 flex flex-col justify-center items-center h-full text-white text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{event.title}</h1>
          <div className="mt-3 flex flex-col sm:flex-row items-center gap-4 text-sm text-gray-200">
            {event.date && (
              <div className="flex items-center gap-1">
                <CalendarDays className="w-4 h-4" />
                {new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
              </div>
            )}
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {event.venue}
            </div>
          </div>
        </div>
      </header>

      {/* Stats Section */}
      <section className="max-w-5xl mx-auto mt-16 px-4 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition duration-300">
          <h2 className="text-xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
            <TimerReset className="text-blue-500" />
            Countdown
          </h2>
          <p className="text-3xl font-mono text-blue-700">
            {timeLeft.days}d : {timeLeft.hours}h : {timeLeft.minutes}m : {timeLeft.seconds}s
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition duration-300">
          <h2 className="text-xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
            <Users className="text-green-500" />
            Attendees
          </h2>
          <div className="text-3xl text-green-700 flex items-center gap-2">
            {attendees}
          </div>
        </div>
      </section>

      {/* Register Button */}
      <div className="text-center my-10">
        <button
          onClick={handleRegister}
          className={`px-10 py-4 text-lg font-bold rounded-full shadow-lg hover:scale-105 transition-transform duration-300 ${
            isRegistered ? "bg-red-500 hover:bg-red-600" : "bg-green-600 hover:bg-green-700"
          } text-white`}
        >
          {isRegistered ? "Unregister" : "Register Now"}
        </button>
      </div>

      {/* Descriptions */}
      <section className="max-w-4xl mx-auto px-6 sm:px-12 mb-20 text-gray-800 space-y-12">
        <div>
          <h2 className="text-3xl font-bold mb-4 flex items-center gap-2">
            <Info className="text-purple-500" />
            About the Event
          </h2>
          <p className="leading-relaxed text-lg">{event.description}</p>
        </div>

        {event.longDescription && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Details</h2>
            <p className="leading-relaxed text-base whitespace-pre-line">{event.longDescription}</p>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default EventDetails;
