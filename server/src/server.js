import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDb } from "./db/db.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.listen(PORT, () => {
  connectDb()
    .then(() => {
      console.log(`Server running on port: ${PORT}`);
    })
    .catch((err) => console.log(`Error connecting to db ${err}`));
});
