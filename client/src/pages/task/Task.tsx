import {
  Calendar,
  Users,
  ClipboardList,
  Clock,
  RefreshCcw,
  Folder,
  Hash,
} from "lucide-react";
import type { Task } from "../../types/task";

type TaskDetailModalProps = {
  task: Task;
  onClose: () => void;
};

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ task, onClose }) => {
  console.log(task);
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-y-auto max-h-[90vh]">
        <div className="p-6 relative">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>

          {/* Header */}
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {task.title}
            </h2>
            <div className="flex flex-wrap gap-2">
              <span
                className={`px-3 py-1 text-sm rounded-full ${
                  task.status === "done"
                    ? "bg-green-100 text-green-700"
                    : task.status === "in-progress"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {task.status}
              </span>
              <span
                className={`px-3 py-1 text-sm rounded-full ${
                  task.priority === "high"
                    ? "bg-red-100 text-red-700"
                    : task.priority === "medium"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {task.priority || "No priority"}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <ClipboardList className="w-4 h-4" /> Description
            </h3>
            <p className="text-gray-600">
              {task.description || "No description available."}
            </p>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-sm text-gray-700">
            <div className="flex items-center gap-2">
                <Hash className="w-4 h-4 text-gray-500" />
                <strong>ID:</strong> {task.id}
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <strong>Due:</strong>{" "}
              {task.dueDate ? task.dueDate.slice(0, 10) : "-"}
            </div>
            <div className="flex items-center gap-2">
              <Folder className="w-4 h-4 text-gray-500" />
              <strong>Project:</strong> {task.projectId.name}
            </div>
            <div className="flex items-center gap-2">
                <span role="img" aria-label="building">🏢</span>
                <strong>Organization:</strong> {task.organizationId}
            </div>

            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <strong>Created:</strong>{" "}
              {task.createdAt
                ? new Date(task.createdAt).toLocaleString()
                : "-"}
            </div>
            <div className="flex items-center gap-2">
              <RefreshCcw className="w-4 h-4 text-gray-500" />
              <strong>Updated:</strong>{" "}
              {task.updatedAt
                ? new Date(task.updatedAt).toLocaleString()
                : "-"}
            </div>
          </div>

          {/* Assigned Users */}
          {task.assignedTo && task.assignedTo.length > 0 && (
            <div className="bg-indigo-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                <Users className="w-4 h-4" /> Assigned Users
              </h3>
              <ul className="space-y-1 text-gray-700">
                {task.assignedTo.map((user) => (
                  <li
                    key={user.id}
                    className="flex items-center gap-2 text-sm"
                  >
                    <span className="font-medium">{user.name}</span>{" "}
                    <span className="text-gray-500">({user.email})</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;
