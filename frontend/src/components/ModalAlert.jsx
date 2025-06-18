// frontend/src/components/ModalAlert.jsx
import React from "react";
import { FaExclamationTriangle } from "react-icons/fa";

const ModalAlert = ({ show, message, onClose }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#1a1a2e] border border-cyan-400 p-6 rounded-xl text-white w-[90%] max-w-md shadow-lg animate-fadeIn">
        <div className="flex items-center gap-3 mb-4">
          <FaExclamationTriangle className="text-yellow-400 text-2xl" />
          <h2 className="text-lg font-semibold text-cyan-300">Access Restricted</h2>
        </div>
        <p className="text-sm text-white/80 mb-6">{message}</p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded border border-cyan-400 hover:bg-cyan-400 hover:text-black transition"
          >
            Okay
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalAlert;
