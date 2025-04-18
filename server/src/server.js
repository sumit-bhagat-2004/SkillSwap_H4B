import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDb } from "./db/db.js";
import userRoutes from "./routes/user.routes.js";
import http from "http";
import { Server } from "socket.io";

dotenv.config();

const PORT = process.env.PORT || 8000;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  origin: "http://localhost:5173",
});

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded());

app.use("/api/user", userRoutes);

app.get("/", (req, res) => {
  res.send("Hello world");
});

io.on("connection", (socket) => {
  console.log(`user connected: ${socket.id}`);

  socket.on("join_room", (roomId) => {
    socket.join(roomId);
    socket.to(roomId).emit("user_joined", socket.id);
  });
});

server.listen(PORT, () => {
  connectDb()
    .then(() => {
      console.log(`Server running on port: ${PORT}`);
    })
    .catch((err) => console.log(`Error connecting to db ${err}`));
});
