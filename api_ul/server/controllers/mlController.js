const { exec } = require("child_process");
const File = require("../models/fileModel");

// Existing controller
const predictML = async (req, res) => {
  try {
    const { fileId } = req.params;

    const file = await File.findById(fileId);
    if (!file || !file.path) {
      return res.status(404).json({ message: "File not found or missing URL" });
    }

    const imageUrl = file.path;

    exec(
      `python ml_model/inference.py "${imageUrl}"`,
      (error, stdout, stderr) => {
        if (error) {
          console.error("Prediction error:", stderr || error.message);
          return res
            .status(500)
            .json({ message: "Prediction failed", error: stderr });
        }

        const [label, confidence] = stdout.trim().split("|");

        file.status = "processed";
        file.mlResults = {
          predictedClass: label,
          confidence: parseFloat(confidence),
        };
        file.save();

        res.status(200).json({
          message: "Prediction successful",
          result: { predictedClass: label, confidence: parseFloat(confidence) },
        });
      }
    );
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { predictML };
