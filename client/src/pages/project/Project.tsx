import { useEffect, useState } from "react";
import { useParams,  useSearchParams } from "react-router-dom";
import { fetchProject } from "../../services/project";
import type { Project } from "../../types/project";
import type { Task } from "../../types/task";
import TaskModal from "../task/TaskModal";
import { useAuth } from "../../context/AuthContext";
import {
  Calendar,
  Clock,
  Users,
  Folder,
  Plus,
  Search,
  Building,
} from "lucide-react";
import TaskDetailModal from "../task/Task";

const ProjectPage: React.FC = () => {
  const { user } = useAuth();
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const [showTaskDetail, setShowTaskDetail] = useState(false);


  // persistent search using URL params
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("q") || "";

  useEffect(() => {
    const loadProject = async () => {
      if (!id) return;
      try {
        const data = await fetchProject(id);
        setProject(data);
      } catch {
        setError("Failed to load project");
      } finally {
        setLoading(false);
      }
    };
    loadProject();
  }, [id]);

  // Filter tasks by title or assignee
  const filteredTasks =
    project?.tasks?.filter((task) => {
      if (typeof task === "string") return false;
      const query = search.toLowerCase();
      return (
        task.title?.toLowerCase().includes(query) ||
        task.assignedTo?.some((u) => u.name?.toLowerCase().includes(query))
      );
    }) || [];

  // Task stats
  const getTaskStats = () => {
    if (!project?.tasks) return { todo: 0, inprogress: 0, done: 0 };
    return project.tasks.reduce(
      (acc, task: string | Partial<Task>) => {
        if (typeof task === "object" && task.status) {
          if (task.status === "done") acc.done += 1;
          else if (task.status === "in-progress") acc.inprogress += 1;
          else acc.todo += 1;
        }
        return acc;
      },
      { todo: 0, inprogress: 0, done: 0 }
    );
  };

  const { todo, inprogress, done } = getTaskStats();

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse space-y-6 w-full max-w-4xl">
          <div className="h-48 bg-gray-200 rounded-2xl"></div>
          <div className="h-32 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    );

  if (error) return <p className="p-6 text-red-600">{error}</p>;
  if (!project) return <p className="p-6 text-gray-500">Project not found.</p>;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-9xl mx-auto space-y-10">
       {/* Project Overview Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          {/* Hero Header */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-white/20 text-white text-2xl font-bold shadow-inner">
                {project.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-3xl font-extrabold text-white">{project.name}</h1>
                <p className="text-indigo-100">{project.description}</p>
              </div>
            </div>
          </div>

          {/* Project Details */}
          <div className="p-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Folder className="w-4 h-4 text-indigo-500" />
              <span className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-medium">
                Project ID: {project.id}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-green-500" />
              <span>
                <strong>Start:</strong> {project.startDate?.slice(0, 10) || "-"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-red-500" />
              <span>
                <strong>End:</strong> {project.endDate?.slice(0, 10) || "-"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-500" />
              <span>
                <strong>Created By:</strong>{" "}
                {typeof project.createdBy === "object"
                  ? project.createdBy?.name
                  : "N/A"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-gray-600" />
              <span>
                <strong>Organization:</strong> {project.organizationId}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-500" />
              <span>
                <strong>Created:</strong> {project.createdAt?.slice(0, 10) || "-"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-500" />
              <span>
                <strong>Updated:</strong> {project.updatedAt?.slice(0, 10) || "-"}
              </span>
            </div>
          </div>
        </div>
 

        {/* Task Section */}
        <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
            <h2 className="text-2xl font-bold text-gray-800">
              Tasks
              <span className="ml-3 text-sm text-gray-500 font-normal">
                {todo} To Do · {inprogress} In Progress · {done} Done
              </span>
            </h2>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search task by title or assignee"
                  value={search}
                  onChange={(e) =>
                    setSearchParams(
                      e.target.value ? { q: e.target.value } : {},
                      { replace: true } //this prevents spamming history
                    )
                  }
                  className="w-64 pl-8 pr-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              {user?.role === "admin" && (
                <button
                  className="flex items-center gap-2 px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow transition"
                  onClick={() => setShowTaskModal(true)}
                >
                  <Plus className="w-4 h-4" />
                  Add Task
                </button>
              )}
            </div>
          </div>

          {filteredTasks.length > 0 ? (
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredTasks.map((task, index) =>
                typeof task === "string" ? (
                  <li
                    key={task}
                    className="p-4 border rounded-lg bg-gray-50 text-gray-600"
                  >
                    Task ID: {task}
                  </li>
                ) : (
                  <li
                    key={task.id || index}
                    className={`p-5 border rounded-xl bg-white shadow-sm transition cursor-pointer hover:shadow-xl hover:scale-[1.01] border-l-4 ${
                      task.status === "done"
                        ? "border-green-500"
                        : task.status === "in-progress"
                        ? "border-yellow-500"
                        : "border-gray-400"
                    }`}
                    onClick={() => {
                      setSelectedTask(task);
                      setShowTaskDetail(true);
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-indigo-700 hover:underline text-lg">
                        {task.title}
                      </span>
                      <span
                        className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                          task.status === "done"
                            ? "bg-green-100 text-green-700"
                            : task.status === "in-progress"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {task.status || "To Do"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {task.description}
                    </p>
                  </li>

                )
              )}
            </ul>
          ) : (
            <p className="text-gray-500 italic">No tasks found.</p>
          )}

          {showTaskModal && (
            <TaskModal
              task={null}
              projectId={project.id}
              orgId={project.organizationId}
              onClose={() => setShowTaskModal(false)}
              onSuccess={(newTask) => {
                setProject((prev) =>
                  prev
                    ? { ...prev, tasks: [...(prev.tasks || []), newTask] }
                    : prev
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

        </div>
      </div>
    </div>
  );
};

export default ProjectPage;
