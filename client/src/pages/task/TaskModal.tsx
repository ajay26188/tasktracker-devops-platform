import { useState, useEffect } from "react";
import { createTask, updateTask } from "../../services/task";
import type { Task, TaskPayload } from "../../types/task";
import axios from "axios";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../store";
import { alertMessageHandler } from "../../reducers/alertMessageReducer";
import FormLayout from "../../components/layouts/FormLayout";
import { authHeader } from "../../utils/auth";
import { apiBaseUrl } from "../../constants";
import type { User } from "../../types/user";

interface TaskModalProps {
  task: Task | null;
  projectId: string;
  onClose: () => void;
  onSuccess: (t: Task) => void;
  orgId: string;
}

interface TaskForm {
  title: string;
  description?: string;
  status: "todo" | "in-progress" | "done";
  priority?: "low" | "medium" | "high";
  dueDate?: string;
  assignedTo: User[]; 
}

const TaskModal: React.FC<TaskModalProps> = ({
  task,
  projectId,
  onClose,
  onSuccess,
  orgId,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  // Form state
  const [form, setForm] = useState<TaskForm>({
    title: task?.title || "",
    description: task?.description || "",
    status: task?.status || "todo",
    priority: task?.priority || "medium",
    dueDate: task?.dueDate?.slice(0, 10) || "",
    assignedTo: task?.assignedTo || [],
  });

  const [loading, setLoading] = useState(false);

  // Users autocomplete
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [userLoading, setUserLoading] = useState(false);

  // Initialize selectedUsers from task
  useEffect(() => {
    if (task?.assignedTo?.length) {
      setForm(prev => ({
        ...prev,
        assignedTo: task.assignedTo as User[], // ensure full objects
      }));
    }
  }, [task]);

  // Fetch users for autocomplete
  useEffect(() => {
    if (!search) return setUsers([]);

    const fetchUsers = async () => {
      try {
        setUserLoading(true);
        const res = await axios.get<User[]>(
          `${apiBaseUrl}/users/${orgId}?search=${encodeURIComponent(search)}`,
          authHeader()
        );
        setUsers(res.data);
      } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response) {
          dispatch(
            alertMessageHandler(
              { message: error.response.data.error, type: "error" },
              5
            )
          );
        } 
      } finally {
        setUserLoading(false);
      }
    };

    fetchUsers();
  }, [search, orgId, dispatch]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      if (task) {
        // --- EDIT TASK (PATCH) ---
        const payload: Partial<TaskPayload> = {};
  
        if (form.title !== task.title) payload.title = form.title;
        if (form.description !== task.description) payload.description = form.description;
        if (form.status !== task.status) payload.status = form.status;
        if (form.priority !== task.priority) payload.priority = form.priority;
        if (form.dueDate !== task.dueDate?.slice(0, 10)) payload.dueDate = form.dueDate;
        if (
          JSON.stringify(form.assignedTo.map(u => u.id)) !==
          JSON.stringify(task.assignedTo!.map(u => u.id))
        ) {
          payload.assignedTo = form.assignedTo.map(u => u.id);
        }
  
        // Only send payload if there's any change
        if (Object.keys(payload).length > 0) {
          const updated = await updateTask(task.id, payload);
          onSuccess(updated);
        }
  
      } else {
        // --- CREATE NEW TASK ---
        const payload = {
          ...form,
          assignedTo: form.assignedTo.map(u => u.id),
          projectId,
        };
  
        const created = await createTask(payload);
        onSuccess(created);
      }
  
      onClose();
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        dispatch(
          alertMessageHandler({ message: error.response.data.error, type: "error" }, 5)
        );
      } 
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl animate-fadeIn relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>

        <FormLayout
          title={task ? "Edit Task" : "New Task"}
          onSubmit={handleSubmit}
          variant="modal"
          fields={
            <>
              {/* Title */}
              <label className="flex flex-col">
                <span className="mb-1 text-sm font-medium">Title</span>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  className="border rounded px-3 py-2"
                />
              </label>

              {/* Description */}
              <label className="flex flex-col">
                <span className="mb-1 text-sm font-medium">Description</span>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="border rounded px-3 py-2"
                />
              </label>

              {/* Assign To */}
              <label className="flex flex-col relative">
                <span className="mb-1 text-sm font-medium">Assign To</span>
                <input
                  type="text"
                  placeholder="Type name of team member..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="border rounded px-3 py-2"
                />

                {userLoading && (
                  <div className="text-sm text-gray-500 mt-1">Loading...</div>
                )}

                {!userLoading && users.length > 0 && (
                  <ul className="absolute top-full left-0 z-10 bg-white border rounded w-full max-h-40 overflow-y-auto mt-1 shadow-md">
                    {users.map((u) => (
                      <li
                        key={u.id}
                        className="px-3 py-1 hover:bg-gray-200 cursor-pointer"
                        onClick={() => {
                          if (!form.assignedTo.find(x => x.id === u.id)) {
                            setForm({
                              ...form,
                              assignedTo: [...form.assignedTo, u],
                            });
                          }
                          setSearch("");
                          setUsers([]);
                        }}
                      >
                        {u.name} ({u.email})
                      </li>
                    ))}
                  </ul>
                )}

                {/* Selected users chips */}
                <div className="flex flex-wrap gap-2 mt-2">
                  {form.assignedTo.map((user) => (
                    <span
                      key={user.id}
                      className="flex items-center gap-1 px-2 py-1 bg-gray-200 rounded-full text-sm"
                    >
                      {user.name}
                      <button
                        type="button"
                        onClick={() => {
                          setForm({
                            ...form,
                            assignedTo: form.assignedTo.filter(u => u.id !== user.id),
                          });
                        }}
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              </label>

              {/* Status & Priority */}
              <div className="grid grid-cols-2 gap-4">
                <label className="flex flex-col">
                  <span className="mb-1 text-sm font-medium">Status</span>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="border rounded px-3 py-2"
                  >
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                </label>
                <label className="flex flex-col">
                  <span className="mb-1 text-sm font-medium">Priority</span>
                  <select
                    name="priority"
                    value={form.priority}
                    onChange={handleChange}
                    className="border rounded px-3 py-2"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </label>
              </div>

              {/* Due Date */}
              <label className="flex flex-col">
                <span className="mb-1 text-sm font-medium">Due Date</span>
                <input
                  type="date"
                  name="dueDate"
                  value={form.dueDate}
                  onChange={handleChange}
                  className="border rounded px-3 py-2"
                />
              </label>
            </>
          }
          actions={
            <div className="flex justify-end gap-2 pt-4 border-t">
              <button onClick={onClose} type="button" className="px-4 py-2 border rounded">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="px-5 py-2 bg-indigo-600 text-white rounded">
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          }
        />
      </div>
    </div>
  );
};

export default TaskModal;
