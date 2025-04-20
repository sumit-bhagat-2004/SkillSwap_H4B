require("dotenv").config();
const express = require("express");
const app = express();
const analyzeRoute = require("./routes/analyzeRoute");

app.use(express.json());
app.use("/api/analyze", analyzeRoute);

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
