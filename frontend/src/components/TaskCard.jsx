import React from "react";
import { Edit, Trash2, Flag, User, Calendar } from "lucide-react";

const TaskCard = ({ task, updateTaskStatus, deleteTask, openEditTask }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800 border-red-200";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-semibold text-gray-900">{task.title}</h4>
        <div className="flex gap-1">
          <button
            onClick={() => openEditTask(task)}
            className="p-1 text-gray-500 hover:text-blue-600"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => deleteTask(task._id)}
            className="p-1 text-gray-500 hover:text-red-600"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {task.description && (
        <p className="text-gray-600 text-sm mb-3">{task.description}</p>
      )}

      <div className="flex flex-wrap gap-2 mb-3">
        <span
          className={`px-2 py-1 rounded-full text-xs border ${getPriorityColor(
            task.priority
          )}`}
        >
          <Flag size={12} className="inline mr-1" />
          {task.priority}
        </span>

        {task.assignedTo && (
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs border border-blue-200">
            <User size={12} className="inline mr-1" />
            {task.assignedTo}
          </span>
        )}

        {task.dueDate && (
          <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs border border-purple-200">
            <Calendar size={12} className="inline mr-1" />
            {new Date(task.dueDate).toLocaleDateString()}
          </span>
        )}
      </div>

      <select
        value={task.status}
        onChange={(e) => updateTaskStatus(task._id, e.target.value)}
        className="w-full p-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="To Do">To Do</option>
        <option value="In Progress">In Progress</option>
        <option value="Done">Done</option>
      </select>
    </div>
  );
};

export default TaskCard;
