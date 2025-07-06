import React, { useState, useEffect } from "react";
import axios from "axios";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import BoardContent from "../components/BoardContent";
import BoardModal from "../components/BoardModal";
import EditTaskModal from "../components/EditTaskModal";
import ErrorAlert from "../components/ErrorAlert";
import LoadingSpinner from "../components/LoadingSpinner";

const Board = () => {
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
  });
  const [editingBoard, setEditingBoard] = useState(null);
  const [editBoardName, setEditBoardName] = useState("");

  const API_BASE_URL = "https://task-board-ashen.vercel.app";

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
      setBoards(data);
      if (Array.isArray(data) && data.length > 0 && !selectedBoard) {
        setSelectedBoard(data[0]);
      }
    } catch (error) {
      setError("Failed to load boards. Make sure your backend is running.");
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
    } finally {
      setLoading(false);
    }
  };

  const createBoard = async () => {
    if (!newBoardName.trim()) return;
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };
  const editBoard = async () => {
    if (!editBoardName.trim()) return;
    try {
      setLoading(true);
      setError("");
      const updatedBoard = await apiCall(`/boards/${editingBoard._id}`, {
        method: "PUT",
        body: JSON.stringify({ name: editBoardName }),
      });
      setBoards(
        boards.map((b) => (b._id === updatedBoard._id ? updatedBoard : b))
      );
      if (selectedBoard._id === updatedBoard._id) {
        setSelectedBoard(updatedBoard);
      }
      setEditingBoard(null);
      setEditBoardName("");
    } catch (error) {
      setError("Failed to update board.");
    } finally {
      setLoading(false);
    }
  };

  const deleteBoard = async (boardId) => {
    try {
      setLoading(true);
      setError("");
      await apiCall(`/boards/${boardId}`, { method: "DELETE" });
      const updatedBoards = boards.filter((b) => b._id !== boardId);
      setBoards(updatedBoards);
      if (selectedBoard?._id === boardId) {
        setSelectedBoard(updatedBoards[0] || null);
      }
    } catch (error) {
      setError("Failed to delete board.");
    } finally {
      setLoading(false);
    }
  };

  const createTask = async () => {
    if (!taskForm.title.trim()) return;
    try {
      setLoading(true);
      setError("");
      const payload = { ...taskForm, boardId: selectedBoard?._id };
      const newTask = await apiCall("/tasks", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setTasks([...tasks, newTask]);
      resetTaskForm();
      setShowCreateTask(false);
    } catch (error) {
      setError("Failed to create task.");
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async () => {
    if (!taskForm.title.trim()) return;
    try {
      setLoading(true);
      setError("");
      const payload = { ...taskForm, boardId: selectedBoard?._id };
      const updatedTask = await apiCall(`/tasks/${editingTask._id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      setTasks(
        tasks.map((task) => (task._id === editingTask._id ? updatedTask : task))
      );
      resetTaskForm();
      setEditingTask(null);
    } catch (error) {
      setError("Failed to update task.");
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      setLoading(true);
      setError("");
      await apiCall(`/tasks/${taskId}`, { method: "DELETE" });
      setTasks(tasks.filter((task) => task._id !== taskId));
    } catch (error) {
      setError("Failed to delete task.");
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

  const handleTaskInputChange = (field, value) => {
    setTaskForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const getBoardTasks = () => {
    return selectedBoard
      ? tasks.filter((task) => task.boardId === selectedBoard._id)
      : [];
  };

  useEffect(() => {
    loadBoards();
  }, []);

  useEffect(() => {
    if (selectedBoard) {
      loadTasks(selectedBoard._id);
    }
  }, [selectedBoard]);
  const getTasksByStatus = (status) => {
    return selectedBoard
      ? tasks.filter(
          (task) => task.boardId === selectedBoard._id && task.status === status
        )
      : [];
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <ErrorAlert error={error} setError={setError} />

      <Sidebar
        boards={boards}
        selectedBoard={selectedBoard}
        setSelectedBoard={setSelectedBoard}
        setShowCreateBoard={setShowCreateBoard}
        loading={loading}
        onEditBoard={(board) => {
          setEditingBoard(board);
          setEditBoardName(board.name);
        }}
        onDeleteBoard={deleteBoard}
        API_BASE_URL={API_BASE_URL}
      />

      <div className="flex-1 flex flex-col">
        {selectedBoard ? (
          <>
            <Header
              boardName={selectedBoard.name}
              onAddTask={() => {
                resetTaskForm();
                setShowCreateTask(true);
              }}
              loading={loading}
            />
            {loading && tasks.length === 0 ? (
              <LoadingSpinner />
            ) : (
              <BoardContent
                loading={loading}
                getTasksByStatus={getTasksByStatus}
                updateTaskStatus={updateTaskStatus}
                deleteTask={deleteTask}
                openEditTask={openEditTask}
              />
            )}
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

      <BoardModal
        isOpen={showCreateBoard || Boolean(editingBoard)}
        onClose={() => {
          setShowCreateBoard(false);
          setEditingBoard(null);
          setNewBoardName("");
          setEditBoardName("");
        }}
        newBoardName={editingBoard ? editBoardName : newBoardName}
        setNewBoardName={editingBoard ? setEditBoardName : setNewBoardName}
        createBoard={editingBoard ? editBoard : createBoard}
        loading={loading}
      />

      <EditTaskModal
        isOpen={showCreateTask || Boolean(editingTask)}
        onClose={() => {
          setShowCreateTask(false);
          setEditingTask(null);
          resetTaskForm();
        }}
        editingTask={editingTask}
        taskForm={taskForm}
        handleTaskInputChange={handleTaskInputChange}
        createTask={createTask}
        updateTask={updateTask}
        loading={loading}
      />
    </div>
  );
};

export default Board;
