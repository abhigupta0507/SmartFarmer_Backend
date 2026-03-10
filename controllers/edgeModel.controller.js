const path = require("path");
const fs = require("fs");
const logger = require("../utils/logger");

const modelsDir = path.join(__dirname, "..", "models");

// NEW: Dedicated streaming function
const streamModelFile = (req, res) => {
  const fileName = req.params.filename;
  const filePath = path.join(modelsDir, fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ success: false, message: "File not found" });
  }

  const stat = fs.statSync(filePath);

  // Manual Headers for stability
  res.writeHead(200, {
    "Content-Type": "application/octet-stream",
    "Content-Length": stat.size,
    "Content-Disposition": `attachment; filename=${fileName}`,
    "Accept-Ranges": "bytes",
  });

  const readStream = fs.createReadStream(filePath);

  // Log when download starts/ends
  logger.info(`Starting stream for: ${fileName}`);
  readStream.pipe(res);

  readStream.on("error", (err) => {
    logger.error(`Stream error for ${fileName}:`, err);
    res.end();
  });
};

const getModelMetadata = (req, res) => {
  try {
    // const files = ["agrillava-2b-q4_k_m.gguf", "model-vision.gguf"];
    // const files = [
    //   "gemma-3-270m-it.Q4_K_M.gguf",
    //   "plant_disease_model.tflite",
    //   "labels.txt",
    // ];
    // Replace the old array with your new YOLO files
    const files = [
      "gemma-3-270m-it.Q4_K_M.gguf",
      "yolo11s.tflite",
      "pests.txt",
    ];
    const meta = files.map((file) => {
      const filePath = path.join(modelsDir, file);
      const exists = fs.existsSync(filePath);
      return {
        name: file,
        exists: exists,
        size: exists ? fs.statSync(filePath).size : 0,
        url: `${req.protocol}://${req.get("host")}/api/edge/download/${file}`,
      };
    });

    res.status(200).json({ success: true, models: meta });
  } catch (error) {
    logger.error("Error fetching model metadata:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = {
  getModelMetadata,
  modelsDir, // Exported to be used by the static middleware
  streamModelFile,
};
