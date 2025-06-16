const Patient = require("../models/patient");
const jwt = require("jsonwebtoken");

// const patientAuth = async (req, res, next) => {
//   try {
//     const { token } = req.cookies;

//     if (!token) {
//       return res.status(401).send("Please login as patient!");
//     }

//     const decodedObj = jwt.verify(token, process.env.JWT_SECRET);
//     const { id } = decodedObj;

//     const patient = await Patient.findById(id);
//     if (!patient) {
//       return res.status(404).send({ error: "Patient not found" });
//     }

//     req.patient = patient; // Set req.patient for patient routes
//     next();
//   } catch (err) {
//     return res.status(401).send({ error: "Unauthorized: " + err.message });
//   }
// };

const jwt = require("jsonwebtoken");
const Patient = require("../models/patientModel"); // Ensure this is correctly imported

const patientAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ error: "Please login to continue." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "AiDoctor$!23");
    const patient = await Patient.findById(decoded.id).select("-password");

    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    req.patient = patient;
    next();
  } catch (error) {
    console.error("patientAuth error:", error.message);
    return res.status(401).json({ error: "Unauthorized access" });
  }
};

module.exports = patientAuth;
