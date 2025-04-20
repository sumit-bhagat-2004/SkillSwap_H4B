import { io } from "socket.io-client";

const socket = io("https://skillswap-h4b.onrender.com", {
  transports: ["websocket", "polling"],
});

// Debug logs
socket.on("connect", () => {
  console.log("✅ Connected to server. Socket ID:", socket.id);
});

socket.on("connect_error", (err) => {
  console.error("❌ Connection error:", err.message);
});

export default socket;
