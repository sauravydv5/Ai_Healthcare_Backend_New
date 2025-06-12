const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  emailId: String,
  phone: String,
  password: String,
  role: {
    type: String,
    enum: ["patient", "doctor", "admin"],
    default: "patient",
  },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
  PhotoUrl: String,
});

module.exports = mongoose.model("User", userSchema);
