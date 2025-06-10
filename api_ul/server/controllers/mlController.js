const File = require("../models/fileModel");
const { PythonShell } = require("python-shell");
const path = require("path");

// @desc    Process file with ML model
// @route   POST /api/ml/process/:id
// @access  Public
exports.processFileWithML = async (req, res, next) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return next(
        new ErrorResponse(`File not found with id of ${req.params.id}`, 404)
      );
    }
    if (file.status === "processing") {
      return next(new ErrorResponse("File is already being processed", 400));
    }

    // Update file status to processing
    file.status = "processing";
    await file.save();

    // Path to your Python ML script
    const pythonScriptPath = path.join(
      __dirname,
      "../ml_scripts/process_file.py"
    );

    // Options for PythonShell
    const options = {
      mode: "text",
      pythonOptions: ["-u"], // unbuffered stdout
      scriptPath: path.dirname(pythonScriptPath),
      args: [file.path], // Pass file path as argument to Python script
    };

    // Run Python script
    PythonShell.run(
      path.basename(pythonScriptPath),
      options,
      async (err, results) => {
        if (err) {
          console.error("PythonShell error:", err);
          file.status = "failed";
          await file.save();
          return next(
            new ErrorResponse("Error processing file with ML model", 500)
          );
        }

        try {
          // Parse the results from Python script
          const mlResults = JSON.parse(results[0]);

          // Update file with ML results
          file.mlResults = mlResults;
          file.status = "processed";
          await file.save();

          res.status(200).json({
            success: true,
            data: file,
          });
        } catch (parseErr) {
          console.error("Error parsing ML results:", parseErr);
          file.status = "failed";
          await file.save();
          next(new ErrorResponse("Error processing ML results", 500));
        }
      }
    );
  } catch (err) {
    next(err);
  }
};
