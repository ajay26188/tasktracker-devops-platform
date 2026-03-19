// src/socket.ts
import { io } from "socket.io-client";

const URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:3000"
    : window.location.origin;

export const socket = io(URL, {
  withCredentials: true,
  path: "/socket.io",
});