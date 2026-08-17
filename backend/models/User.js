const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    rollNo: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    branch: {
      type: String,
      required: true,
      trim: true,
    },

    cgpa: {
      type: Number,
      required: true,
    },

    // ================================
    // RESUME
    // ================================

    resume: {
      fileName: {
        type: String,
        default: "",
      },

      fileUrl: {
        type: String,
        default: "",
      },

      uploadedAt: {
        type: Date,
        default: null,
      },
    },

    // ================================
    // ROLE
    // ================================

    role: {
      type: String,
      enum: ["student", "company", "admin"],
      default: "student",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);