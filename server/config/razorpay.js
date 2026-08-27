const Razorpay = require("razorpay");
require("dotenv").config();

let razorpay = null;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  try {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    console.log("✅ Razorpay configuration loaded");
  } catch (err) {
    console.error("Razorpay initialization error:", err.message);
  }
} else {
  console.warn("Razorpay keys not found in environment. Mock mode enabled.");
}

module.exports = razorpay;
