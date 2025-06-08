const express = require("express");
const router = express.Router();
const { handleFileUpload } = require("../middlewares/upload");
const {
  uploadFiles,
  getFiles,
  getFile,
  deleteFile,
} = require("../controllers/fileController");

// Upload files
router.post("/upload", handleFileUpload("files"), uploadFiles);

// Get all files
router.get("/", getFiles);

// Get single file
router.get("/:id", getFile);

// Delete file
router.delete("/:id", deleteFile);

module.exports = router;
