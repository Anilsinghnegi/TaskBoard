import React from "react";
import { Plus } from "lucide-react";

const Header = ({ boardName, onAddTask, loading }) => {
  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white border-b shadow-sm">
      <h1 className="text-2xl font-bold text-gray-800">
        {boardName || "Untitled Board"}
      </h1>

      <button
        onClick={onAddTask}
        disabled={loading}
        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
      >
        <Plus size={18} />
        <span>Add Task</span>
      </button>
    </div>
  );
};

export default Header;
