const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    // ================================
    // COMPANY USER / OWNER
    // ================================

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ================================
    // COMPANY DETAILS
    // ================================

    name: {
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
      trim: true,
    },

    cgpa: {
      type: Number,
      required: true,
    },

    branches: {
      type: [String],
      required: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.models.Company ||
  mongoose.model("Company", companySchema);