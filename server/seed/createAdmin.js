const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const User = require("../models/User.js");

dotenv.config();

const createAdmin = async () => {
  await mongoose.connect(process.env.MONGODB_URI);

  const exists = await User.findOne({
    email: "admin@forgeindia.com",
  });

  if (exists) {
    console.log("Admin already exists");
    process.exit();
  }

  await User.create({
    name: "Super Admin",
    email: "admin@forgeindia.com",
    password: "Admin@123",
    role: "admin",
  });

  console.log("Admin created successfully");
  process.exit();
};

createAdmin();
