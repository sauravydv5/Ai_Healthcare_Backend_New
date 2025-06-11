const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");

const Speciality = Object.freeze({
  Allergy: "Allergy",
  Dermatology: "Dermatology",
  Radiology: "Radiology",
  Neurology: "Neurology",
  Gynecology: "Gynecology",
  Ophthalmology: "Ophthalmology",
  Pediatrics: "Pediatrics",
  Rehabilitation: "Rehabilitation",
  Psychiatry: "Psychiatry",
  Surgery: "Surgery",
  Urology: "Urology",
  None: "None",
});

const doctorSchema = new mongoose.Schema(
  {
    registrationNumber: {
      type: String,
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
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Gender data is not valid...");
        }
      },
    },
    role: {
      type: String,
      enum: ["doctor"],
      default: "doctor",
    },
    registrationNumber: {
      type: String,
      // required: true,
    },

    speciality: {
      type: String,
    },
    phone: {
      type: String,
      trim: true,
    },
    clinicAddress: {
      type: String,
      trim: true,
    },
    experienceYears: {
      type: Number,
      min: 0,
    },
    availableFrom: {
      type: String,
    },
    availableTo: {
      type: String,
    },
    status: {
      type: String,
      enum: ["Pending", "Active", "Inactive"],
      default: "Pending",
    },
    picture: {
      type: String,
    },
    creationDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

doctorSchema.methods.getJWT = async function () {
  const user = this;

  const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  return token;
};

doctorSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const passwordHash = user.password;

  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    passwordHash
  );

  return isPasswordValid;
};

const DoctorModel = mongoose.model("Doctor", doctorSchema);
module.exports = DoctorModel;
