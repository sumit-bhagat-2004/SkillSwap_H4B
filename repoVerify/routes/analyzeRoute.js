const express = require("express");
const router = express.Router();
const { analyzeRepo } = require("../controllers/analyzeController");

router.post("/", analyzeRepo);

module.exports = router;
