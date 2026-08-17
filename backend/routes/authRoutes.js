const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// ================================
// STUDENT REGISTRATION
// ================================

router.post("/register", async (req, res) => {
  try {
    const {
      name,
      rollNo,
      email,
      password,
      branch,
      cgpa,
    } = req.body;

    if (
      !name ||
      !rollNo ||
      !email ||
      !password ||
      !branch ||
      cgpa === undefined
    ) {
      return res.status(400).json({
        message: "Please fill all required fields.",
      });
    }

    const existingEmail = await User.findOne({
      email,
    });

    if (existingEmail) {
      return res.status(400).json({
        message: "Email is already registered.",
      });
    }

    const existingRollNo = await User.findOne({
      rollNo,
    });

    if (existingRollNo) {
      return res.status(400).json({
        message: "Roll number is already registered.",
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    const user = await User.create({
      name,
      rollNo,
      email,
      password: hashedPassword,
      branch,
      cgpa,
      role: "student",
    });

    res.status(201).json({
      message: "Student registered successfully.",
      user: {
        id: user._id,
        name: user.name,
        rollNo: user.rollNo,
        email: user.email,
        branch: user.branch,
        cgpa: user.cgpa,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);

    res.status(500).json({
      message: "Registration failed.",
      error: error.message,
    });
  }
});

// ================================
// LOGIN
// ================================

router.post("/login", async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const passwordMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      message: "Login successful.",
      token,

      user: {
        id: user._id,
        name: user.name,
        rollNo: user.rollNo,
        email: user.email,
        branch: user.branch,
        cgpa: user.cgpa,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      message: "Login failed.",
      error: error.message,
    });
  }
});

// ================================
// COMPANY REGISTRATION
// ================================

router.post(
  "/company-register",
  async (req, res) => {
    try {
      const {
        companyName,
        email,
        password,
      } = req.body;

      if (
        !companyName ||
        !email ||
        !password
      ) {
        return res.status(400).json({
          message:
            "Company name, email and password are required.",
        });
      }

      const normalizedEmail =
        email.toLowerCase().trim();

      // Check if email already exists
      const existingUser =
        await User.findOne({
          email: normalizedEmail,
        });

      if (existingUser) {
        return res.status(400).json({
          message:
            "Email is already registered.",
        });
      }

      // Hash password
      const hashedPassword =
        await bcrypt.hash(password, 10);

      // Create company account
      const companyUser =
        await User.create({
          name: companyName.trim(),

          // Required by existing User schema
          rollNo: `COMP-${Date.now()}`,

          email: normalizedEmail,

          password: hashedPassword,

          // Required by existing User schema
          branch: "Company",

          cgpa: 0,

          role: "company",
        });

      res.status(201).json({
        message:
          "Company registered successfully.",

        user: {
          id: companyUser._id,
          name: companyUser.name,
          email: companyUser.email,
          role: companyUser.role,
        },
      });
    } catch (error) {
      console.error(
        "Company registration error:",
        error
      );

      res.status(500).json({
        message:
          "Company registration failed.",
        error: error.message,
      });
    }
  }
);

module.exports = router;