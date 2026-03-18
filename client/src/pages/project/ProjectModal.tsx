import { useState } from "react";
import { createProject, updateProject } from "../../services/project";
import type { Project } from "../../types/project";
import axios from "axios";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../store";
import { alertMessageHandler } from "../../reducers/alertMessageReducer";
import FormLayout from "../../components/layouts/FormLayout";

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
  onSuccess: (p: Project) => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  onClose,
  onSuccess,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [form, setForm] = useState({
    name: project?.name || "",
    description: project?.description || "",
    startDate: project?.startDate?.slice(0, 10) || "",
    endDate: project?.endDate?.slice(0, 10) || "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const saved = project
        ? await updateProject(project.id, form)
        : await createProject(form);

      onSuccess(saved);
      onClose();
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        console.error("Error response data:", error.response?.data);

        dispatch(
          alertMessageHandler(
            { message: error.response.data.error, type: "error" },
            5
          )
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // form fields
  const fields = (
    <>
      {/* Name */}
      <label className="flex flex-col">
        <span className="mb-1 text-sm font-medium text-gray-700">
          Project Name
        </span>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Enter project name"
          className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          required
        />
      </label>

      {/* Description */}
      <label className="flex flex-col">
        <span className="mb-1 text-sm font-medium text-gray-700">
          Description
        </span>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Brief description of the project"
          className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          rows={3}
          required
        />
      </label>

      {/* Dates */}
      <div className="flex gap-4">
        <label className="flex flex-col w-1/2">
          <span className="mb-1 text-sm font-medium text-gray-700">
            Start Date
          </span>
          <input
            type="date"
            name="startDate"
            value={form.startDate}
            onChange={handleChange}
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            required
          />
        </label>
        
        <label className="flex flex-col w-1/2">
          <span className="mb-1 text-sm font-medium text-gray-700">
            End Date
          </span>
          <input
            type="date"
            name="endDate"
            value={form.endDate}
            onChange={handleChange}
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            required
          />
        </label>
      </div>
    </>
  );

  // form actions
  const actions = (
    <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
      <button
        type="button"
        onClick={onClose}
        className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition-colors"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={loading}
        className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
      >
        {loading ? "Saving..." : "Save"}
      </button>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg transform transition-all duration-300 scale-95 opacity-0 animate-fadeIn">
        {/* Close Button */}
        <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        <FormLayout
          title={project ? "Edit Project" : "New Project"}
          fields={fields}
          actions={actions}
          onSubmit={handleSubmit}
          variant="modal"
        />
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.25s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ProjectModal;
