import React from "react";
import { Plus, Trash2, Edit } from "lucide-react";

const Sidebar = ({
  boards,
  selectedBoard,
  setSelectedBoard,
  setShowCreateBoard,
  loading,
  onEditBoard,
  onDeleteBoard,
  API_BASE_URL,
}) => {
  return (
    <div className="w-64 bg-white border-r p-4 flex flex-col space-y-4">
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold text-gray-900">Team Board</h1>
        <div className="text-sm text-gray-500 mt-1">
          Connected to: {API_BASE_URL}
        </div>
      </div>
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-800">Boards</h2>
        <button
          onClick={() => setShowCreateBoard(true)}
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          <Plus size={18} />
        </button>
      </div>

      <div className="space-y-2">
        {boards.map((board) => (
          <div
            key={board._id}
            className={`flex justify-between items-center px-3 py-2 rounded cursor-pointer transition ${
              selectedBoard?._id === board._id
                ? "bg-blue-100 text-blue-800 font-semibold"
                : "hover:bg-gray-100"
            }`}
          >
            <span onClick={() => setSelectedBoard(board)}>{board.name}</span>

            <div className="flex gap-1">
              <button
                onClick={() => onEditBoard(board)}
                className="text-gray-500 hover:text-blue-600"
                title="Edit"
              >
                <Edit size={16} />
              </button>
              <button
                onClick={() => onDeleteBoard(board._id)}
                className="text-gray-500 hover:text-red-600"
                title="Delete"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
