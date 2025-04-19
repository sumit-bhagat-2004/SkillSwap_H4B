const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const verifyRoute = require("./routes/verifyRoute");

dotenv.config();
const app = express();

app.use(express.json());
app.use("/api", verifyRoute);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(5000, () => console.log("Server running on port 5000"));
  })
  .catch(err => console.error("MongoDB connection error:", err));
