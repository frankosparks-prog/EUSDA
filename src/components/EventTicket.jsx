import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  CalendarDays,
  MapPin,
  ArrowLeft,
  Tag,
  Clock,
  Ticket,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import TicketForm from "./TicketForm";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

export default function EventTicket() {
  const [event, setEvent] = useState(null);
  const [loadingEvent, setLoadingEvent] = useState(true);

  const { eventId } = useParams();
  const nav = useNavigate();

  useEffect(() => {
    if (!eventId) {
      nav("/events");
      return;
    }

    // Check localStorage cache first
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

  if (loadingEvent) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <CircularProgress color="success" size={60} />
      </div>
    );
  }

  if (!event) return null;

  const formattedDate = event.date
    ? new Date(event.date).toLocaleDateString("en-KE", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  const isFree = !event.ticketPrice || event.ticketPrice === 0;
  const priceLabel = isFree
    ? "Free"
    : `KES ${event.ticketPrice.toLocaleString()}`;

  return (
    <>
      <Helmet>
        <title>Get Tickets | {event.title} | EUSDA</title>
        <meta
          name="description"
          content={`Buy a ticket for ${event.title} at ${event.venue}. ${
            event.description?.slice(0, 100) || ""
          }`}
        />
      </Helmet>

      <div className="min-h-screen bg-gray-50 pb-20 pt-4">
        {/* Back navigation */}
        <div className="max-w-4xl mx-auto px-4 mb-4">
          <button
            onClick={() => nav(`/events/${event._id}`)}
            className="flex items-center gap-2 text-gray-500 hover:text-green-700 transition-colors text-sm font-medium"
          >
            <ArrowLeft size={16} /> Back to Event
          </button>
        </div>

        <div className="max-w-4xl mx-auto px-4 grid lg:grid-cols-5 gap-6">
          {/* Left Column: Event details summary sidebar */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden sticky top-24">
              {event.image && (
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-44 object-cover"
                />
              )}

              <div className="p-6 space-y-4">
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
                      className={`text-lg font-extrabold ${
                        isFree ? "text-green-600" : "text-gray-900"
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

          {/* Right Column: Ticket Form Card */}
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

              {/* Unified Ticket Form component */}
              <TicketForm event={event} isModal={false} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
