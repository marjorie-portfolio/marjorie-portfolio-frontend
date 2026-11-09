
import { io } from "socket.io-client";

export const socket = io(import.meta.env.VITE_API_URL, {
  withCredentials: true,
});

socket.on("connect", () => {
  console.log("SOCKET CONNECTED:", socket.id);
});

socket.on("connect_error", (error) => {
  console.error("SOCKET CONNECTION ERROR:", error.message);
});

socket.on("disconnect", (reason) => {
  console.log("SOCKET DISCONNECTED:", reason);
});

socket.on("test-event", (data) => {
  console.log("TEST EVENT RECEIVED:", data);
});