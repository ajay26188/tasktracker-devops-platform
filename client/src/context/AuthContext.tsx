/* eslint-disable react-refresh/only-export-components */

import { createContext, useContext, useEffect } from "react";
import type { ReactNode } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import type { User } from "../reducers/loggedUserReducer";

import { socket } from "../socket";
import { addNotification } from "../reducers/notificationReducer";
import type { Notification } from "../types/notification";

type AuthContextType = {
  user: User;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const user = useSelector((state: RootState) => state.user.currentUser);
  const dispatch = useDispatch<AppDispatch>();

  const value: AuthContextType = {
    user,
  };

  // Global socket listener — runs for the entire app
  useEffect(() => {
    if (!user) return;

    // tell server which user just logged in
    socket.emit("loggedInUser", user.id);

    const handleNewNotification = (newNotification: Notification) => {
      if (String(newNotification.userId) === String(user.id)) {
        dispatch(addNotification(newNotification)); // update Redux
      }
    };

    socket.on("newNotification", handleNewNotification);

    return () => {
      socket.off("newNotification", handleNewNotification);
    };
  }, [user, dispatch]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
