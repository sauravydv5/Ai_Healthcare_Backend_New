const jwt = require("jsonwebtoken");
const Doctor = require("../models/doctorLogin");
const Patient = require("../models/patient");

const appointmentAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "AiDoctor$!23");

    // Try finding user as a doctor first
    let user = await Doctor.findById(decoded.id);
    if (user) {
      req.doctor = user;
      req.user = user;
      req.role = "doctor";
      return next();
    }

    // Try finding user as a patient
    user = await Patient.findById(decoded.id);
    if (user) {
      req.patient = user;
      req.user = user;
      req.role = "patient";
      return next();
    }

    return res.status(404).json({ error: "User not found" });
  } catch (error) {
    console.error("Appointment Auth Error:", error);
    return res.status(401).json({ error: "Unauthorized: " + error.message });
  }
};

module.exports = appointmentAuth;
