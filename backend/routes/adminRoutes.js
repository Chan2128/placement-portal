const express = require("express");
const User = require("../models/User");
const Company = require("../models/Company");
const Application = require("../models/Application");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// ========================================
// MIDDLEWARE: ADMIN ONLY
// ========================================

const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      message: "Access denied. Admins only.",
    });
  }
  next();
};

// ========================================
// GET ALL STUDENTS
// ========================================

router.get(
  "/students",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const students = await User.find({
        role: "student",
      })
        .select("-password")
        .sort({ createdAt: -1 });

      res.json({ students });
    } catch (error) {
      console.error("Get students error:", error);
      res.status(500).json({
        message: "Failed to fetch students",
        error: error.message,
      });
    }
  }
);

// ========================================
// GET ALL COMPANIES / OPPORTUNITIES
// ========================================

router.get(
  "/companies",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const companies = await Company.find()
        .populate("owner", "name email")
        .sort({ createdAt: -1 });

      res.json({ companies });
    } catch (error) {
      console.error("Get companies error:", error);
      res.status(500).json({
        message: "Failed to fetch companies",
        error: error.message,
      });
    }
  }
);

// ========================================
// GET ALL APPLICATIONS
// ========================================

router.get(
  "/applications",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const applications = await Application.find()
        .sort({ createdAt: -1 });

      res.json({ applications });
    } catch (error) {
      console.error("Get applications error:", error);
      res.status(500).json({
        message: "Failed to fetch applications",
        error: error.message,
      });
    }
  }
);

module.exports = router;