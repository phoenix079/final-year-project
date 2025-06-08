const express = require("express");
const router = express.Router();
const { processFileWithML } = require("../controllers/mlController");

// Process file with ML model
router.post("/process/:id", processFileWithML);

module.exports = router;
