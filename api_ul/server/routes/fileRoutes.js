const express = require("express");
const router = express.Router();
const multer = require("multer");
// const { handleFileUpload } = require("../middlewares/upload");
const { uploadFile, getAllFiles } = require("../controllers/fileController");
const {storage} = require("../lib/cloudinary");
const { protect } = require("../middlewares/authMiddleware");

// Upload files
const upload = multer({ storage });
router.post("/upload", protect ,upload.single("file"), uploadFile);//middleware protect

// Get all files
router.get("/files", protect, getAllFiles);

// // Get single file
// router.get("/:id", getFile);

// // Delete file
// router.delete("/:id", deleteFile);

const getFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }
    res.status(200).json(file);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const deleteFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }
    // Optionally delete from Cloudinary
    await cloudinary.uploader.destroy(file.filename);
    await file.remove();
    res.status(200).json({ message: "File deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

router.get("/:id", protect, getFile);
router.delete("/:id", protect, deleteFile);

module.exports = router;
