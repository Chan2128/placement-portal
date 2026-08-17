const express = require("express");

const Application = require("../models/Application");
const Company = require("../models/company");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// ========================================
// APPLY TO A COMPANY
// ========================================

router.post("/apply", protect, async (req, res) => {
  try {
    const { companyId } = req.body;

    if (!companyId) {
      return res.status(400).json({
        message: "Company ID is required.",
      });
    }

    // ========================================
    // GET LOGGED-IN STUDENT
    // ========================================

    const student = req.user;

    // ========================================
    // GET COMPANY
    // ========================================

    const company = await Company.findById(companyId);

    if (!company) {
      return res.status(404).json({
        message: "Company not found.",
      });
    }

    // ========================================
    // CHECK ELIGIBILITY
    // ========================================

    const eligibleByCGPA =
      student.cgpa >= company.cgpa;

    const eligibleByBranch =
      company.branches.includes(student.branch);

    if (!eligibleByCGPA || !eligibleByBranch) {
      return res.status(403).json({
        message:
          "You are not eligible for this company.",
      });
    }

    // ========================================
    // CHECK EXISTING APPLICATION
    // ========================================

    const existingApplication =
      await Application.findOne({
        student: student._id,
        company: company._id,
      });

    if (existingApplication) {
      return res.status(400).json({
        message:
          "You have already applied to this company.",
      });
    }

    // ========================================
    // RESUME CHECK
    // ========================================

    if (
      !student.resume ||
      !student.resume.fileName
    ) {
      return res.status(400).json({
        message:
          "Please upload your resume before applying.",
      });
    }

    // ========================================
    // CREATE APPLICATION
    // ========================================

    const application =
      await Application.create({
        student: student._id,

        company: company._id,

        companyName: company.name,

        role: company.role,

        package: company.package,

        studentName: student.name,

        rollNo: student.rollNo,

        branch: student.branch,

        cgpa: student.cgpa,

        resume: {
          fileName:
            student.resume.fileName,

          fileUrl:
            student.resume.fileUrl,
        },

        status: "Applied",

        appliedAt: new Date(),
      });

    res.status(201).json({
      message:
        `Application submitted successfully to ${company.name}.`,

      application,
    });
  } catch (error) {
    console.error(
      "Application error:",
      error
    );

    res.status(500).json({
      message:
        "Could not submit application.",
      error: error.message,
    });
  }
});

// ========================================
// GET MY APPLICATIONS
// ========================================

router.get("/my-applications", protect, async (req, res) => {
  try {
    const applications =
      await Application.find({
        student: req.user._id,
      })
        .populate(
          "company",
          "name role package location"
        )
        .sort({
          appliedAt: -1,
        });

    res.json({
      applications,
    });
  } catch (error) {
    console.error(
      "Get applications error:",
      error
    );

    res.status(500).json({
      message:
        "Could not retrieve applications.",
    });
  }
});

// ========================================
// GET ONE APPLICATION
// ========================================

router.get("/:id", protect, async (req, res) => {
  try {
    const application =
      await Application.findOne({
        _id: req.params.id,
        student: req.user._id,
      }).populate(
        "company",
        "name role package location"
      );

    if (!application) {
      return res.status(404).json({
        message: "Application not found.",
      });
    }

    res.json({
      application,
    });
  } catch (error) {
    console.error(
      "Get application error:",
      error
    );

    res.status(500).json({
      message:
        "Could not retrieve application.",
    });
  }
});

module.exports = router;