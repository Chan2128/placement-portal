const express = require("express");
const Company = require("../models/Company");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// ========================================
// GET ALL OPPORTUNITIES
// STUDENTS USE THIS
// ========================================

router.get("/", async (req, res) => {
  try {
    const companies = await Company.find().sort({
      createdAt: -1,
    });

    res.json(companies);
  } catch (error) {
    console.error("Get companies error:", error);

    res.status(500).json({
      message: "Failed to fetch companies",
      error: error.message,
    });
  }
});
// ========================================
// GET MY OPPORTUNITIES
// ========================================

router.get(
  "/my-opportunities",
  protect,
  async (req, res) => {
    try {
      const opportunities =
        await Company.find({
          owner: req.user._id,
        }).sort({
          createdAt: -1,
        });

      res.json({
        opportunities,
      });
    } catch (error) {
      console.error(
        "Get my opportunities error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to fetch your opportunities.",
        error: error.message,
      });
    }
  }
);
// ========================================
// CREATE OPPORTUNITY
// ========================================

router.post("/", protect, async (req, res) => {
  try {
    const company = await Company.create({
      ...req.body,
      owner: req.user._id,
    });

    res.status(201).json(company);
  } catch (error) {
    console.error(
      "Create opportunity error:",
      error
    );

    res.status(400).json({
      message: "Failed to create opportunity",
      error: error.message,
    });
  }
});

// ========================================
// DELETE OPPORTUNITY
// ========================================

router.delete(
  "/:id",
  protect,
  async (req, res) => {
    try {
      const opportunity =
        await Company.findOne({
          _id: req.params.id,
          owner: req.user._id,
        });

      if (!opportunity) {
        return res.status(404).json({
          message:
            "Opportunity not found or you do not have permission to remove it.",
        });
      }

      await Company.findByIdAndDelete(
        req.params.id
      );

      res.json({
        message:
          "Opportunity removed successfully.",
      });
    } catch (error) {
      console.error(
        "Delete opportunity error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to delete opportunity",
        error: error.message,
      });
    }
  }
);

module.exports = router;