// controllers/patientController.js
const Patient = require("../models/patient");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  validateSignUpData,
  validateEditPatientProfileData,
} = require("../utils/validation");

const patientSignup = async (req, res) => {
  try {
    validateSignUpData(req.body);
    const { username, firstName, emailId, password } = req.body;
    const existing = await Patient.findOne({ emailId });
    if (existing)
      return res.status(400).json({ message: "Patient already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const patient = await Patient.create({
      firstName,
      emailId,
      password: hashedPassword,
    });

    res
      .status(201)
      .json({ message: "Patient registered successfully", patient });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// const patientLogin = async (req, res) => {
//   try {
//     const { identifier, password } = req.body;

//     // Match emailId or username
//     const patient = await Patient.findOne({
//       $or: [{ emailId: identifier }, { username: identifier }],
//     });

//     if (!patient) {
//       return res.status(404).json({ message: "Patient not found" });
//     }

//     // Compare password
//     const isMatch = await bcrypt.compare(password, patient.password);
//     if (!isMatch) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     // Generate JWT token
//     const token = jwt.sign({ id: patient._id }, process.env.JWT_SECRET, {
//       expiresIn: "1d",
//     });

//     res.cookie("token", token, {
//       httpOnly: true,
//     });

//     // Respond with token and full patient info
//     res.status(200).json({
//       message: "Login successful",
//       token,
//       user: {
//         id: patient._id,
//         name: patient.firstName,
//         emailId: patient.emailId,
//         username: patient.username,
//         phone: patient.phone,
//         gender: patient.gender,
//       },
//     });
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };
const patientLogin = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    // Find patient by email or username
    const patient = await Patient.findOne({
      $or: [{ emailId: identifier }, { username: identifier }],
    });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, patient.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = jwt.sign({ id: patient._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Set HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // for production
      sameSite: "strict",
    });

    // Send response with full patient profile
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: patient._id,
        firstName: patient.firstName,
        lastName: patient.lastName,
        emailId: patient.emailId,
        username: patient.username,
        phone: patient.phone,
        gender: patient.gender,
        age: patient.age,
        address: patient.address,
        bloodGroup: patient.bloodGroup,
        medicalHistory: patient.medicalHistory,
        emergencyContact: patient.emergencyContact,
        photoUrl: patient.photoUrl,
        allergies: patient.allergies,
        createdAt: patient.createdAt,
        updatedAt: patient.updatedAt,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { patientLogin };
const getAppliedDoctors = async (req, res) => {
  try {
    const doctors = await ApplyDoctor.find();
    return res.status(200).json({
      success: true,
      data: doctors,
    });
  } catch (error) {
    console.error("Error fetching applied doctors:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const patientLogout = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
};

//Profile View
const viewPatientProfile = async (req, res) => {
  try {
    const patientId = req.patient?._id || req.user?._id;

    if (!patientId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const patient = await Patient.findById(patientId);

    if (!patient) {
      return res
        .status(404)
        .json({ success: false, message: "Please Login!!" });
    }

    res.status(200).json({ success: true, data: patient });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//Edit patient profile
// const editPatientProfile = async (req, res) => {
//   try {
//     const patientId = req.patient?._id || req.user?._id;

//     if (!patientId) {
//       return res.status(401).json({ success: false, message: "Unauthorized" });
//     }

//     if (!validateEditPatientProfileData(req)) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Invalid edit fields" });
//     }

//     const updatedPatient = await Patient.findByIdAndUpdate(
//       patientId,
//       { $set: req.body },
//       { new: true, runValidators: true }
//     ).select("-password");

//     res.status(200).json({
//       success: true,
//       message: "Profile updated successfully",
//       data: updatedPatient,
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

const editPatientProfile = async (req, res) => {
  try {
    const patientId = req.patient?._id || req.user?._id;

    if (!patientId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!validateEditPatientProfileData(req)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid edit fields" });
    }

    const updatedPatient = await Patient.findByIdAndUpdate(
      patientId,
      { $set: req.body },
      { new: true, runValidators: true }
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedPatient,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  editPatientProfile,
};

module.exports = {
  patientSignup,
  patientLogin,
  getAppliedDoctors,
  patientLogout,
  viewPatientProfile,
  editPatientProfile,
};
