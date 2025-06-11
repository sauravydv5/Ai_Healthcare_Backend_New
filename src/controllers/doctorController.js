const Doctor = require("../models/doctor");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  validateSignUpData,
  validateEditDoctorProfileData,
} = require("../utils/validation");
const ApplyDoctor = require("../models/applyDocSchema");

const doctorSignup = async (req, res) => {
  try {
    validateSignUpData(req.body);
    const { firstName, emailId, password } = req.body;
    const existing = await Doctor.findOne({ emailId });
    if (existing)
      return res.status(400).json({ message: "Doctor already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const doctor = await Doctor.create({
      firstName,
      emailId,
      password: hashedPassword,
    });

    res.status(201).json({ message: "Doctor registered successfully", doctor });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const doctorLogin = async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const doctor = await Doctor.findOne({ emailId });
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("token", token, { httpOnly: true });

    // 👇 Return doctor info too (omit sensitive fields if needed)
    const { password: _, ...doctorData } = doctor.toObject();

    res.json({
      message: "Login successful",
      token,
      doctor: doctorData,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// const applyAsDoctor = async (req, res) => {
//   try {
//     const {
//       name,
//       email,
//       registrationNumber,
//       speciality,
//       phone,
//       clinicAddress,
//       experienceYears,
//       availableFrom,
//       availableTo,
//     } = req.body;

//     const existingApplication = await ApplyDoctor.findOne({
//       registrationNumber,
//     });

//     if (existingApplication) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "An application with this email or registration number already exists.",
//       });
//     }

//     // Create new application with status 'Pending'
//     const newApplication = new ApplyDoctor({
//       // name,
//       // email,
//       registrationNumber,
//       speciality,
//       phone,
//       clinicAddress,
//       experienceYears,
//       availableFrom,
//       availableTo,
//       status: "Pending",
//       // picture,
//     });

//     await newApplication.save();

//     return res.status(201).json({
//       success: true,
//       message: "Application submitted successfully",
//       data: newApplication,
//     });
//   } catch (error) {
//     console.error("Apply As Doctor Error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal Server Error",
//       error: error.message,
//     });
//   }
// };

const applyAsDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      registrationNumber,
      speciality,
      phone,
      clinicAddress,
      experienceYears,
      availableFrom,
      availableTo,
    } = req.body;

    const existingApplication = await ApplyDoctor.findOne({
      registrationNumber,
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: "An application with this registration number already exists.",
      });
    }

    const newApplication = new ApplyDoctor({
      name,
      email,
      registrationNumber,
      speciality,
      phone,
      clinicAddress,
      experienceYears,
      availableFrom,
      availableTo,
      status: "Pending",
      createdBy: email,
    });

    if (req.file) {
      newApplication.picture = req.file.filename; // Assuming multer used
    }

    await newApplication.save();

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      data: newApplication,
    });
  } catch (error) {
    console.error("Doctor Application Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const doctorLogout = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
};

const viewProfile = async (req, res) => {
  try {
    const doctorId = req.doctor?._id || req.user?._id;
    if (!doctorId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "Please Login!!" });
    }
    res.status(200).json({ success: true, data: doctor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//EditProfile view
const editProfile = async (req, res) => {
  try {
    const doctor = req.doctor;
    if (!doctor) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const allowedFields = [
      "name",
      "email",
      "phone",
      "speciality",
      "clinicAddress",
      "experienceYears",
      "availableFrom",
      "availableTo",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        doctor[field] = req.body[field];
      }
    });

    const updatedDoctor = await doctor.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully!",
      data: updatedDoctor,
    });
  } catch (error) {
    console.error("Error in editProfile:", error);
    return res.status(400).json({ success: false, message: error.message });
  }
};
// 👇 Export everything at once
module.exports = {
  doctorSignup,
  doctorLogin,
  applyAsDoctor,
  doctorLogout,
  viewProfile,
  editProfile,
};
