
import { io } from "socket.io-client";

const BACKEND_URL = 
  import.meta.env.MODE === "production" 
    ? "https://marjorie-aguarin.onrender.com"
    : "http://localhost:5000";

export const socket = io(BACKEND_URL, {
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