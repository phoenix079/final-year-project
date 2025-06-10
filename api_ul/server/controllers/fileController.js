const File = require("../models/fileModel");

const uploadFile = async (req, res) => {
  try {
    console.log("Uploaded file object:", req.file); // debug
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    if (!req.file || !req.file.path) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    const {
      originalname,
      mimetype,
      size,
      filename,     // cloudinary-generated filename
      path,
      url,          // cloudinary URL (actual path)
    } = req.file;

    const file = new File({
      originalname,
      mimetype,
      size,
      filename: filename || req.file.originalname, // fallback to original name
      path: url || req.file.url, //(Was initially req.file.path before) use Cloudinary URL
      status: "uploaded",
      user: req.user._id, //from protect middleware
    });

    await file.save();

    res.status(201).json({
      message: "File uploaded successfully.",
      file,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = { uploadFile };

// @route GET /api/files
// @desc Get all uploaded files (for user/admin)
// @access Private (or public if needed)
const getAllFiles = async (req, res) => {
  try {
    const files = await File.find().sort({ uploadDate: -1 });
    res.status(200).json(files);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch files." });
  }
};

module.exports = {
  uploadFile,
  getAllFiles,
};
