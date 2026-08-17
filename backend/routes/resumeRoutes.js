const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const User = require("../models/User");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// ========================================
// RESUME DIRECTORY
// ========================================

const resumeDirectory = path.resolve(
  __dirname,
  "../uploads/resumes"
);

console.log(
  "Resume directory:",
  resumeDirectory
);

// ========================================
// MULTER STORAGE
// ========================================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, resumeDirectory);
  },

  filename: (req, file, cb) => {
    const extension = path.extname(
      file.originalname
    );

    const safeName = path
      .basename(
        file.originalname,
        extension
      )
      .replace(/[^a-zA-Z0-9]/g, "_");

    const uniqueName =
      `${req.user._id}_${Date.now()}_${safeName}${extension}`;

    cb(null, uniqueName);
  },
});

// ========================================
// FILE VALIDATION
// ========================================

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only PDF, DOC, and DOCX resume files are allowed."
      ),
      false
    );
  }
};

// ========================================
// MULTER CONFIGURATION
// ========================================

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

// ========================================
// UPLOAD / UPDATE RESUME
// ========================================

router.post(
  "/upload",
  protect,
  upload.single("resume"),
  async (req, res) => {
    try {
      console.log(
        "Resume upload request received."
      );

      // Check uploaded file
      if (!req.file) {
        return res.status(400).json({
          message:
            "Please select a resume file.",
        });
      }

      console.log(
        "Resume received:",
        req.file.filename
      );

      // ========================================
      // GET USER
      // ========================================

      const user = await User.findById(
        req.user._id
      );

      if (!user) {
        if (
          req.file.path &&
          fs.existsSync(req.file.path)
        ) {
          fs.unlinkSync(req.file.path);
        }

        return res.status(404).json({
          message:
            "Student account not found.",
        });
      }

      // ========================================
      // DELETE OLD RESUME
      // ========================================

      if (
        user.resume &&
        user.resume.fileName
      ) {
        const oldFilePath = path.join(
          resumeDirectory,
          user.resume.fileName
        );

        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }

      // ========================================
      // SAVE NEW RESUME
      // ========================================

      user.resume = {
        fileName: req.file.filename,

        fileUrl:
          `/uploads/resumes/${req.file.filename}`,

        uploadedAt: new Date(),
      };

      await user.save();

      console.log(
        "Resume saved successfully."
      );

      // ========================================
      // SEND RESPONSE
      // ========================================

      return res.status(200).json({
        message:
          "Resume uploaded successfully.",

        resume: {
          fileName:
            user.resume.fileName,

          fileUrl:
            user.resume.fileUrl,

          uploadedAt:
            user.resume.uploadedAt,
        },
      });
    } catch (error) {
      console.error(
        "Resume upload error:",
        error
      );

      // Delete uploaded file if something fails
      if (
        req.file &&
        req.file.path &&
        fs.existsSync(req.file.path)
      ) {
        fs.unlinkSync(req.file.path);
      }

      return res.status(500).json({
        message:
          "Resume upload failed.",

        error: error.message,
      });
    }
  }
);

// ========================================
// GET MY RESUME
// ========================================

router.get(
  "/my-resume",
  protect,
  async (req, res) => {
    try {
      const user = await User.findById(
        req.user._id
      ).select("resume");

      if (!user) {
        return res.status(404).json({
          message:
            "Student account not found.",
        });
      }

      if (
        !user.resume ||
        !user.resume.fileName
      ) {
        return res.status(404).json({
          message:
            "No resume uploaded yet.",
        });
      }

      return res.status(200).json({
        resume: user.resume,
      });
    } catch (error) {
      console.error(
        "Get resume error:",
        error
      );

      return res.status(500).json({
        message:
          "Could not retrieve resume.",
      });
    }
  }
);

// ========================================
// DELETE MY RESUME
// ========================================

router.delete(
  "/delete",
  protect,
  async (req, res) => {
    try {
      const user = await User.findById(
        req.user._id
      );

      if (!user) {
        return res.status(404).json({
          message:
            "Student account not found.",
        });
      }

      if (
        !user.resume ||
        !user.resume.fileName
      ) {
        return res.status(404).json({
          message:
            "No resume found.",
        });
      }

      // ========================================
      // DELETE PHYSICAL FILE
      // ========================================

      const filePath = path.join(
        resumeDirectory,
        user.resume.fileName
      );

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      // ========================================
      // CLEAR DATABASE
      // ========================================

      user.resume = {
        fileName: "",
        fileUrl: "",
        uploadedAt: null,
      };

      await user.save();

      return res.status(200).json({
        message:
          "Resume deleted successfully.",
      });
    } catch (error) {
      console.error(
        "Delete resume error:",
        error
      );

      return res.status(500).json({
        message:
          "Could not delete resume.",
      });
    }
  }
);

module.exports = router;