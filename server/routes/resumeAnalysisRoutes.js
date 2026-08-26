const express = require("express");
const multer = require("multer");
const {
  analyzeResume,
  getAdminStats,
  getAdminAnalyses,
  deleteAnalysis,
} = require("../controllers/resumeAnalysisController");
const adminAuthMiddleware = require("../middleware/adminAuthMiddleware");

const router = express.Router();

const allowedMimeTypes = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },

  fileFilter: (req, file, callback) => {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return callback(
        new Error("Only PDF and DOCX resume files are allowed.")
      );
    }

    callback(null, true);
  },
});

router.post(
  "/analyze",
  (req, res, next) => {
    upload.single("resume")(req, res, (error) => {
      if (error instanceof multer.MulterError) {
        const message =
          error.code === "LIMIT_FILE_SIZE"
            ? "The resume must be smaller than 5 MB."
            : error.message;

        return res.status(400).json({
          success: false,
          message,
        });
      }

      if (error) {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }

      next();
    });
  },
  analyzeResume
);

// All routes after this line require a valid admin token.
router.use("/admin", adminAuthMiddleware);

router.get("/admin/stats", getAdminStats);
router.get("/admin/all", getAdminAnalyses);
router.delete("/admin/:id", deleteAnalysis);

module.exports = router;
