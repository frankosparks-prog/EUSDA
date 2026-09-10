import React, { useEffect, useRef, useState, useCallback } from "react";
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
  Send,
  ClipboardList,
  Calendar,
  MapPin,
  Clock,
  Sparkles,
  X,
} from "lucide-react";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;
const getToken = () => localStorage.getItem("adminToken");

/* ─── Result style map (for attendee success & duplicate check-ins) ─── */
const RESULT_STYLES = {
  CHECKED_IN: {
    bg: "bg-emerald-600",
    border: "border-emerald-500",
    text: "text-white",
    subtext: "text-emerald-100",
    icon: <CheckCircle2 className="w-12 h-12 text-white" />,
  },
  ALREADY_CHECKED_IN: {
    bg: "bg-amber-500",
    border: "border-amber-400",
    text: "text-white",
    subtext: "text-amber-100",
    icon: <AlertTriangle className="w-12 h-12 text-white" />,
  },
};

/* History badge — solid status badges matching the design system */
const HistoryBadge = ({ code }) => {
  const colorMap = {
    CHECKED_IN: "bg-emerald-600 text-white",
    ALREADY_CHECKED_IN: "bg-amber-500 text-white",
    SERVER_ERROR: "bg-slate-600 text-white",
  };
  const cls = colorMap[code] || "bg-red-600 text-white";
  const labels = {
    CHECKED_IN: "Checked In",
    ALREADY_CHECKED_IN: "Duplicate",
    WRONG_EVENT: "Wrong Event",
    NOT_FOUND: "Not Found",
    PAYMENT_PENDING: "Unpaid",
    TICKET_NOT_ISSUED: "Not Issued",
    SERVER_ERROR: "Error",
  };
  return (
    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-md whitespace-nowrap shadow-sm ${cls}`}>
      {labels[code] || code}
    </span>
  );
};

/* Dashed "stub" chip */
const StubChip = ({ children }) => (
  <span className="font-mono text-[11px] tracking-tight text-[#161B33] bg-[#F2F3F7] border border-dashed border-[#B8860B]/50 px-2 py-0.5 rounded">
    {children}
  </span>
);

/* ─── Snackbar / Toast component for error & feedback notifications ─── */
const Snackbar = ({ toast, onClose }) => {
  if (!toast) return null;
  const cfg =
    toast.type === "error"
      ? "bg-red-50 border-red-200 text-red-800"
      : toast.type === "warn"
      ? "bg-amber-50 border-amber-200 text-amber-800"
      : "bg-emerald-50 border-emerald-200 text-emerald-800";

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-xl border shadow-lg transition-all transform animate-in fade-in slide-in-from-top-2 ${cfg}`}
      role="alert"
    >
      {toast.type === "error" ? (
        <XCircle className="w-5 h-5 shrink-0 text-red-600 mt-0.5" />
      ) : toast.type === "warn" ? (
        <AlertTriangle className="w-5 h-5 shrink-0 text-amber-600 mt-0.5" />
      ) : (
        <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600 mt-0.5" />
      )}
      <div className="flex-1 text-sm font-medium leading-snug">{toast.msg}</div>
      <button
        onClick={onClose}
        className="shrink-0 p-1 text-slate-400 hover:text-slate-700 transition-colors rounded-lg"
        title="Dismiss"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════ */
const QrCheckin = () => {
  /* event selection */
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [eventsLoading, setEventsLoading] = useState(true);

  /* camera */
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const streamRef = useRef(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [cameraError, setCameraError] = useState(null);

  /* manual entry */
  const [manualCode, setManualCode] = useState("");

  /* check-in success state & snackbar toast */
  const [successResult, setSuccessResult] = useState(null);
  const [toast, setToast] = useState(null);
  const [checking, setChecking] = useState(false);
  const lastScannedRef = useRef("");
  const toastTimeoutRef = useRef(null);

  /* scan history */
  const [history, setHistory] = useState([]);

  const showToast = useCallback((msg, type = "error") => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToast({ msg, type });
    toastTimeoutRef.current = setTimeout(() => {
      setToast(null);
    }, 4500);
  }, []);

  /* load ticketed events */
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

  /* check-in API */
  const performCheckin = useCallback(
    async (ticketCode) => {
      if (!ticketCode || !selectedEventId || checking) return;
      setChecking(true);
      try {
        const res = await fetch(`${SERVER_URL}/api/admin/ticketing/checkin`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify({ ticketCode, eventId: selectedEventId }),
        });
        const data = await res.json();

        // Update history feed
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

        if (data.code === "CHECKED_IN" || data.code === "ALREADY_CHECKED_IN") {
          // Success/warning: Show attendee card banner
          setSuccessResult(data);
          setToast(null);
        } else {
          // Errors (Not found, unpaid, wrong event, server error): Show Snackbar without blocking scanner
          setSuccessResult(null);
          showToast(data.message || "Invalid ticket — validation failed", "error");
        }
      } catch (e) {
        showToast("Network error — could not reach check-in server.", "error");
      } finally {
        setChecking(false);
        // Allow re-scanning next ticket after a short debounce
        setTimeout(() => {
          lastScannedRef.current = "";
        }, 2000);
      }
    },
    [selectedEventId, checking, showToast]
  );

  /* scan loop */
  const scanFrame = useCallback(() => {
    if (!videoRef.current) return;
    const video = videoRef.current;

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      if (!canvasRef.current) {
        canvasRef.current = document.createElement("canvas");
      }
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert",
        });
        if (code && code.data && code.data.trim() && code.data.trim() !== lastScannedRef.current) {
          lastScannedRef.current = code.data.trim();
          performCheckin(code.data.trim());
        }
      }
    }

    rafRef.current = requestAnimationFrame(scanFrame);
  }, [performCheckin]);

  const startCamera = useCallback(async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute("playsinline", "true");
        await videoRef.current.play();
      }
      setCameraOn(true);
      rafRef.current = requestAnimationFrame(scanFrame);
    } catch (e) {
      setCameraError(e.message || "Camera access denied or unavailable.");
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

  useEffect(() => () => stopCamera(), [stopCamera]);

  const dismissResult = () => {
    setSuccessResult(null);
    lastScannedRef.current = "";
  };

  const selectedEvent = events.find((e) => e._id === selectedEventId);
  const currentSuccessStyle = successResult ? RESULT_STYLES[successResult.code] : null;

  return (
    <div className="min-h-screen bg-[#F2F3F7]">
      <div className="p-4 sm:p-6 max-w-xl mx-auto space-y-5">
        {/* Invisible canvas for video frame extraction */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Header — Ink Navy surface with brass accent icon */}
        <div className="bg-[#161B33] rounded-2xl px-5 py-4 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">QR Check-In</h1>
            <p className="text-sm text-white/50 mt-0.5">Real-time attendee ticket verification</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#B8860B] shrink-0">
            <QrCode className="w-5 h-5" />
          </div>
        </div>

        {/* Floating/Inline Snackbar for error & non-blocking notices */}
        {toast && (
          <Snackbar toast={toast} onClose={() => setToast(null)} />
        )}

        {/* Event selector */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-2.5">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Select Event</label>
          <div className="relative">
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <select
              value={selectedEventId}
              onChange={(e) => {
                setSelectedEventId(e.target.value);
                setSuccessResult(null);
                setToast(null);
                lastScannedRef.current = "";
              }}
              disabled={eventsLoading}
              className="w-full appearance-none border border-slate-200 rounded-xl px-4 py-3 pr-9 text-sm font-semibold text-[#161B33] focus:outline-none focus:ring-2 focus:ring-[#B8860B]/50 focus:border-[#B8860B] bg-white"
            >
              {eventsLoading ? (
                <option>Loading events...</option>
              ) : events.length === 0 ? (
                <option>No ticketed events</option>
              ) : (
                events.map((ev) => (
                  <option key={ev._id} value={ev._id}>
                    {ev.title} &mdash; {new Date(ev.date).toLocaleDateString("en-KE")}
                  </option>
                ))
              )}
            </select>
          </div>
          {selectedEvent && (
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#B8860B]" />
                {new Date(selectedEvent.date).toLocaleDateString("en-KE", { weekday: "short", month: "short", day: "numeric" })}
              </span>
              {selectedEvent.venue && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#B8860B]" />
                  {selectedEvent.venue}
                </span>
              )}
              {selectedEvent.time && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#B8860B]" />
                  {selectedEvent.time}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Success / Duplicate Attendee confirmation banner */}
        {successResult && currentSuccessStyle && (
          <div className={`rounded-2xl p-6 text-center space-y-3.5 shadow-md border ${currentSuccessStyle.bg} ${currentSuccessStyle.border}`}>
            <div className="flex justify-center">{currentSuccessStyle.icon}</div>
            <p className={`text-lg font-bold leading-snug ${currentSuccessStyle.text}`}>
              {successResult.message}
            </p>

            {successResult.code === "CHECKED_IN" && successResult.attendee && (
              <div className="bg-black/15 backdrop-blur-sm rounded-xl p-3.5 space-y-1 text-sm text-white">
                <p className="font-bold text-base">{successResult.attendee.name}</p>
                <p className="text-white/80 text-xs">{successResult.attendee.email}</p>
                {successResult.event?.title && (
                  <p className="text-xs text-emerald-200 font-medium pt-0.5">{successResult.event.title}</p>
                )}
              </div>
            )}

            {successResult.code === "ALREADY_CHECKED_IN" && (
              <div className="bg-black/15 backdrop-blur-sm rounded-xl p-3.5 space-y-1 text-sm text-white">
                <p className="font-bold text-base">{successResult.attendee}</p>
                {successResult.checkedInAt && (
                  <p className="text-xs text-amber-100">
                    Checked in: {new Date(successResult.checkedInAt).toLocaleTimeString("en-KE", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                )}
                {successResult.checkedInBy && (
                  <p className="text-xs text-amber-100">By: {successResult.checkedInBy}</p>
                )}
              </div>
            )}

            <button
              onClick={dismissResult}
              className="mt-2 px-6 py-2.5 bg-white text-[#161B33] hover:bg-slate-100 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95"
            >
              Scan Next Ticket
            </button>
          </div>
        )}

        {/* Camera scanner */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-[#B8860B]" /> Scanner Camera
            </p>
            {cameraOn ? (
              <button
                onClick={stopCamera}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded-xl hover:bg-red-100 transition-colors font-semibold"
              >
                <CameraOff className="w-3.5 h-3.5" /> Stop Camera
              </button>
            ) : (
              <button
                onClick={startCamera}
                disabled={!selectedEventId}
                className="flex items-center gap-1.5 text-xs px-4 py-2 bg-[#B8860B] text-white rounded-xl hover:bg-[#a3760a] transition-colors disabled:opacity-40 font-semibold shadow-sm"
              >
                <Camera className="w-3.5 h-3.5" /> Start Camera
              </button>
            )}
          </div>

          {cameraError && (
            <p className="text-xs text-red-700 bg-red-50 border border-red-200 px-3.5 py-2.5 rounded-xl font-medium">
              {cameraError}
            </p>
          )}

          {/* Video viewport */}
          <div className={`relative bg-[#161B33] rounded-xl overflow-hidden transition-all duration-300 ${cameraOn ? "h-72" : "h-0"}`}>
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              muted
              playsInline
              autoPlay
            />

            {/* Animated scan frame overlay */}
            {cameraOn && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="relative w-52 h-52">
                  {/* Corner brackets */}
                  {[
                    "top-0 left-0 border-t-4 border-l-4 rounded-tl-xl",
                    "top-0 right-0 border-t-4 border-r-4 rounded-tr-xl",
                    "bottom-0 left-0 border-b-4 border-l-4 rounded-bl-xl",
                    "bottom-0 right-0 border-b-4 border-r-4 rounded-br-xl",
                  ].map((cls, i) => (
                    <div key={i} className={`absolute w-8 h-8 border-[#B8860B] ${cls}`} />
                  ))}
                  {/* Scan line */}
                  <div
                    className="absolute left-2 right-2 h-0.5 bg-[#B8860B] opacity-80 rounded-full shadow-[0_0_8px_#B8860B]"
                    style={{ animation: "scanline 2s ease-in-out infinite" }}
                  />
                </div>
              </div>
            )}

            {/* Processing overlay */}
            {checking && (
              <div className="absolute inset-0 bg-[#161B33]/70 backdrop-blur-sm flex items-center justify-center">
                <RefreshCw className="w-10 h-10 text-[#B8860B] animate-spin" />
              </div>
            )}
          </div>

          {!cameraOn && !cameraError && (
            <div className="flex flex-col items-center justify-center h-24 text-slate-400 gap-2 border border-slate-100 rounded-xl bg-slate-50/50">
              <QrCode className="w-7 h-7 text-[#B8860B]/60" />
              <p className="text-xs font-medium text-slate-500">Click &quot;Start Camera&quot; to scan attendee QR codes</p>
            </div>
          )}
        </div>

        {/* Scan line animation */}
        <style>{`
          @keyframes scanline {
            0% { top: 8px; opacity: 0.6; }
            50% { top: calc(100% - 8px); opacity: 0.9; }
            100% { top: 8px; opacity: 0.6; }
          }
        `}</style>

        {/* Manual entry — signature dashed ticket stub border */}
        <div className="bg-white rounded-2xl border-2 border-dashed border-[#B8860B]/40 shadow-sm p-4 space-y-3">
          <p className="text-sm font-semibold text-[#161B33] flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#B8860B]" /> Manual Check-In by Ticket Code
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Paste or type ticket code (e.g. EU-12345)..."
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && manualCode.trim()) {
                  performCheckin(manualCode.trim());
                  setManualCode("");
                }
              }}
              className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-mono text-[#161B33] focus:outline-none focus:ring-2 focus:ring-[#B8860B]/50 focus:border-[#B8860B]"
            />
            <button
              disabled={!manualCode.trim() || checking || !selectedEventId}
              onClick={() => {
                performCheckin(manualCode.trim());
                setManualCode("");
              }}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-[#161B33] text-white rounded-xl text-sm font-semibold hover:bg-[#232a52] transition-colors disabled:opacity-40 shrink-0"
            >
              {checking ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span className="hidden sm:inline">Check In</span>
            </button>
          </div>
        </div>

        {/* Scan history */}
        {history.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-4 py-3 bg-[#161B33] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-[#B8860B]" />
                <p className="text-xs font-semibold uppercase tracking-wider text-white">
                  Recent Scans ({history.length})
                </p>
              </div>
            </div>
            <ul className="divide-y divide-slate-100">
              {history.map((h, i) => (
                <li key={i} className="px-4 py-3 flex items-center justify-between gap-3 hover:bg-[#F2F3F7] transition-colors">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#161B33] truncate">
                      {h.name || "Attendee"}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <StubChip>{h.ticketCode.length > 14 ? `${h.ticketCode.slice(0, 14)}...` : h.ticketCode}</StubChip>
                      <span className="text-xs text-slate-400">
                        {h.ts.toLocaleTimeString("en-KE", {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                  <HistoryBadge code={h.code} />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default QrCheckin;

