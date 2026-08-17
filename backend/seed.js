const mongoose = require("mongoose");
require("dotenv").config();

const Company = require("./models/Company");

const companies = [
  {
    name: "TCS",
    role: "Software Engineer",
    package: "7.2 LPA",
    cgpa: 7.0,
    branches: ["CSE", "CST", "IT"],
    location: "Hyderabad",
    type: "Full Time",
  },
  {
    name: "Infosys",
    role: "Systems Engineer",
    package: "6.5 LPA",
    cgpa: 6.5,
    branches: ["CSE", "CST", "ECE"],
    location: "Bengaluru",
    type: "Full Time",
  },
  {
    name: "Deloitte",
    role: "Analyst",
    package: "8.0 LPA",
    cgpa: 7.5,
    branches: ["CSE", "CST"],
    location: "Hyderabad",
    type: "Full Time",
  },
  {
    name: "Accenture",
    role: "Application Developer",
    package: "7.8 LPA",
    cgpa: 7.0,
    branches: ["CSE", "CST", "IT"],
    location: "Pune",
    type: "Full Time",
  },
  {
    name: "Wipro",
    role: "Project Engineer",
    package: "6.2 LPA",
    cgpa: 6.0,
    branches: ["CSE", "CST", "ECE"],
    location: "Chennai",
    type: "Full Time",
  },
  {
    name: "Microsoft",
    role: "Software Development Engineer",
    package: "18 LPA",
    cgpa: 8.0,
    branches: ["CSE", "CST"],
    location: "Hyderabad",
    type: "Full Time",
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected successfully ✅");

    await Company.deleteMany();

    await Company.insertMany(companies);

    console.log("Companies added successfully 🎉");

    await mongoose.connection.close();

    console.log("Database connection closed.");
  } catch (error) {
    console.error("Seeding failed ❌");
    console.error(error.message);
  }
};

seedDatabase();