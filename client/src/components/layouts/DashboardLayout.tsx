import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  CheckSquare,
  MessageSquare,
  Bell,
  LogOut,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store";
import { clearUser } from "../../reducers/loggedUserReducer";
import { useNavigate } from "react-router-dom";
import Notifications from "../Notifications";
import { loadNotifications } from "../../reducers/notificationReducer";
import PersonalProfileModal from "../../pages/PersonalProfile";

type NavItem = {
  label: string;
  icon: React.ReactNode;
  href: string;
};

const DashboardLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [active, setActive] = useState("Dashboard");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  // Load notifications once
  useEffect(() => {
    dispatch(loadNotifications());
  }, [dispatch]);

  const notifications = useSelector((state: RootState) => state.notifications.notifications);
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  if (!currentUser) return <p>Loading...</p>;

  const initials = currentUser.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const isAdmin = currentUser.role === "admin";

  const navItems: NavItem[] = isAdmin
    ? [
        { label: "Dashboard", icon: <LayoutDashboard size={18} />, href: "/dashboard" },
        { label: "Users", icon: <Users size={18} />, href: "/users" },
        { label: "Projects", icon: <FolderKanban size={18} />, href: "/projects" },
        { label: "Tasks", icon: <CheckSquare size={18} />, href: "/tasks" },
        { label: "Comments", icon: <MessageSquare size={18} />, href: "/comments" },
      ]
    : [
        { label: "Dashboard", icon: <LayoutDashboard size={18} />, href: "/dashboard" },
        { label: "My Tasks", icon: <CheckSquare size={18} />, href: "/tasks" },
        { label: "My Projects", icon: <FolderKanban size={18} />, href: "/projects" },
        { label: "Comments", icon: <MessageSquare size={18} />, href: "/comments" },
      ];

  const handleLogOut = () => {
    dispatch(clearUser());
    window.localStorage.removeItem("loggedUser");
    navigate("/login");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md flex-shrink-0 flex flex-col h-full">
        <div className="p-6 border-b flex items-center gap-2">
          <span className="text-indigo-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </span>
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 tracking-wide">
            TaskTracker
          </h1>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                setActive(item.label);
                navigate(item.href);
              }}
              className={`flex items-center gap-2 w-full text-left p-2 rounded-lg transition ${
                active === item.label ? "bg-indigo-100 text-indigo-600 font-medium" : "hover:bg-gray-100"
              }`}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="flex items-center justify-between bg-white shadow px-6 py-4 flex-shrink-0">
          <h1 className="text-xl font-semibold">{active}</h1>

          <div className="flex items-center gap-4 relative">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setDropdownOpen(false);
                }}
                className="relative w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
              >
                <Bell size={20} />
                {notifications!.some(n => !n.isRead) && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Notifications />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Avatar Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setDropdownOpen(!dropdownOpen);
                  setShowNotifications(false);
                }}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-indigo-500 text-white font-semibold shadow hover:opacity-90 transition"
              >
                {initials}
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -5 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-48 bg-white border shadow rounded-lg overflow-hidden z-50"
                  >
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        setProfileModalOpen(true);
                      }}
                      className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      <Users size={16} /> Profile
                    </button>
                    <button
                      onClick={handleLogOut}
                      className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <PersonalProfileModal
              isOpen={profileModalOpen}
              onClose={() => setProfileModalOpen(false)}
            />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
