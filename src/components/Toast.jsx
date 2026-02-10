import React, { useEffect, useState } from "react";
import { X, CheckCircle, AlertTriangle, Info, XCircle } from "lucide-react";

const Toast = ({ message, duration = 3000, onClose, type = "success" }) => {
  const [isVisible, setIsVisible] = useState(false);

  // Trigger entry animation
  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true));
    
    const timer = setTimeout(() => {
      setIsVisible(false); // Trigger exit animation
      setTimeout(onClose, 300); // Wait for animation to finish before unmounting
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const styles = {
    success: {
      border: "border-green-500",
      shadow: "shadow-[0_0_15px_-3px_rgba(34,197,94,0.6)]",
      iconColor: "text-green-400",
      progressBar: "bg-green-500",
      Icon: CheckCircle,
    },
    error: {
      border: "border-red-500",
      shadow: "shadow-[0_0_15px_-3px_rgba(239,68,68,0.6)]",
      iconColor: "text-red-400",
      progressBar: "bg-red-500",
      Icon: XCircle,
    },
    info: {
      border: "border-blue-500",
      shadow: "shadow-[0_0_15px_-3px_rgba(59,130,246,0.6)]",
      iconColor: "text-blue-400",
      progressBar: "bg-blue-500",
      Icon: Info,
    },
    warning: {
      border: "border-yellow-500",
      shadow: "shadow-[0_0_15px_-3px_rgba(234,179,8,0.6)]",
      iconColor: "text-yellow-400",
      progressBar: "bg-yellow-500",
      Icon: AlertTriangle,
    },
  };

  const currentStyle = styles[type] || styles.success;
  const { Icon } = currentStyle;

  return (
    <div
      className={`fixed top-24 right-5 z-50 flex flex-col w-full max-w-sm transform transition-all duration-500 ease-out 
        ${isVisible ? "translate-x-0 opacity-100 scale-100" : "translate-x-10 opacity-0 scale-95"}`}
      role="alert"
    >
      <div 
        className={`relative overflow-hidden rounded-xl bg-gray-900/90 backdrop-blur-xl border ${currentStyle.border} ${currentStyle.shadow} p-4 pr-10`}
      >
        {/* Background Gradient Mesh (Subtle) */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

        <div className="flex items-start gap-4 relative z-10">
          {/* Icon */}
          <div className={`${currentStyle.iconColor} p-1 rounded-full bg-white/5`}>
            <Icon size={24} />
          </div>

          {/* Content */}
          <div className="flex-1 pt-0.5">
            <h4 className={`text-sm font-bold uppercase tracking-wider mb-1 ${currentStyle.iconColor}`}>
              {type}
            </h4>
            <p className="text-gray-200 text-sm font-medium leading-snug">
              {message}
            </p>
          </div>

          {/* Close Button */}
          <button
            onClick={() => { setIsVisible(false); setTimeout(onClose, 300); }}
            className="absolute top-2 right-2 text-gray-400 hover:text-white transition-colors p-1 rounded-md hover:bg-white/10"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-800">
          <div
            className={`h-full ${currentStyle.progressBar} shadow-[0_0_10px_currentColor]`}
            style={{
              animation: `shrink ${duration}ms linear forwards`,
            }}
          />
        </div>
      </div>

      {/* Animation Keyframes (Inline for portability) */}
      <style>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};

export default Toast;