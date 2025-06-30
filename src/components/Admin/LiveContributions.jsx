import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const socket = io(process.env.REACT_APP_SERVER_URL);
const milestoneSound = new Audio("/milestone.mp3");

const LiveContributions = () => {
  const [total, setTotal] = useState(0);
  const [goal, setGoal] = useState(50000);
  const [log, setLog] = useState([]);
  const [title, setTitle] = useState("Live Contribution Tracker");
  const [editingTitle, setEditingTitle] = useState(false);
  const [lastMilestone, setLastMilestone] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const [filterPurposes, setFilterPurposes] = useState([
    "Building Fund",
    "Special Giving",
    "Thanksgiving",
    "Offering",
    "Tithe",
  ]);
  const [availablePurposes, setAvailablePurposes] = useState([
    "Building Fund",
    "Special Giving",
    "Thanksgiving",
    "Offering",
    "Tithe",
  ]);

  const containerRef = useRef(null);
  const logEndRef = useRef(null);
  const circumference = 2 * Math.PI * 70;
  const percent = Math.min((total / goal) * 100, 100);

  const resetContributions = () => {
    const confirmReset = window.confirm(
      "Are you sure you want to reset the counter?"
    );
    if (confirmReset) {
      socket.emit("reset-total");
      setLastMilestone(0);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    socket.on("initial-total", (initial) => {
      const current = filterPurposes[0];
      if (current && initial[current]) {
        setTotal(initial[current]);
      } else {
        setTotal(0);
      }
    });

    socket.on("new-contribution", ({ amount, purpose }) => {
      setAvailablePurposes((prev) =>
        prev.includes(purpose) ? prev : [...prev, purpose]
      );

      // Count only if purpose is in filter list
      if (filterPurposes.includes(purpose)) {
        setTotal((prev) => {
          const newTotal = prev + amount;
          const nextMilestone = Math.floor(newTotal / 5000) * 5000;
          if (nextMilestone > lastMilestone) {
            milestoneSound.play().catch(() => {});
            setLastMilestone(nextMilestone);
          }
          return newTotal;
        });
      }

      setLog((prev) => {
        const updated = [
          { timestamp: new Date().toLocaleTimeString(), amount, purpose },
          ...prev,
        ];
        return updated;
      });

      // 👇 Auto-scroll to top of log
      setTimeout(() => {
        logEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    });

    socket.on("reset-done", () => {
      setTotal(0);
      setLog([]);
      setLastMilestone(0);
    });

    return () => {
      socket.off("new-contribution");
      socket.off("reset-done");
      socket.off("initial-total");
    };
  }, [filterPurposes, lastMilestone]);

  // Grouped data for bar chart
  const groupedData = Object.values(
    log.reduce((acc, entry) => {
      if (!acc[entry.purpose]) {
        acc[entry.purpose] = { purpose: entry.purpose, total: 0 };
      }
      acc[entry.purpose].total += entry.amount;
      return acc;
    }, {})
  );

  return (
    <div
      ref={containerRef}
      className={`p-6 rounded-xl shadow-lg max-w-5xl mx-auto transition-all duration-300 ${
        darkMode ? "bg-black text-gray-400" : "bg-white text-green-900"
      }`}
    >
      {/* Title */}
      <div className="mb-4">
        {editingTitle ? (
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => setEditingTitle(false)}
            className="text-2xl font-bold border-b outline-none w-full text-center bg-transparent"
            autoFocus
          />
        ) : (
          <h2
            onClick={() => setEditingTitle(true)}
            className="text-2xl font-bold cursor-pointer text-center"
            title="Click to edit title"
          >
            {title}
          </h2>
        )}
      </div>

      {/* Goal Input */}
      <div className="mb-3 flex items-center justify-center gap-2 font-semibold">
        <label className="text-sm">Set Goal:</label>
        <input
          type="number"
          value={goal}
          onChange={(e) => setGoal(parseFloat(e.target.value))}
          className="border px-3 py-1 rounded w-32 text-sm text-center"
        />
      </div>

      {/* Dropdown Purpose Filter */}
      <div className="mb-4 flex justify-center">
        <label className="mr-2 text-sm font-semibold">Track Purpose:</label>
        <select
          value={filterPurposes[0] || ""}
          onChange={(e) => setFilterPurposes([e.target.value])}
          className="border px-3 py-1 rounded text-sm"
        >
          <option value="" disabled>
            Select a purpose
          </option>
          {availablePurposes.map((purpose) => (
            <option key={purpose} value={purpose}>
              {purpose}
            </option>
          ))}
        </select>
      </div>

      {/* Current Purpose Banner */}
      {filterPurposes[0] && (
        <div className="mb-6 text-center">
          <span className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full font-semibold text-sm shadow-sm">
            📌 Tracking: <span className="underline">{filterPurposes[0]}</span>
          </span>
        </div>
      )}

      {/* Progress Circle */}
      <div className="flex justify-center items-center mb-6">
        <div className="relative w-40 h-40">
          <svg className="absolute top-0 left-0 w-full h-full">
            <circle
              cx="50%"
              cy="50%"
              r="70"
              fill="none"
              stroke="#ccc"
              strokeWidth="15"
              transform="rotate(-90 70 70)"
            />

            <circle
              cx="50%"
              cy="50%"
              r="70"
              fill="none"
              stroke="#10b981"
              strokeWidth="15"
              strokeDasharray={`${
                (percent / 100) * circumference
              } ${circumference}`}
              strokeLinecap="round"
              transform="rotate(-90 70 70)"
              style={{
                transition: "stroke-dasharray 0.5s ease-in-out",
              }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-xl font-bold text-green-500">
              KES {total.toLocaleString()}
            </div>
            <div className="text-sm text-gray-400">
              of KES {goal.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-center gap-3 flex-wrap mb-6">
        <button
          onClick={resetContributions}
          className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded"
        >
          🔁 Reset
        </button>
        <button
          onClick={toggleFullscreen}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded"
        >
          🖥️ Fullscreen
        </button>
        <button
          onClick={toggleDarkMode}
          className="bg-gray-800 hover:bg-gray-900 text-white text-sm px-4 py-2 rounded"
        >
          🎨 Mode
        </button>
      </div>

      {/* Live Log */}
      {log.length > 0 && (
        <div className="mt-6 text-left max-h-52 overflow-y-auto">
          <h3 className="text-green-400 font-semibold mb-2">Live Log:</h3>
          <ul className="text-sm space-y-1">
            {log.map((item, i) => (
              <li key={i} className="border-b border-gray-700 py-1">
                <span className="font-medium">KES {item.amount}</span> for{" "}
                <span>{item.purpose}</span> at <span>{item.timestamp}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Bar Chart Summary */}
      {groupedData.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4 text-center">
            📊 Purpose Summary
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={groupedData}>
              <XAxis dataKey="purpose" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default LiveContributions;
