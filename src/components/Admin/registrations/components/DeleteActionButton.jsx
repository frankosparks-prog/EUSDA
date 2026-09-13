import React from "react";
import { Trash2 } from "lucide-react";

function DeleteActionButton({ onClick, strokeWidth = 2 }) {
  return (
    <button
      onClick={onClick}
      className="text-red-500 hover:text-red-700 transform hover:scale-110 transition"
    >
      <Trash2 size={18} strokeWidth={strokeWidth} />
    </button>
  );
}

export default DeleteActionButton;
