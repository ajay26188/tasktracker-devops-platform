import { useEffect, useState } from "react";
import {
  fetchProjectsByOrg,
  fetchAssignedProjects,
  deleteProject,
} from "../../services/project";
import ProjectModal from "./ProjectModal";
import type { Project } from "../../types/project";
import { Link } from "react-router-dom";
import TaskModal from "../task/TaskModal";
import { useAuth } from "../../context/AuthContext";

type StatusFilter = "all" | "completed" | "active" | "upcoming";

const Projects: React.FC = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [deleteProjectId, setDeleteProjectId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  //For adding new task
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedProjectForTask, setSelectedProjectForTask] = useState<Project | null>(null);

  // Load projects
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = user?.role === 'admin'
          ? await fetchProjectsByOrg(user?.organizationId)
          : await fetchAssignedProjects();

        setProjects(data);
        setFilteredProjects(data);
      } catch {
        setError("Failed to fetch projects. Please check your connection.");
      } finally {
        setLoading(false);
      }
    };
    loadProjects();
  }, [user]);

  // Filter projects based on search & status
  useEffect(() => {
    let filtered = [...projects];

    if (search.trim()) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      const now = new Date();
      filtered = filtered.filter((p) => {
        const start = p.startDate ? new Date(p.startDate) : null;
        const end = p.endDate ? new Date(p.endDate) : null;
        if (statusFilter === "active") return start && end && start <= now && end >= now;
        if (statusFilter === "completed") return end && end < now;
        if (statusFilter === "upcoming") return start && start > now;
        return true;
      });
    }

    setFilteredProjects(filtered);
  }, [search, statusFilter, projects]);

  // Helper to get status badge
  const getStatusBadge = (project: Project) => {
    const now = new Date();
    const start = project.startDate ? new Date(project.startDate) : null;
    const end = project.endDate ? new Date(project.endDate) : null;

    if (end && end < now)
      return <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-semibold">Completed</span>;
    if (start && start > now)
      return <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-semibold">Upcoming</span>;
    return <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">Active</span>;
  };

  const getProjectProgress = (project: Project) => {
    if (!project.tasks || project.tasks.length === 0) return 0;
  
    const doneTasks = project.tasks.filter(
      (t) => typeof t !== "string" && t.status === "done"
    ).length;
    const totalTasks = project.tasks.length;
  
    return Math.round((doneTasks / totalTasks) * 100);
  };
  

  // Skeleton loader
  const renderSkeleton = () => (
    <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, idx) => (
        <div key={idx} className="p-5 rounded-2xl bg-gray-200 animate-pulse h-48"></div>
      ))}
    </div>
  );

  return (
    <div className="p-6">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
            🚀 Projects
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage, track, and create projects with ease
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="🔍 Search projects by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 min-w-[250px]"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            className="border rounded px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="upcoming">Upcoming</option>
          </select>
          {user?.role === "admin" && (
            <button
              onClick={() => {
                setSelectedProject(null);
                setShowModal(true);
              }}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2 rounded-full hover:opacity-90 transition shadow-md"
            >
              + New Project
            </button>
          )}
        </div>
      </div>


      {/* Loading & Empty States */}
      {loading ? (
        renderSkeleton()
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : filteredProjects.length === 0 ? (
        <p className="text-gray-500">No projects found.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <Link
              key={project.id}
              to={`/projects/project/${project.id}`}
              className="relative block bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 p-5 border border-gray-100 overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-t-2xl"></div>

              <div className="mt-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-800 mb-2">{project.name}</h2>
                  {getStatusBadge(project)}
                </div>
                <p className="text-sm text-gray-500 line-clamp-3">{project.description}</p>

                {/* Progress bar */}
                <div className="mt-3">
                  <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-2 bg-indigo-600 rounded-full transition-all"
                      style={{ width: `${getProjectProgress(project)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {getProjectProgress(project)}% completed
                  </p>
                </div>

                <div className="mt-3 text-sm text-gray-400 flex justify-between">
                  <span>📅 {project.startDate?.slice(0, 10) || "-"}</span>
                  <span>⏰ {project.endDate?.slice(0, 10) || "-"}</span>
                </div>
              </div>

              {user?.role === 'admin'  && (
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedProject(project);
                      setShowModal(true);
                    }}
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium transition-colors"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setDeleteProjectId(project.id);
                    }}
                    className="flex items-center gap-1 text-red-600 hover:text-red-800 font-medium transition-colors"
                  >
                    🗑️ Delete
                  </button>
                  <button
                    onClick={(e) => {
                        e.preventDefault();
                        setSelectedProjectForTask(project);
                        setShowTaskModal(true);
                    }}
                    className="flex items-center gap-1 text-green-600 hover:text-green-800 font-medium transition-colors"
                    >
                    ➕ Task
                    </button>

                </div>
              )}
            </Link>
          ))}
        </div>
      )}

      {/* Project Modal */}
      {showModal && (
        <ProjectModal
        project={selectedProject}
        onClose={() => setShowModal(false)}
        onSuccess={(p) => {
          if (selectedProject) {
            // merge tasks from existing project if missing
            setProjects((prev) =>
              prev.map((proj) =>
                proj.id === p.id ? { ...p, tasks: proj.tasks ?? [] } : proj
              )
            );
          } else {
            setProjects((prev) => [p, ...prev]);
          }
        }}
      />
      )}

      {/* Delete Confirmation Modal */}
      {deleteProjectId && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm transform transition-transform duration-200 scale-95 animate-scale-in">
            <h2 className="text-lg font-semibold mb-4">Delete Project</h2>
            <p className="mb-4 text-gray-600">
              Are you sure you want to delete this project?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteProjectId(null)}
                className="px-4 py-2 border rounded hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (deleteProjectId) {
                    try {
                      await deleteProject(deleteProjectId);
                      setProjects((prev) =>
                        prev.filter((p) => p.id !== deleteProjectId)
                      );
                    } catch (err) {
                      console.error("Delete failed", err);
                    } finally {
                      setDeleteProjectId(null);
                    }
                  }
                }}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {showTaskModal && selectedProjectForTask && (
                <TaskModal
                    task={null}
                    projectId={selectedProjectForTask.id}
                    orgId={selectedProjectForTask.organizationId
                    }
                    onClose={() => {
                    setShowTaskModal(false);
                    setSelectedProjectForTask(null);
                    }}
                    onSuccess={(newTask) => {
                    setProjects((prev) =>
                        prev.map((p) =>
                        p.id === selectedProjectForTask.id
                            ? { ...p, tasks: [...(p.tasks || []), newTask] }
                            : p
                        )
                    );
                    }}
                />
                )}
    </div>
  );
};

export default Projects;
