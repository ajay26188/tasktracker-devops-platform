import { useCallback, useEffect, useRef, useState } from "react";
import type { PaginatedTasks, Task } from "../../types/task";
import { useAuth } from "../../context/AuthContext";
import { fetchTasksByOrg, fetchTasksByUser } from "../../services/task";
import ChatWindow from "./ChatWindow";

const Comments = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const limit = 9;
  const listRef = useRef<HTMLDivElement | null>(null);

  const loadTasks = useCallback(
    async (currentPage: number, append = false) => {
      if (!user) return;
      setLoading(true);
      try {
        const data: PaginatedTasks =
          user.role === "admin"
            ? await fetchTasksByOrg(
                user.organizationId,
                currentPage,
                limit,
                search
              )
            : await fetchTasksByUser(currentPage, limit, search);

        setTasks((prev) => (append ? [...prev, ...data.tasks] : data.tasks));
        setPages(data.pages);
      } catch {
        setError("Failed to fetch tasks. Please check your connection.");
      } finally {
        setLoading(false);
      }
    },
    [user, search]
  );

  useEffect(() => {
    setPage(1);
    loadTasks(1);
  }, [loadTasks]);

  // Auto-select first task when tasks are loaded
  useEffect(() => {
    if (tasks.length > 0 && !selectedTask) {
      setSelectedTask(tasks[0]);
    }
  }, [tasks, selectedTask]);

  const handleLoadMore = async () => {
    if (page < pages && listRef.current) {
      const prevScroll = listRef.current.scrollTop;
      const prevHeight = listRef.current.scrollHeight;

      const nextPage = page + 1;
      setPage(nextPage);
      await loadTasks(nextPage, true);

      requestAnimationFrame(() => {
        if (listRef.current) {
          const newHeight = listRef.current.scrollHeight;
          listRef.current.scrollTop = prevScroll + (newHeight - prevHeight);
        }
      });
    }
  };

  return (
    <div className="flex h-screen">
      {/* LEFT: Task List (for comments) */}
      <aside className="w-96 flex flex-col bg-gray-50 border-r shadow-inner">
        <div className="p-5 border-b bg-gradient-to-r from-indigo-500 to-purple-500 text-white flex flex-col gap-3">
          <h2 className="text-2xl font-bold">Comments</h2>
          <p className="text-sm opacity-90">Find tasks and view discussions</p>
          <input
            type="text"
            placeholder="🔍 Search tasks by title or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-2 text-sm border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-300 bg-white text-gray-900 placeholder-gray-400"
          />
        </div>

        <div
          ref={listRef}
          className="flex-1 overflow-y-auto p-4 space-y-4"
        >
          {loading &&
            [...Array(5)].map((_, i) => (
              <div
                key={i}
                className="p-4 bg-white rounded-lg shadow-sm border-l-4 border-indigo-300 animate-pulse"
              >
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))}

          {error && <p className="text-red-500">{error}</p>}

          {!loading && tasks.length === 0 && !error && (
            <p className="text-gray-400 text-sm">No tasks found.</p>
          )}

          {!loading &&
            tasks.map((task) => {
              const isSelected = selectedTask?.id === task.id;
              return (
                <div
                  key={task.id}
                  onClick={() => setSelectedTask(task)}
                  className={`p-4 rounded-lg shadow-sm border-l-4 cursor-pointer transition hover:shadow-md
                    ${task.status === "done"
                      ? "border-green-400"
                      : task.status === "in-progress"
                      ? "border-blue-400"
                      : "border-gray-300"}
                    ${isSelected ? "bg-indigo-100 border-indigo-500" : "bg-white"}
                  `}
                >
                  <h4 className="text-gray-800 font-semibold">{task.title}</h4>
                  <p className="text-xs text-gray-500 mt-1">ID: {task.id}</p>
                </div>
              );
            })}

          {!loading && page < pages && tasks.length > 0 && (
            <button
              onClick={handleLoadMore}
              className="w-full py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition"
            >
              Load More
            </button>
          )}
        </div>
      </aside>

      {/* RIGHT: Chat Window */}
      <main className="flex-1">
        {selectedTask ? (
          <ChatWindow task={selectedTask} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            Select a task to view comments
          </div>
        )}
      </main>
    </div>
  );
};

export default Comments;
