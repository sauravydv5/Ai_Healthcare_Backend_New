const Patient = require("../models/patient");
const jwt = require("jsonwebtoken");

// // const patientAuth = async (req, res, next) => {
// //   try {
// //     const { token } = req.cookies;

// //     if (!token) {
// //       return res.status(401).send("Please login as patient!");
// //     }

// //     const decodedObj = jwt.verify(token, process.env.JWT_SECRET);
// //     const { id } = decodedObj;

// //     const patient = await Patient.findById(id);
// //     if (!patient) {
// //       return res.status(404).send({ error: "Patient not found" });
// //     }

// //     req.patient = patient; // Set req.patient for patient routes
// //     next();
// //   } catch (err) {
// //     return res.status(401).send({ error: "Unauthorized: " + err.message });
// //   }
// // };

// // const jwt = require("jsonwebtoken");
// // const Patient = require("../models/patientModel"); // Ensure this is correctly imported

// const patientAuth = async (req, res, next) => {
//   try {
//     const token = req.cookies.token;

//     if (!token) {
//       return res.status(401).json({ error: "Please login to continue." });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET || "AiDoctor$!23");
//     const patient = await Patient.findById(decoded.id).select("-password");

//     if (!patient) {
//       return res.status(404).json({ error: "Patient not found" });
//     }

//     req.patient = patient;
//     next();
//   } catch (error) {
//     console.error("patientAuth error:", error.message);
//     return res.status(401).json({ error: "Unauthorized access" });
//   }
// };

// module.exports = patientAuth;

// NEW CODE

// const jwt = require("jsonwebtoken");
// const Patient = require("../models/patientModel");

const patientAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.patient = await Patient.findById(decoded.id).select("-password");
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token." });
  }
};

module.exports = patientAuth;
