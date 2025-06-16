// const jwt = require("jsonwebtoken");
// const Doctor = require("../models/doctorLogin");

// const doctorAuth = async (req, res, next) => {
//   try {
//     const token = req.cookies.token;
//     if (!token) return res.status(401).json({ error: "Please login" });

//     const decoded = jwt.verify(token, process.env.JWT_SECRET || "AiDoctor$!23");
//     const doctor = await Doctor.findById(decoded.id);
//     if (!doctor) return res.status(404).json({ error: "Doctor not found" });

//     req.doctor = doctor; // Mongoose document instance
//     next();
//   } catch (error) {
//     console.error("Auth middleware error:", error);
//     res.status(401).json({ error: "Unauthorized: " + error.message });
//   }
// };

// module.exports = doctorAuth;

// const jwt = require("jsonwebtoken");
// const Doctor = require("../models/doctorLogin");

// const doctorAuth = async (req, res, next) => {
//   try {
//     const token = req.cookies.token;

//     if (!token) {
//       return res.status(401).json({ error: "Please login to continue." });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const doctor = await Doctor.findById(decoded.id).select("-password");

//     if (!doctor) {
//       return res.status(404).json({ error: "Doctor not found" });
//     }

//     req.doctor = doctor;
//     next();
//   } catch (error) {
//     console.error("doctorAuth error:", error.message);
//     return res.status(401).json({ error: "Unauthorized access" });
//   }
// };

// module.exports = doctorAuth;

const jwt = require("jsonwebtoken");
const Doctor = require("../models/doctorLogin");

const doctorAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

    if (!token) {
      return res.status(401).json({ error: "Token missing. Please login." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const doctor = await Doctor.findById(decoded.id).select("-password");

    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    req.doctor = doctor;
    next();
  } catch (error) {
    console.error("doctorAuth error:", error.message);
    return res.status(401).json({ error: "Unauthorized access" });
  }
};

module.exports = doctorAuth;
