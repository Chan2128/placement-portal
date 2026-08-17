const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    // ========================================
    // STUDENT
    // ========================================

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ========================================
    // COMPANY
    // ========================================

    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },

    // ========================================
    // COMPANY DETAILS
    // ========================================

    companyName: {
      type: String,
      required: true,
      trim: true,
    },

    role: {
      type: String,
      required: true,
      trim: true,
    },

    package: {
      type: String,
      required: true,
    },

    // ========================================
    // STUDENT DETAILS AT TIME OF APPLICATION
    // ========================================

    studentName: {
      type: String,
      required: true,
    },

    rollNo: {
      type: String,
      required: true,
    },

    branch: {
      type: String,
      required: true,
    },

    cgpa: {
      type: Number,
      required: true,
    },

    // ========================================
    // RESUME
    // ========================================

    resume: {
      fileName: {
        type: String,
        default: "",
      },

      fileUrl: {
        type: String,
        default: "",
      },
    },

    // ========================================
    // APPLICATION STATUS
    // ========================================

    status: {
      type: String,
      enum: [
        "Applied",
        "Under Review",
        "Shortlisted",
        "Rejected",
        "Selected",
      ],
      default: "Applied",
    },

    appliedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent the same student from applying
// to the same company more than once.

applicationSchema.index(
  {
    student: 1,
    company: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model(
  "Application",
  applicationSchema
);