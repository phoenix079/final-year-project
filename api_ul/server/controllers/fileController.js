const File = require("../models/file");
const { ErrorResponse } = require("../middlewares/errorHandler");

// @desc    Upload files
// @route   POST /api/files/upload
// @access  Public
exports.uploadFiles = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return next(new ErrorResponse("No files uploaded", 400));
    }

    const savedFiles = await Promise.all(
      req.files.map(async (file) => {
        const newFile = new File({
          filename: file.filename,
          originalname: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          path: file.path,
        });
        return await newFile.save();
      })
    );

    res.status(201).json({
      success: true,
      data: savedFiles,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all files
// @route   GET /api/files
// @access  Public
exports.getFiles = async (req, res, next) => {
  try {
    const files = await File.find().sort("-uploadDate");
    res.status(200).json({
      success: true,
      count: files.length,
      data: files,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single file
// @route   GET /api/files/:id
// @access  Public
exports.getFile = async (req, res, next) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return next(
        new ErrorResponse(`File not found with id of ${req.params.id}`, 404)
      );
    }

    res.status(200).json({
      success: true,
      data: file,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete file
// @route   DELETE /api/files/:id
// @access  Public
const fs = require("fs");
const path = require("path");

exports.deleteFile = async (req, res, next) => {
  try {
    const file = await File.findByIdAndDelete(req.params.id);
    if (!file) {
      return next(
        new ErrorResponse(`File not found with id of ${req.params.id}`, 404)
      );
    }
    // TODO: Delete the actual file from the filesystem
    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    next(err);
  }
};
