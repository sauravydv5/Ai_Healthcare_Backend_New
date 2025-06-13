const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");

const patientSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
    },
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 50,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("invalid email address:" + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Enter Strong Password..:" + value);
        }
      },
    },
    role: {
      type: String,
      enum: ["patient"],
      default: "patient",
    },
    birthdate: {
      type: Date,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["Male", "Female", "others"].includes(value)) {
          throw new Error("Gender data is not valid...");
        }
      },
    },
    phone: {
      type: String,
      trim: true,
    },
    address: {
      country: { type: String, trim: true },
      state: { type: String, trim: true },
      street: { type: String, trim: true },
      zip: { type: String, trim: true },
    },
    photoUrl: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXLb3TY72rHh4VSJUR8UGa83p3ABg3FRBNrw&s",
    },
    status: {
      type: String,
      enum: ["Pending", "Active", "Inactive"],
      default: "Pending",
    },
    paymentPlan: {
      type: String,
      trim: true,
    },
    paymentDate: {
      type: Date,
    },
    isPaid: {
      type: Boolean,
      default: true,
    },
    isExpired: {
      type: Boolean,
      default: false,
    },
    chatbotTalks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ChatbotTalk",
      },
    ],
  },
  { timestamps: true }
);

patientSchema.methods.getJWT = async function () {
  const user = this;

  const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  return token;
};

patientSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const passwordHash = user.password;

  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    passwordHash
  );

  return isPasswordValid;
};

module.exports = mongoose.model("Patient", patientSchema);
