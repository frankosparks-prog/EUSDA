import React, { useEffect } from "react";

const Toast = ({ message, duration = 3000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className="fixed top-24 left-5 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slideIn font-semibold w-72">
      <div className="flex items-center justify-between">
        <span>{message}</span>
      </div>
      <div className="mt-2 h-1 bg-white/30 w-full rounded overflow-hidden">
        <div className="h-full bg-white animate-toastProgress"></div>
      </div>
    </div>
  );
};

export default Toast;
