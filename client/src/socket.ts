// src/socket.ts

import { io } from "socket.io-client";

const URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:3000" // backend dev server
    : "https://tasktracker-fr5h.onrender.com"; // prod backend URL

export const socket = io(URL, {
  withCredentials: true,
});
