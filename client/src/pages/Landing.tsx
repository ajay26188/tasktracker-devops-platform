import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  const options = [
    {
      title: "Login",
      description: "Access your account if you are already registered.",
      color: "bg-blue-500",
      hover: "hover:bg-blue-600",
      path: "/login",
    },
    {
      title: "Sign Up",
      description: "Create an account to join your organization.",
      color: "bg-green-500",
      hover: "hover:bg-green-600",
      path: "/signup",
    },
    {
      title: "Add Organization",
      description: "Create a new organization.",
      color: "bg-purple-500",
      hover: "hover:bg-purple-600",
      path: "/addOrg",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-indigo-50 via-white to-pink-50">
      <div className="flex flex-col items-center mb-6">
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-indigo-500"
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
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            TaskTracker
          </h1>
        </div>
      </div>

      <p className="text-gray-600 mb-12 text-center max-w-xl">
        Manage your organization's tasks efficiently. Get started by logging in, signing up, or creating your organization.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6 md:px-0">
        {options.map((option) => (
          <div
            key={option.title}
            className={`cursor-pointer ${option.color} ${option.hover} text-white rounded-3xl shadow-xl p-10 transition transform hover:-translate-y-3 hover:shadow-2xl`}
            onClick={() => navigate(option.path)}
          >
            <h2 className="text-2xl md:text-3xl font-semibold mb-3">{option.title}</h2>
            <p className="text-sm md:text-base">{option.description}</p>
          </div>
        ))}
      </div>

      <p className="mt-16 text-gray-500 text-sm text-center">
        Select an option above to get started quickly.
      </p>
    </div>
  );
};

export default Landing;
