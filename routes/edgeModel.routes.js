const express = require("express");
const router = express.Router();
const { getModelMetadata, modelsDir,streamModelFile } = require("../controllers/edgeModel.controller");

// 1. Metadata endpoint
router.get("/metadata", getModelMetadata);

// 2. Static download endpoint with resume support (Accept-Ranges)
router.get("/download/:filename", streamModelFile);
// router.use(
//   "/download",
//   express.static(modelsDir, {
//     setHeaders: (res) => {
//       res.setHeader("Content-Disposition", "attachment");
//       res.setHeader("Accept-Ranges", "bytes");
//     },
//     maxAge: "7d",
//   })
// );

module.exports = router;