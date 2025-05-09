import React, { useEffect } from "react";

const Toast = ({ message, duration = 3000, onClose, type = "success" }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const styles = {
    success: {
      bg: "bg-green-600",
      bar: "bg-green-300",
      icon: "✅",
    },
    error: {
      bg: "bg-red-600",
      bar: "bg-red-300",
      icon: "❌",
    },
    info: {
      bg: "bg-blue-600",
      bar: "bg-blue-300",
      icon: "ℹ️",
    },
    warning: {
      bg: "bg-yellow-600",
      bar: "bg-yellow-300",
      icon: "⚠️",
    },
  };

  const { bg, bar, icon } = styles[type] || styles.success;

  return (
    <div
      className={`fixed top-24 left-5 ${bg} text-white px-6 py-4 rounded-lg shadow-lg z-50 animate-slideIn font-semibold w-80`}
      role="alert"
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-lg">{icon}</span>
        <span className="flex-1">{message}</span>
        <button
          onClick={onClose}
          className="ml-2 text-white hover:text-gray-200 font-bold text-xl"
          aria-label="Close"
        >
          ×
        </button>
      </div>
      <div className="mt-3 h-1 w-full rounded overflow-hidden bg-white/30">
        <div className={`h-full ${bar} animate-toastProgress`}></div>
      </div>
    </div>
  );
};

export default Toast;


// setToast({ type: "error", text: "Something went wrong!" });
// setToast({ type: "success", text: "Successfully submitted!" });
// setToast({ type: "info", text: "Heads up: check your email." });
// setToast({ type: "warning", text: "Please fill all required fields." });