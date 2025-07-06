import React from "react";
import { AlertCircle, X } from "lucide-react";

const ErrorAlert = ({ error, setError }) => {
  if (!error) return null;

  return (
    <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50 flex items-center gap-2">
      <AlertCircle size={20} />
      <span>{error}</span>
      <button
        onClick={() => setError("")}
        className="ml-2 text-red-500 hover:text-red-700"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default ErrorAlert;
