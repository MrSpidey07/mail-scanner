// Popup.jsx
import React from "react";

const Popup = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
      {/* Modal Content */}
      <div className="bg-white rounded-lg shadow-xl z-10 p-6 max-w-sm w-full">
        {title && (
          <h2 className="text-lg font-bold mb-4">
            {title}
          </h2>
        )}
        <div>{children}</div>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Popup;
    