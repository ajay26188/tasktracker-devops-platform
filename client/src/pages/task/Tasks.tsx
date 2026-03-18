import { useEffect, useState } from "react";
import {
  fetchTasksByOrg,
  fetchTasksByUser,
  updateTask,
  deleteTask,
} from "../../services/task";
import TaskModal from "./TaskModal";
import TaskDetailModal from "./Task";
import type {
  Task,
  TaskStatus,
  TaskPriority,
  TaskPayload,
  PaginatedTasks,
} from "../../types/task";
import { useAuth } from "../../context/AuthContext";

type StatusFilter = "all" | TaskStatus;
type PriorityFilter = "all" | TaskPriority;
type DueDateFilter = "all" | "past30" | "past7" | "today" | "next7" | "next30";

const Tasks: React.FC = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 9;

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("all");
  const [dueDateFilter, setDueDateFilter] = useState<DueDateFilter>("all");

  // Modals
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null);
  const [showTaskDetail, setShowTaskDetail] = useState(false);

  // Load tasks from server with filters & pagination
  useEffect(() => {
    const loadTasks = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const data: PaginatedTasks =
          user.role === "admin"
            ? await fetchTasksByOrg(
                user.organizationId,
                page,
                limit,
                search,
                statusFilter,
                priorityFilter,
                dueDateFilter
              )
            : await fetchTasksByUser(
                page,
                limit,
                search,
                statusFilter,
                priorityFilter,
                dueDateFilter
              );
  
        setTasks(data.tasks);
        setPages(data.pages);
        setTotal(data.total);
      } catch {
        setError("Failed to fetch tasks. Please check your connection.");
      } finally {
        setLoading(false);
      }
    };
  
    loadTasks();
  }, [user, page, search, statusFilter, priorityFilter, dueDateFilter]);
  

  // Update task
  const handleUpdate = async (task: Task, updates: Partial<TaskPayload>) => {
    try {
      const updated = await updateTask(task.id, updates);
      setTasks((prev) => prev.map((t) => (t.id === task.id ? updated : t)));
    } catch (err) {
      console.error("Failed to update task", err);
    }
  };

  // Delete task
  const handleDelete = async () => {
    if (!deleteTaskId) return;
    try {
      await deleteTask(deleteTaskId);
      setTasks((prev) => prev.filter((t) => t.id !== deleteTaskId));
    } catch (err) {
      console.error("Failed to delete task", err);
    } finally {
      setDeleteTaskId(null);
    }
  };

  // Skeleton loader
  const renderSkeleton = () => (
    <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, idx) => (
        <div
          key={idx}
          className="p-5 rounded-2xl bg-gray-200 animate-pulse h-40"
        ></div>
      ))}
    </div>
  );

  return (
    <div className="p-6">
      {/* Header & Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7 text-indigo-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-3-3v6m9-6a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Tasks
            </h1>
            <p className="text-sm text-gray-500">Manage and track your tasks</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="🔍 Search tasks by title or id..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="min-w-[250px] sm:min-w-[300px] border rounded px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            className="border rounded px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Status</option>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
          <select
            value={priorityFilter}
            onChange={(e) =>
              setPriorityFilter(e.target.value as PriorityFilter)
            }
            className="border rounded px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <select
            value={dueDateFilter}
            onChange={(e) => setDueDateFilter(e.target.value as DueDateFilter)}
            className="border rounded px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Due Dates</option>
            <option value="past7">Past 7 Days</option>
            <option value="past30">Past 30 Days</option>
            <option value="today">Today</option>
            <option value="next7">Next 7 Days</option>
            <option value="next30">Next 30 Days</option>
          </select>
        </div>
      </div>

      {/* Task List */}
      {loading ? (
        renderSkeleton()
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : tasks.length === 0 ? (
        <p className="text-gray-500">No tasks found.</p>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="relative block bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 p-5 border border-gray-100 overflow-hidden cursor-pointer"
                onClick={() => {
                  setSelectedTask(task);
                  setShowTaskDetail(true);
                }}
              >
                {/* Task card content */}
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xl font-bold text-gray-800">
                      {task.title}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full w-fit ${
                        task.priority === "high"
                          ? "bg-red-100 text-red-700"
                          : task.priority === "medium"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {task.priority || "-"}
                    </span>
                  </div>

                  <p className="text-sm text-gray-500 mb-1 capitalize">
                    Status:{" "}
                    <span
                      className={
                        task.status === "done"
                          ? "text-green-600 font-semibold"
                          : task.status === "in-progress"
                          ? "text-blue-600 font-semibold"
                          : "text-gray-600"
                      }
                    >
                      {task.status}
                    </span>
                  </p>
                  {task.dueDate && (
                    <p className="text-sm text-gray-400 mb-1">
                      Due: {task.dueDate.slice(0, 10)}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-2 mt-3">
                    {task.assignedTo && task.assignedTo.length > 0 ? (
                      task.assignedTo.map((user, idx) => {
                        const initials = user.name
                          ? user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                          : "?";
                        return (
                          <div
                            key={idx}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold"
                            title={user.name}
                          >
                            {initials}
                          </div>
                        );
                      })
                    ) : (
                      <span className="text-gray-400 text-sm">Unassigned</span>
                    )}
                  </div>

                  {user?.role === "admin" ? (
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTask(task);
                          setShowTaskModal(true);
                        }}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteTaskId(task.id);
                        }}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  ) : (
                    <div className="mt-3">
                      <select
                        value={task.status}
                        onChange={(e) =>
                          handleUpdate(task, {
                            status: e.target.value as TaskStatus,
                          })
                        }
                        onClick={(e) => e.stopPropagation()}
                        className="border rounded px-2 py-1 text-sm"
                      >
                        <option value="todo">To Do</option>
                        <option value="in-progress">In Progress</option>
                        <option value="done">Done</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
              Prev
            </button>
            <span className="text-sm text-gray-600">
              Page {page} of {pages} • {total} tasks
            </span>
            <button
              disabled={page === pages}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}

      {/* Modals */}
      {showTaskModal && selectedTask && (
        <TaskModal
          task={selectedTask}
          projectId={selectedTask.projectId.id}
          orgId={selectedTask.organizationId}
          onClose={() => {
            setShowTaskModal(false);
            setSelectedTask(null);
          }}
          onSuccess={(updatedTask) => {
            setTasks((prev) =>
              prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
            );
          }}
        />
      )}

      {showTaskDetail && selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onClose={() => {
            setShowTaskDetail(false);
            setSelectedTask(null);
          }}
        />
      )}

      {deleteTaskId && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm transform transition-transform duration-200 scale-95 animate-scale-in">
            <h2 className="text-lg font-semibold mb-4">Delete Task</h2>
            <p className="mb-4 text-gray-600">
              Are you sure you want to delete this task?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteTaskId(null)}
                className="px-4 py-2 border rounded hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
