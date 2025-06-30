import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

const socket = io(process.env.REACT_APP_SERVER_URL);

const LiveContributions = () => {
  const [total, setTotal] = useState(0);
  const [goal, setGoal] = useState(50000);
  const [log, setLog] = useState([]);
  const [title, setTitle] = useState("Live Contribution Tracker");
  const [editingTitle, setEditingTitle] = useState(false);

  const containerRef = useRef(null);

  const resetContributions = () => {
    const confirmReset = window.confirm("Are you sure you want to reset the counter?");
    if (confirmReset) {
      socket.emit("reset-total");
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    socket.on("initial-total", (initial) => {
      setTotal(initial || 0);
    });

    socket.on("new-contribution", ({ amount, purpose }) => {
      setTotal((prev) => prev + amount);
      setLog((prev) => [
        { timestamp: new Date().toLocaleTimeString(), amount, purpose },
        ...prev,
      ]);
    });

    socket.on("reset-done", () => {
      setTotal(0);
      setLog([]);
    });

    return () => {
      socket.off("new-contribution");
      socket.off("reset-done");
      socket.off("initial-total");
    };
  }, []);

  const percent = Math.min((total / goal) * 100, 100);
  const circumference = 2 * Math.PI * 70;

  return (
    <div
      className="p-6 bg-white rounded-xl shadow-lg text-center max-w-2xl mx-auto"
      ref={containerRef}
    >
      {/* 🔧 Editable Title */}
      <div className="mb-4">
        {editingTitle ? (
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => setEditingTitle(false)}
            className="text-2xl font-bold text-green-800 border-b border-green-700 outline-none"
            autoFocus
          />
        ) : (
          <h2
            className="text-2xl font-bold text-green-800 cursor-pointer"
            onClick={() => setEditingTitle(true)}
            title="Click to edit title"
          >
            {title}
          </h2>
        )}
      </div>

      {/* 🎯 Set Goal */}
      <div className="mb-3">
        <label className="text-sm text-gray-600 mr-2">Set Goal:</label>
        <input
          type="number"
          value={goal}
          onChange={(e) => setGoal(parseFloat(e.target.value))}
          className="border border-gray-300 rounded px-3 py-1 text-sm text-center w-32"
        />
      </div>

      {/* 💸 Circular Progress */}
      <div className="flex justify-center items-center mb-6">
        <div className="relative w-40 h-40">
          <svg className="absolute top-0 left-0 w-full h-full">
            <circle
              cx="50%"
              cy="50%"
              r="70"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="15"
            />
            <circle
              cx="50%"
              cy="50%"
              r="70"
              fill="none"
              stroke="#10b981"
              strokeWidth="15"
              strokeDasharray={`${(percent / 100) * circumference} ${circumference}`}
              strokeLinecap="round"
              transform="rotate(-90 100 100)"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-xl font-bold text-green-700">
              KES {total.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500">
              of KES {goal.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* 🧰 Buttons */}
      <div className="flex justify-center gap-4 mb-4 flex-wrap">
        <button
          onClick={resetContributions}
          className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded-md"
        >
          🔁 Reset Counter
        </button>
        <button
          onClick={toggleFullscreen}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-md"
        >
          🖥️ Fullscreen
        </button>
      </div>

      {/* 📋 Live Log */}
      {log.length > 0 && (
        <div className="mt-6 text-left max-h-52 overflow-y-auto">
          <h3 className="text-green-700 font-semibold mb-2">Live Log:</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            {log.map((item, i) => (
              <li key={i} className="border-b py-1">
                <span className="font-medium">KES {item.amount}</span> for{" "}
                <span>{item.purpose}</span> at <span>{item.timestamp}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LiveContributions;
