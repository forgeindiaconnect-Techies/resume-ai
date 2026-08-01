const mongoose = require("mongoose");

const guestSessionSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now, expires: '7d' } // Automatically expires in 7 days
});

module.exports = mongoose.model("GuestSession", guestSessionSchema);
