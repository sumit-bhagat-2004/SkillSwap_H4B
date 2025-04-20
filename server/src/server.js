import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDb } from "./db/db.js";
import http from "http";
import { Server } from "socket.io";
import userRoutes from "./routes/user.routes.js";
import requestRoutes from "./routes/request.routes.js";
import exchangeRoutes from "./routes/exchange.routes.js";

dotenv.config();

const PORT = process.env.PORT || 8000;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  origin: "http://systemnotfound.xyz",
});

app.use(
  cors({
    origin: "http://systemnotfound.xyz",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded());

app.use("/api/user", userRoutes);
app.use("/api/request", requestRoutes);
app.use("/api/exchange", exchangeRoutes);

io.on("connection", (socket) => {
  console.log(`user connected: ${socket.id}`);

  socket.on("join_room", (roomId) => {
    socket.join(roomId);
    socket.to(roomId).emit("user_joined", socket.id);
  });

  socket.on("offer", ({ offer, roomId }) => {
    socket.to(roomId).emit("receive_offer", offer);
  });

  socket.on("answer", ({ answer, roomId }) => {
    socket.to(roomId).emit("receive-answer", answer);
  });

  socket.on("ice-candidate", ({ candidate, roomId }) => {
    socket.to(roomId).emit("receive-candidate", candidate);
  });
});

server.listen(PORT, () => {
  connectDb()
    .then(() => {
      console.log(`Server running on port: ${PORT}`);
    })
    .catch((err) => console.log(`Error connecting to db ${err}`));
});
