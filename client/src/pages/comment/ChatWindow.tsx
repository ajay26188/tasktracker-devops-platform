import { useEffect, useRef, useState } from "react";
import { fetchComments, addComment, deleteComment } from "../../services/comment";
import type { Comment } from "../../types/comment";
import { useAuth } from "../../context/AuthContext";
import { socket } from "../../socket";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { alertMessageHandler } from "../../reducers/alertMessageReducer";
import type { AppDispatch } from "../../store";
import AlertMessage from "../../components/AlertMessage";
import type { RootState } from "../../store";

interface ChatWindowProps {
  task: { id: string; title: string };
}

const ChatWindow = ({ task }: ChatWindowProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const alertMessage = useSelector((state: RootState) => state.alertMessage);
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [message, setMessage] = useState("");
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);

  // Scroll to bottom whenever comments change
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [comments]);

  // Fetch comments on mount
  useEffect(() => {
    fetchComments(task.id).then(setComments);
    socket.emit("joinTask", task.id);
    return () => {
      socket.emit("leaveTask", task.id);
    };
  }, [task.id]);

  // Socket listeners
  useEffect(() => {
    socket.on("commentAdded", (newComment: Comment) => {
      if (newComment.taskId === task.id) {
        setComments((prev) => [
          ...prev,
          {
            ...newComment,
            userId:
              typeof newComment.userId === "string"
                ? { _id: user!.id, name: user!.name }
                : newComment.userId,
          },
        ]);
      }
    });

    socket.on("commentDeleted", (deletedId: string) => {
      setComments((prev) => prev.filter((c) => c.id !== deletedId));
    });

    return () => {
      socket.off("commentAdded");
      socket.off("commentDeleted");
    };
  }, [task.id, user]);

  // Send a new comment
  const handleSend = async () => {
    if (!message.trim()) return;
    await addComment({ taskId: task.id, comment: message } as Comment);
    setMessage("");
  };

  const handleDelete = async (id: string) => {
    try {
        await deleteComment(id);
        setSelectedMessageId(null);
    } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response) {
            console.log(error.response.data);
          dispatch(
            alertMessageHandler({ message: error.response.data.error, type: "error" }, 2)
          );
        } else {
          dispatch(alertMessageHandler({ message: "Unauthorized.", type: "error" }, 2));
        }
    } 
  };

  // Utility: get initials from name
  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-indigo-500 text-white relative">
        
        <h3 className="font-semibold text-center w-full">{task.title}</h3>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {comments.map((c) => {
          const initials = getInitials(
            typeof c.userId === "object" && c.userId && "name" in c.userId
              ? c.userId.name
              : "U"
          );

          const formattedTime = c.createdAt
            ? new Date(c.createdAt).toLocaleString()
            : "";

          return (
            <div key={c.id} className="flex items-start space-x-2">
              {/* Avatar */}
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-indigo-300 text-white font-semibold">
                {initials}
              </div>

              {/* Message content */}
              <div className="max-w-xs">
                {/* Name + Time */}
                <div className="text-xs text-gray-500 mb-1">
                  {typeof c.userId === "object" && c.userId && "name" in c.userId
                    ? c.userId.name
                    : "Unknown"}{" "}
                  • {formattedTime}
                </div>

                {/* Message bubble */}
                <div
                  onClick={() =>
                    setSelectedMessageId((prev) => (prev === c.id ? null : c.id))
                  }
                  className="p-3 rounded-lg shadow relative bg-white border cursor-pointer"
                >
                  <p>{c.comment}</p>
                  {selectedMessageId === c.id && (
                    <button
                      onClick={() => handleDelete(c.id!)}
                      className="absolute -bottom-5 right-0 text-xs text-red-400 hover:text-red-600"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      {alertMessage.message && <AlertMessage {...alertMessage} />}

      {/* Input */}
      <div className="p-3 border-t bg-white flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <button
          onClick={handleSend}
          className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
