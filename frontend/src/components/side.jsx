import React from "react";
import { Plus } from "lucide-react";

const Sidebar = ({
  boards,
  selectedBoard,
  setSelectedBoard,
  setShowCreateBoard,
  setShowCreateTask,
  resetTaskForm,
  loading,
  API_BASE_URL,
}) => {
  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold text-gray-900">Team Board</h1>
        <div className="text-sm text-gray-500 mt-1">
          Connected to: {API_BASE_URL}
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-gray-700">Boards</h2>
          <button
            onClick={() => {
              resetTaskForm();
              setTimeout(() => setShowCreateTask(true), 0);
            }}
            className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
            disabled={loading}
          >
            <Plus size={20} />
          </button>
        </div>

        {loading && boards.length === 0 ? (
          <div className="text-gray-400 text-center py-4">Loading...</div>
        ) : (
          <div className="space-y-2">
            {Array.isArray(boards) &&
              boards.map((board) => (
                <button
                  key={board._id}
                  onClick={() => setSelectedBoard(board)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedBoard?._id === board._id
                      ? "bg-blue-100 text-blue-900 border border-blue-200"
                      : "hover:bg-gray-50 text-gray-700"
                  }`}
                  disabled={loading}
                >
                  {board.name}
                </button>
              ))}
            {boards.length === 0 && !loading && (
              <div className="text-center text-gray-500 py-4">
                No boards yet. Create your first board!
              </div>
            )}
          </div>
        )}
      </div>

      {/* Button to open "Create Board" modal */}
      <div className="p-4 border-t">
        <button
          onClick={() => setShowCreateBoard(true)}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          disabled={loading}
        >
          + Create Board
        </button>
      </div>
    </div>
  );
};