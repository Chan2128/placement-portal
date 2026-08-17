const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path=require("path");
require("dotenv").config();

const companyRoutes = require("./routes/companyRoutes");
const adminRoutes = require("./routes/adminRoutes");
const authRoutes = require("./routes/authRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const applicationRoutes = require("./routes/applicationRoutes");

const app = express();

// ================================
// MIDDLEWARE
// ================================

app.use(cors());
app.use(express.json());
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

// ================================
// ROUTES
// ================================

app.use("/api/companies", companyRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/applications", applicationRoutes);

// ================================
// TEST ROUTE
// ================================

app.get("/", (req, res) => {
  res.send("Placement Portal Backend is running 🚀");
});

// ================================
// MONGODB CONNECTION
// ================================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully ✅");

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed ❌");
    console.error(error.message);
  });