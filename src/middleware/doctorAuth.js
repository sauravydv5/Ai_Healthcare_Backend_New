const jwt = require("jsonwebtoken");
const Doctor = require("../models/doctorLogin");

const doctorAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: "Please login" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "AiDoctor$!23");
    const doctor = await Doctor.findById(decoded.id);
    if (!doctor) return res.status(404).json({ error: "Doctor not found" });

    req.doctor = doctor; // Mongoose document instance
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({ error: "Unauthorized: " + error.message });
  }
};

module.exports = doctorAuth;
