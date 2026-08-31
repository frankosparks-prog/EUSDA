import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import jsQR from "jsqr";
import {
  Camera,
  CameraOff,
  ChevronDown,
  QrCode,
  RefreshCw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ClipboardList,
  Send,
} from "lucide-react";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;
const getToken = () => localStorage.getItem("adminToken");

// ── Result display codes ─────────────────────────────────────────────────────
const RESULT_STYLES = {
  CHECKED_IN: {
    bg: "bg-green-50 border-green-400",
    text: "text-green-800",
    icon: <CheckCircle2 className="w-8 h-8 text-green-500" />,
  },
  ALREADY_CHECKED_IN: {
    bg: "bg-amber-50 border-amber-400",
    text: "text-amber-800",
    icon: <AlertTriangle className="w-8 h-8 text-amber-500" />,
  },
  WRONG_EVENT: {
    bg: "bg-red-50 border-red-400",
    text: "text-red-800",
    icon: <XCircle className="w-8 h-8 text-red-500" />,
  },
  NOT_FOUND: {
    bg: "bg-red-50 border-red-400",
    text: "text-red-800",
    icon: <XCircle className="w-8 h-8 text-red-500" />,
  },
  PAYMENT_PENDING: {
    bg: "bg-red-50 border-red-400",
    text: "text-red-800",
    icon: <XCircle className="w-8 h-8 text-red-500" />,
  },
  TICKET_NOT_ISSUED: {
    bg: "bg-red-50 border-red-400",
    text: "text-red-800",
    icon: <XCircle className="w-8 h-8 text-red-500" />,
  },
  SERVER_ERROR: {
    bg: "bg-gray-50 border-gray-400",
    text: "text-gray-800",
    icon: <XCircle className="w-8 h-8 text-gray-500" />,
  },
};

const HistoryBadge = ({ code }) => {
  const s = RESULT_STYLES[code] || RESULT_STYLES.SERVER_ERROR;
  return (
    <span
      className={`text-xs font-bold px-2 py-0.5 rounded-full border ${s.bg} ${s.text}`}
    >
      {code.replace(/_/g, " ")}
    </span>
  );
};

const QrCheckin = () => {
  // Event selection
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [eventsLoading, setEventsLoading] = useState(true);

  // Camera scanner
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const streamRef = useRef(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [cameraError, setCameraError] = useState(null);

  // Manual entry
  const [manualCode, setManualCode] = useState("");

  // Check-in state
  const [result, setResult] = useState(null);
  const [checking, setChecking] = useState(false);
  const lastScannedRef = useRef(""); // debounce repeated scans

  // Scan history (last 10)
  const [history, setHistory] = useState([]);

  // ── Load ticketed events ──
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${SERVER_URL}/api/admin/ticketing/events`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        if (!res.ok) throw new Error("Failed to load events");
        const data = await res.json();
        const ticketed = data.filter((e) => e.ticketed);
        setEvents(ticketed);
        if (ticketed.length > 0) setSelectedEventId(ticketed[0]._id);
      } catch (e) {
        console.error(e);
      } finally {
        setEventsLoading(false);
      }
    })();
  }, []);

  // ── Check-in API call ──
  const performCheckin = useCallback(
    async (ticketCode) => {
      if (!ticketCode || !selectedEventId || checking) return;
      setChecking(true);
      setResult(null);
      try {
        const res = await fetch(
          `${SERVER_URL}/api/admin/ticketing/checkin`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${getToken()}`,
            },
            body: JSON.stringify({ ticketCode, eventId: selectedEventId }),
          }
        );
        const data = await res.json();
        setResult(data);
        // Push to scan history
        setHistory((h) => [
          {
            ticketCode,
            code: data.code,
            name: data.attendee?.name || data.attendee || "",
            message: data.message,
            ts: new Date(),
          },
          ...h.slice(0, 9),
        ]);
      } catch (e) {
        setResult({
          success: false,
          code: "SERVER_ERROR",
          message: "Network error — could not reach server.",
        });
      } finally {
        setChecking(false);
        lastScannedRef.current = ""; // allow re-scan after result shown
      }
    },
    [selectedEventId, checking]
  );

  // ── Camera QR scanning loop ──
  const scanFrame = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video.readyState !== video.HAVE_ENOUGH_DATA) {
      rafRef.current = requestAnimationFrame(scanFrame);
      return;
    }
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: "dontInvert",
    });
    if (code && code.data && code.data !== lastScannedRef.current) {
      lastScannedRef.current = code.data;
      performCheckin(code.data.trim());
    } else {
      rafRef.current = requestAnimationFrame(scanFrame);
    }
  }, [performCheckin]);

  const startCamera = useCallback(async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraOn(true);
      rafRef.current = requestAnimationFrame(scanFrame);
    } catch (e) {
      setCameraError(
        "Camera access denied or unavailable. Use manual entry below."
      );
    }
  }, [scanFrame]);

  const stopCamera = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setCameraOn(false);
  }, []);

  // Restart scan loop after check-in completes
  useEffect(() => {
    if (!checking && cameraOn && !result) {
      rafRef.current = requestAnimationFrame(scanFrame);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checking]);

  // Stop camera on unmount
  useEffect(() => () => stopCamera(), [stopCamera]);

  // Re-start scan loop after result is dismissed
  const dismissResult = () => {
    setResult(null);
    if (cameraOn) rafRef.current = requestAnimationFrame(scanFrame);
  };

  const currentStyle =
    result ? RESULT_STYLES[result.code] || RESULT_STYLES.SERVER_ERROR : null;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-gray-800">QR Check-in</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          Event-day attendee check-in — all validation done server-side
        </p>
      </div>

      {/* Event selector */}
      <div className="bg-white rounded-2xl shadow-sm p-5 space-y-3">
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
          Select Event
        </label>
        <div className="relative">
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <select
            value={selectedEventId}
            onChange={(e) => {
              setSelectedEventId(e.target.value);
              setResult(null);
              lastScannedRef.current = "";
            }}
            disabled={eventsLoading}
            className="w-full appearance-none border border-gray-200 rounded-xl px-4 py-3 pr-9 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            {eventsLoading ? (
              <option>Loading events…</option>
            ) : events.length === 0 ? (
              <option>No ticketed events available</option>
            ) : (
              events.map((ev) => (
                <option key={ev._id} value={ev._id}>
                  {ev.title} —{" "}
                  {new Date(ev.date).toLocaleDateString("en-KE")}
                </option>
              ))
            )}
          </select>
        </div>
      </div>

      {/* Camera scanner */}
      <div className="bg-white rounded-2xl shadow-sm p-5 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
            <Camera className="w-4 h-4" /> Camera Scanner
          </p>
          {cameraOn ? (
            <button
              onClick={stopCamera}
              className="flex items-center gap-1.5 text-sm px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
            >
              <CameraOff className="w-4 h-4" /> Stop Camera
            </button>
          ) : (
            <button
              onClick={startCamera}
              disabled={!selectedEventId}
              className="flex items-center gap-1.5 text-sm px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              <Camera className="w-4 h-4" /> Start Camera
            </button>
          )}
        </div>

        {cameraError && (
          <p className="text-sm text-red-600 bg-red-50 px-4 py-2 rounded-lg">
            {cameraError}
          </p>
        )}

        {/* Video + hidden canvas */}
        <div
          className={`relative bg-black rounded-xl overflow-hidden transition-all ${
            cameraOn ? "h-64" : "h-0"
          }`}
        >
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            muted
            playsInline
          />
          {/* Scan frame overlay */}
          {cameraOn && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-48 h-48 border-4 border-green-400 rounded-2xl opacity-70" />
            </div>
          )}
          {checking && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <RefreshCw className="w-10 h-10 text-white animate-spin" />
            </div>
          )}
        </div>
        <canvas ref={canvasRef} className="hidden" />

        {!cameraOn && !cameraError && (
          <div className="flex items-center justify-center h-20 text-gray-300 gap-3 text-sm">
            <QrCode className="w-8 h-8" />
            Camera is off — press Start Camera or use manual entry
          </div>
        )}
      </div>

      {/* Manual entry */}
      <div className="bg-white rounded-2xl shadow-sm p-5 space-y-3">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
          Manual Ticket Code Entry
        </p>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Paste or type ticket code…"
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && manualCode.trim()) {
                performCheckin(manualCode.trim());
                setManualCode("");
              }
            }}
            className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <button
            disabled={!manualCode.trim() || checking || !selectedEventId}
            onClick={() => {
              performCheckin(manualCode.trim());
              setManualCode("");
            }}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {checking ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            Check In
          </button>
        </div>
      </div>

      {/* Result display */}
      {result && currentStyle && (
        <div
          className={`rounded-2xl border-2 p-6 flex flex-col items-center text-center gap-3 ${currentStyle.bg}`}
        >
          {currentStyle.icon}
          <p className={`text-lg font-extrabold ${currentStyle.text}`}>
            {result.message}
          </p>

          {/* Attendee details on success */}
          {result.code === "CHECKED_IN" && result.attendee && (
            <div className="mt-2 space-y-1">
              <p className="text-sm font-semibold text-green-700">
                {result.attendee.name}
              </p>
              <p className="text-xs text-green-600">{result.attendee.email}</p>
              <p className="text-xs text-gray-500">
                Ticket: {result.ticketCode}
              </p>
              <p className="text-xs text-gray-500">
                Event: {result.event?.title}
              </p>
            </div>
          )}

          {/* Already checked in details */}
          {result.code === "ALREADY_CHECKED_IN" && (
            <div className="space-y-1 text-sm text-amber-700">
              <p className="font-semibold">{result.attendee}</p>
              {result.checkedInAt && (
                <p className="text-xs">
                  Originally checked in:{" "}
                  {new Date(result.checkedInAt).toLocaleString("en-KE")}
                </p>
              )}
              {result.checkedInBy && (
                <p className="text-xs">By: {result.checkedInBy}</p>
              )}
            </div>
          )}

          <button
            onClick={dismissResult}
            className="mt-2 px-5 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Scan Next
          </button>
        </div>
      )}

      {/* Scan history */}
      {history.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-gray-400" />
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Recent Scans (this session)
            </p>
          </div>
          <ul className="divide-y divide-gray-50">
            {history.map((h, i) => (
              <li
                key={i}
                className="px-5 py-3 flex items-center justify-between gap-3 text-sm"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 truncate">
                    {h.name || h.ticketCode.slice(0, 16) + "…"}
                  </p>
                  <p className="text-xs text-gray-400">
                    {h.ts.toLocaleTimeString("en-KE", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </p>
                </div>
                <HistoryBadge code={h.code} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default QrCheckin;
