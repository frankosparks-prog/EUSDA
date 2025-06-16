import React, { useEffect, useState } from "react";
import {
  Pencil,
  Trash2,
  CalendarDays,
  MapPin,
  ImageIcon,
  Users,
  Clock4,
  User,
  FileText,
} from "lucide-react";
import Toast from "../Toast";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const ManageEvents = () => {
  const [events, setEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [form, setForm] = useState({
    title: "",
    date: "",
    day: "",
    time: "",
    speaker: "",
    venue: "",
    description: "",
    longDescription: "",
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (image) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(image);
    } else {
      setPreview(null);
    }
  }, [image]);

  const fetchEvents = async () => {
    try {
      const res = await fetch(`${SERVER_URL}/api/events`);
      const data = await res.json();
      setEvents(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.keys(form).forEach((key) => formData.append(key, form[key]));
    if (image) formData.append("image", image);

    try {
      const res = await fetch(
        `${SERVER_URL}/api/events${editingId ? `/${editingId}` : ""}`,
        {
          method: editingId ? "PUT" : "POST",
          body: formData,
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save event");

      setToast({
        message: editingId ? "Event updated" : "Event added",
        type: "success",
      });

      setForm({
        title: "",
        date: "",
        day: "",
        time: "",
        speaker: "",
        venue: "",
        description: "",
        longDescription: "",
      });
      setImage(null);
      setPreview(null);
      setEditingId(null);
      fetchEvents();
    } catch (err) {
      console.error(err);
      setToast({ message: err.message, type: "error" });
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${SERVER_URL}/api/events/${id}`, { method: "DELETE" });
      setToast({ message: "Event deleted", type: "success" });
      fetchEvents();
    } catch (err) {
      console.error(err);
      setToast({ message: "Error deleting event", type: "error" });
    }
  };

  const handleEdit = (event) => {
    setForm({
      title: event.title,
      date: event.date.split("T")[0],
      day: event.day || "",
      time: event.time || "",
      speaker: event.speaker || "",
      venue: event.venue,
      description: event.description,
      longDescription: event.longDescription || "",
    });
    setEditingId(event._id);
    if (event.image) setPreview(`${SERVER_URL}/uploads/${event.image}`);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentEvents = events.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(events.length / itemsPerPage);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <h2 className="text-3xl text-green-800 font-bold mb-6">Manage Events</h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-gradient-to-br from-green-100 to-white p-6 rounded-xl shadow-lg"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="input border-green-500 p-2 rounded border"
            required
          />
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="input border-green-500 p-2 rounded border"
            required
          />
          <input
            type="text"
            placeholder="Day"
            value={form.day}
            onChange={(e) => setForm({ ...form, day: e.target.value })}
            className="input border-green-500 p-2 rounded border"
          />
          <input
            type="text"
            placeholder="Time"
            value={form.time}
            onChange={(e) => setForm({ ...form, time: e.target.value })}
            className="input border-green-500 p-2 rounded border"
          />
          <input
            type="text"
            placeholder="Speaker"
            value={form.speaker}
            onChange={(e) => setForm({ ...form, speaker: e.target.value })}
            className="input border-green-500 p-2 rounded border"
          />
          <input
            type="text"
            placeholder="Venue"
            value={form.venue}
            onChange={(e) => setForm({ ...form, venue: e.target.value })}
            className="input border-green-500 p-2 rounded border"
            required
          />
          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            className="input border-green-500 p-2 rounded border"
            accept="image/*"
          />
          <textarea
            placeholder="Short Description"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            className="input md:col-span-2 border-green-500 border"
            required
          />
          <textarea
            placeholder="Long Description"
            value={form.longDescription}
            onChange={(e) =>
              setForm({ ...form, longDescription: e.target.value })
            }
            className="input md:col-span-2 border-green-500 border"
          />
        </div>

        {preview && (
          <div className="mt-2">
            <img
              src={preview}
              alt="Preview"
              className="w-40 h-28 object-cover rounded-lg border border-green-400"
            />
          </div>
        )}

        <button
          type="submit"
          className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold"
        >
          {editingId ? "Update Event" : "Add Event"}
        </button>
      </form>

      <div className="mt-10 space-y-6">
        {currentEvents.map((event) => (
          <div
            key={event._id}
            className="bg-white border-l-4 border-green-500 p-4 rounded-xl shadow hover:shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-4 w-full">
              {event.image && (
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-28 h-20 object-cover rounded-lg border"
                />
              )}
              <div className="flex-1">
                <h3 className="font-bold text-xl text-green-800">
                  {event.title}
                </h3>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <CalendarDays size={16} />{" "}
                  {new Date(event.date).toLocaleDateString()} ({event.day})
                </p>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <Clock4 size={16} /> {event.time}
                </p>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <User size={16} /> {event.speaker}
                </p>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <MapPin size={16} /> {event.venue}
                </p>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <Users size={16} /> {event.attendees} Registered
                </p>
                <p className="text-gray-700 mt-2 text-sm">
                  {event.description}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(event)}
                className="text-blue-600 hover:text-blue-800"
              >
                <Pencil size={18} />
              </button>
              <button
                onClick={() => {
                  if (
                    window.confirm("Are you sure you want to delete this event?")
                  ) {
                    handleDelete(event._id);
                  }
                }}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-center gap-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
          <button
            key={num}
            onClick={() => setCurrentPage(num)}
            className={`px-3 py-1 border rounded ${
              currentPage === num
                ? "bg-green-600 text-white"
                : "bg-white hover:bg-green-100"
            }`}
          >
            {num}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ManageEvents;
