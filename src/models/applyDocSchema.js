const mongoose = require("mongoose");
const validator = require("validator");

const applyDoctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email address: " + value);
        }
      },
    },
    registrationNumber: {
      type: String,
      required: true,
      unique: true,
    },
    speciality: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      trim: true,
      required: true,
    },
    clinicAddress: {
      type: String,
      trim: true,
    },
    experienceYears: {
      type: Number,
      min: 0,
      required: true,
    },
    availableFrom: {
      type: String,
    },
    availableTo: {
      type: String,
    },

    appliedAt: {
      type: Date,
      default: Date.now,
    },
    createdBy: {
      type: String,
    },
  },

  { timestamps: true }
);

const ApplyDoctorModel = mongoose.model("ApplyDoctor", applyDoctorSchema);
module.exports = ApplyDoctorModel;
