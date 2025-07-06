import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  X,
  Calendar,
  User,
  Flag,
  AlertCircle,
} from "lucide-react";
import axios from "axios";

const TeamCollaborationBoard = () => {
  const [boards, setBoards] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [showCreateBoard, setShowCreateBoard] = useState(false);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [newBoardName, setNewBoardName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    status: "To Do",
    priority: "Medium",
    assignedTo: "",
    dueDate: "",
    boardId: selectedBoard?._id || "",
  });

  const API_BASE_URL = "https://task-board-ashen.vercel.app";

  // API helper functions
  const apiCall = async (endpoint, options = {}) => {
    try {
      const { method = "GET", body, headers = {} } = options;

      const config = {
        method,
        url: `${API_BASE_URL}${endpoint}`,
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        data: body,
      };

      const response = await axios(config);
      return response.data;
    } catch (error) {
      console.error("API call failed:", error.response || error.message);
      throw error.response?.data || error;
    }
  };
  const loadBoards = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await apiCall("/boards");

      console.log("Boards API response--------->", data); // should be an array
      setBoards(data);

      if (Array.isArray(data) && data.length > 0 && !selectedBoard) {
        setSelectedBoard(data[0]);
      }
    } catch (error) {
      setError("Failed to load boards. Make sure your backend is running.");
      console.error("Error loading boards:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadTasks = async (boardId) => {
    try {
      setLoading(true);
      setError("");
      const data = await apiCall(`/tasks/board/${boardId}`);
      setTasks(data);
    } catch (error) {
      setError("Failed to load tasks.");
      console.error("Error loading tasks:", error);
    } finally {
      setLoading(false);
    }
  };
  // Load boards on component mount

  const createBoard = async () => {
    if (!newBoardName.trim()) return;

    setLoading(true); // Move this AFTER the input is typed, not during onChange

    try {
      setError("");
      const newBoard = await apiCall("/boards", {
        method: "POST",
        body: JSON.stringify({ name: newBoardName }),
      });

      setBoards([...boards, newBoard]);
      setNewBoardName("");
      setShowCreateBoard(false);
      setSelectedBoard(newBoard);
    } catch (error) {
      setError("Failed to create board.");
      console.error("Error creating board:", error);
    } finally {
      setLoading(false);
    }
  };

  const createTask = async () => {
    if (!taskForm.title.trim()) return;

    try {
      setLoading(true);
      setError("");

      const payload = {
        ...taskForm,
        boardId: selectedBoard?._id, // ✅ Inject boardId explicitly
      };

      console.log("Creating task with payload:", payload);

      const newTask = await apiCall("/tasks", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      setTasks([...tasks, newTask]);
      resetTaskForm();
      setShowCreateTask(false);
    } catch (error) {
      setError("Failed to create task.");
      console.error(
        "Error creating task:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async () => {
    if (!taskForm.title.trim()) return;

    try {
      setLoading(true);
      setError("");
      const updatedTask = await apiCall(`/tasks/${editingTask._id}`, {
        method: "PUT",
        body: JSON.stringify(taskForm),
      });

      setTasks(
        tasks.map((task) => (task._id === editingTask._id ? updatedTask : task))
      );
      resetTaskForm();
      setEditingTask(null);
    } catch (error) {
      setError("Failed to update task.");
      console.error("Error updating task:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      setLoading(true);
      setError("");
      await apiCall(`/tasks/${taskId}`, {
        method: "DELETE",
      });

      setTasks(tasks.filter((task) => task._id !== taskId));
    } catch (error) {
      setError("Failed to delete task.");
      console.error("Error deleting task:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    const task = tasks.find((t) => t._id === taskId);
    if (!task) return;

    try {
      setLoading(true);
      setError("");
      const updatedTask = await apiCall(`/tasks/${taskId}`, {
        method: "PUT",
        body: JSON.stringify({ ...task, status: newStatus }),
      });

      setTasks(tasks.map((t) => (t._id === taskId ? updatedTask : t)));
    } catch (error) {
      setError("Failed to update task status.");
      console.error("Error updating task status:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetTaskForm = () => {
    setTaskForm({
      title: "",
      description: "",
      status: "To Do",
      priority: "Medium",
      assignedTo: "",
      dueDate: "",
    });
  };

  const openEditTask = (task) => {
    setTaskForm({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      assignedTo: task.assignedTo,
      dueDate: task.dueDate,
    });
    setEditingTask(task);
  };

  const getBoardTasks = () => {
    return selectedBoard
      ? tasks.filter((task) => task.boardId === selectedBoard._id)
      : [];
  };

  const getTasksByStatus = (status) => {
    return getBoardTasks().filter((task) => task.status === status);
  };

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
  useEffect(() => {
    loadBoards();
  }, []);

  // Load tasks when board changes
  useEffect(() => {
    if (selectedBoard) {
      loadTasks(selectedBoard._id);
    }
  }, [selectedBoard]);
  // Error Alert Component
  const ErrorAlert = () => {
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

  // Loading Spinner Component
  const LoadingSpinner = () => (
    <div className="flex items-center justify-center p-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );

  const TaskCard = ({ task }) => (
    <div className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-semibold text-gray-900">{task.title}</h4>
        <div className="flex gap-1">
          <button
            onClick={() => openEditTask(task)}
            className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => deleteTask(task._id)}
            className="p-1 text-gray-500 hover:text-red-600 transition-colors"
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
        disabled={loading}
      >
        <option value="To Do">To Do</option>
        <option value="In Progress">In Progress</option>
        <option value="Done">Done</option>
      </select>
    </div>
  );

  const handleTaskInputChange = (field, value) => {
    setTaskForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          {children}
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <ErrorAlert />

      {/* Sidebar */}
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
              onClick={() => setShowCreateBoard(true)}
              className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
              disabled={loading}
            >
              <Plus size={20} />
            </button>
          </div>

          {loading && boards.length === 0 ? (
            <LoadingSpinner />
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
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {selectedBoard ? (
          <>
            {/* Header */}
            <div className="bg-white shadow-sm p-4 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedBoard.name}
                </h2>
                <button
                  onClick={() => setShowCreateTask(true)}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  disabled={loading}
                >
                  <Plus size={20} />
                  Add Task
                </button>
              </div>
            </div>

            {/* Board Content */}
            <div className="flex-1 p-6">
              {loading && tasks.length === 0 ? (
                <LoadingSpinner />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
                  {["To Do", "In Progress", "Done"].map((status) => (
                    <div key={status} className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        {status}
                        <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded-full text-sm">
                          {getTasksByStatus(status).length}
                        </span>
                      </h3>
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {getTasksByStatus(status).map((task) => (
                          <TaskCard key={task._id} task={task} />
                        ))}
                        {getTasksByStatus(status).length === 0 && (
                          <div className="text-center text-gray-500 py-4">
                            No tasks in {status.toLowerCase()}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-600 mb-2">
                Select a board to get started
              </h2>
              <p className="text-gray-500 mb-4">
                Choose a board from the sidebar or create a new one
              </p>
              {boards.length === 0 && !loading && (
                <button
                  onClick={() => setShowCreateBoard(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Your First Board
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Create Board Modal */}
      <Modal
        isOpen={showCreateBoard}
        onClose={() => {
          setShowCreateBoard(false);
          setNewBoardName("");
        }}
        title="Create New Board"
      >
        <div className="space-y-4">
          <input
            autoFocus
            type="text"
            placeholder="Board name"
            value={newBoardName}
            onChange={(e) => setNewBoardName(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            // DON'T ADD disabled={loading} here!
          />

          <div className="flex gap-2">
            <button
              onClick={createBoard}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              disabled={loading || !newBoardName.trim()}
            >
              {loading ? "Creating..." : "Create"}
            </button>
            <button
              onClick={() => {
                setShowCreateBoard(false);
                setNewBoardName("");
              }}
              className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      {/* Create/Edit Task Modal */}
      <Modal
        isOpen={showCreateTask || Boolean(editingTask)}
        onClose={() => {
          setShowCreateTask(false);
          setEditingTask(null);
          resetTaskForm();
        }}
        title={editingTask ? "Edit Task" : "Create New Task"}
      >
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Task title *"
            value={taskForm.title}
            onChange={(e) => handleTaskInputChange("title", e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus

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
              onChange={(e) => handleTaskInputChange("status", e.target.value)}
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
              onClick={() => {
                setShowCreateTask(false);
                setEditingTask(null);
                resetTaskForm();
              }}
              className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TeamCollaborationBoard;
