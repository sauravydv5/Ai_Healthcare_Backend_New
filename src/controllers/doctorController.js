const Doctor = require("../models/doctorLogin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  validateSignUpData,
  validateEditDoctorProfileData,
} = require("../utils/validation");

const doctorSignup = async (req, res) => {
  try {
    validateSignUpData(req.body);

    const { firstName, lastName, emailId, password, registrationNumber } =
      req.body;

    if (!registrationNumber) {
      return res
        .status(400)
        .json({ message: "Registration number is required" });
    }

    const existing = await Doctor.findOne({
      $or: [{ emailId }, { registrationNumber }],
    });

    if (existing) {
      return res.status(400).json({ message: "Doctor already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const doctor = await Doctor.create({
      firstName,
      lastName,
      emailId,
      password: hashedPassword,
      registrationNumber,
    });

    const { password: _, ...doctorData } = doctor._doc;

    res.status(201).json({
      message: "Doctor registered successfully",
      doctor: doctorData,
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: err.message });
  }
};
// const doctorLogin = async (req, res) => {
//   try {
//     const { emailId, password } = req.body;
//     const doctor = await Doctor.findOne({ emailId });
//     if (!doctor) return res.status(404).json({ message: "Doctor not found" });

//     const isMatch = await bcrypt.compare(password, doctor.password);
//     if (!isMatch)
//       return res.status(401).json({ message: "Invalid credentials" });

//     const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET, {
//       expiresIn: "1d",
//     });

//     // ✅ Secure cookie settings for cross-origin support
//     res.cookie("token", token, {
//       httpOnly: true,
//       secure: true,
//       sameSite: "None",
//       maxAge: 24 * 60 * 60 * 1000, // optional
//     });

//     const { password: _, ...doctorData } = doctor.toObject();

//     res.json({
//       message: "Login successful",
//       token,
//       doctor: doctorData,
//     });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

//NAYA BANA HAI
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

    const { password: _, ...doctorData } = doctor.toObject();

    // ✅ Send token in response (not in cookie)
    res.json({
      message: "Login successful",
      token,
      doctor: doctorData,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const doctorLogout = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
};

//Get Doc profile BY id
const viewProfile = async (req, res) => {
  try {
    const doctorId = req.doctor?._id || req.user?._id;
    if (!doctorId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Avoid sending sensitive fields like password
    const doctor = await Doctor.findById(doctorId).select("-password -__v");

    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found. Please login!" });
    }

    res.status(200).json({ success: true, data: doctor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getDoctorProfileById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    res.status(200).json({ doctor });
  } catch (error) {
    console.error("Error fetching doctor:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const editProfile = async (req, res) => {
  try {
    const doctor = req.doctor; // Assumes middleware has attached doctor from auth
    if (!doctor) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized access." });
    }
    const doc = await Doctor.findByIdAndUpdate(
      doctor._id,
      { ...req.body, status: "Accepted" },
      {
        new: true,
      }
    );
    res.json(doc);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateDoctorProfile = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const jwt = require("jsonwebtoken");
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "AiDoctor$!23");

    const doctorId = decoded.id;

    const {
      name,
      phone,
      speciality,
      clinicAddress,
      experienceYears,
      availableFrom,
      availableTo,
      photoUrl,
    } = req.body;

    const updatedDoctor = await Doctor.findByIdAndUpdate(
      doctorId,
      {
        firstName: name,
        phone,
        speciality,
        clinicAddress,
        experienceYears,
        availableFrom,
        availableTo,
        photoUrl,
        status: "Accepted",
      },
      { new: true }
    );

    if (!updatedDoctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    return res.status(200).json({
      message: "Profile updated successfully",
      doctor: updatedDoctor,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error" });
  }
};

//to get the list of updated doc whose status was Accepted
const getDoctorsList = async (req, res) => {
  try {
    const acceptedDoctors = await Doctor.find({ status: "Accepted" });

    if (acceptedDoctors.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No accepted doctors found." });
    }

    return res.status(200).json({
      success: true,
      doctors: acceptedDoctors,
    });
  } catch (error) {
    console.error("Error fetching accepted doctors:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// 👇 Export everything at once
module.exports = {
  doctorSignup,
  doctorLogin,
  doctorLogout,
  viewProfile,
  editProfile,
  updateDoctorProfile,
  getDoctorsList,
  getDoctorProfileById,
};
