// src/components/FormLayout.tsx

import type { ReactNode } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import AlertMessage from "../AlertMessage";

type FormLayoutProps = {
  title: string;
  fields: ReactNode;
  actions: ReactNode;
  onSubmit?: (e: React.FormEvent) => void;
  variant?: "page" | "modal"; // new prop
};

const FormLayout = ({
  title,
  fields,
  actions,
  onSubmit,
  variant = "page",
}: FormLayoutProps) => {
  const alertMessage = useSelector((state: RootState) => state.alertMessage);

  if (variant === "modal") {
    return (
      <form onSubmit={onSubmit} className="px-6 py-4 space-y-5">
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        {fields}
        {alertMessage.message && <AlertMessage {...alertMessage} />}
        {actions}
      </form>
    );
  }

  // fallback - full page (default layout)
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="flex flex-col items-center space-y-6">
        {/* Brand header (icon + gradient title) */}
        <div className="flex items-center gap-2">
          <span className="text-indigo-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </span>
          <h1 className="text-2xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            TaskTracker
          </h1>
        </div>

        {/* Form box */}
        <form
          onSubmit={onSubmit}
          className="w-96 bg-white p-10 rounded-3xl shadow-2xl space-y-6"
        >
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
            {title}
          </h2>

          {fields}

          {alertMessage.message && <AlertMessage {...alertMessage} />}

          {actions}
        </form>
      </div>
    </div>
  );
};

export default FormLayout;
