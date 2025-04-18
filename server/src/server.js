import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDb } from "./db/db.js";
import userRoutes from "./routes/user.routes.js";

dotenv.config();

const PORT = process.env.PORT || 8000;

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded());

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.use("/api/user", userRoutes);

app.listen(PORT, () => {
  connectDb()
    .then(() => {
      console.log(`Server running on port: ${PORT}`);
    })
    .catch((err) => console.log(`Error connecting to db ${err}`));
});
