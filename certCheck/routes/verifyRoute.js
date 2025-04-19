const express = require("express");
const router = express.Router();
const verifyCertificate = require("../controllers/verifyController");

router.post("/", verifyCertificate);

module.exports = router;
