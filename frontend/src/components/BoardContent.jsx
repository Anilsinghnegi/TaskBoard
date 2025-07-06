import React from "react";
import TaskCard from "./TaskCard"; // Ensure this component exists
import LoadingSpinner from "./LoadingSpinner"; // Ensure this is created too

const BoardContent = ({ loading, getTasksByStatus, updateTaskStatus, deleteTask, openEditTask }) => {
  const statuses = ["To Do", "In Progress", "Done"];

  return (
    <div className="flex-1 p-6">
      {loading && getTasksByStatus("To Do").length === 0 &&
        getTasksByStatus("In Progress").length === 0 &&
        getTasksByStatus("Done").length === 0 ? (
        <LoadingSpinner />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
          {statuses.map((status) => (
            <div key={status} className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                {status}
                <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded-full text-sm">
                  {getTasksByStatus(status).length}
                </span>
              </h3>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {getTasksByStatus(status).map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    updateTaskStatus={updateTaskStatus}
                    deleteTask={deleteTask}
                    openEditTask={openEditTask}
                  />
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
  );
};

export default BoardContent;
