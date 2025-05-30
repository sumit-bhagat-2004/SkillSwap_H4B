import { io } from "socket.io-client"

const socket = io("http://localhost:6500", {
  transports: ["websocket", "polling"],
})

// Debug logs
socket.on("connect", () => {
  console.log("✅ Connected to server. Socket ID:", socket.id)
})

socket.on("connect_error", (err) => {
  console.error("❌ Connection error:", err.message)
})

export default socket
