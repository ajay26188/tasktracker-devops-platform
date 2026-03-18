import type { AlertState } from "../reducers/alertMessageReducer";

const AlertMessage = ({ message, type }: AlertState) => {
  if (!message) return null;

  const baseStyle = "p-3 rounded-lg mb-4 text-sm font-medium";
  const typeStyles: Record<string, string> = {
    success: "bg-green-100 text-green-800 border border-green-300",
    error: "bg-red-100 text-red-800 border border-red-300",
    info: "bg-blue-100 text-blue-800 border border-blue-300",
  };

  return (
    <div className={`${baseStyle} ${typeStyles[type]}`}>
      {message}
    </div>
  );
};

export default AlertMessage;
