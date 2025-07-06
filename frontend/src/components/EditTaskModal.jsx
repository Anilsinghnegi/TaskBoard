import React from "react";
import { X } from "lucide-react";

const EditTaskModal = ({
  isOpen,
  onClose,
  editingTask,
  taskForm,
  handleTaskInputChange,
  createTask,
  updateTask,
  loading,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            {editingTask ? "Edit Task" : "Create New Task"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Task title *"
            value={taskForm.title}
            onChange={(e) => handleTaskInputChange("title", e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <textarea
            placeholder="Description"
            value={taskForm.description}
            onChange={(e) =>
              handleTaskInputChange("description", e.target.value)
            }
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
          />

          <div className="grid grid-cols-2 gap-4">
            <select
              value={taskForm.status}
              onChange={(e) =>
                handleTaskInputChange("status", e.target.value)
              }
              className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>

            <select
              value={taskForm.priority}
              onChange={(e) =>
                handleTaskInputChange("priority", e.target.value)
              }
              className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <input
            type="text"
            placeholder="Assigned to"
            value={taskForm.assignedTo}
            onChange={(e) =>
              handleTaskInputChange("assignedTo", e.target.value)
            }
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="date"
            value={taskForm.dueDate}
            onChange={(e) => handleTaskInputChange("dueDate", e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="flex gap-2">
            <button
              onClick={editingTask ? updateTask : createTask}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              disabled={loading || !taskForm.title.trim()}
            >
              {loading
                ? editingTask
                  ? "Updating..."
                  : "Creating..."
                : editingTask
                ? "Update"
                : "Create"}
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditTaskModal;
