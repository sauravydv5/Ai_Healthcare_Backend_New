const Patient = require("../models/patient");
const jwt = require("jsonwebtoken");

const patientAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).send("Please login as patient!");
    }

    const decodedObj = jwt.verify(token, process.env.JWT_SECRET);
    const { id } = decodedObj;

    const patient = await Patient.findById(id);
    if (!patient) {
      return res.status(404).send({ error: "Patient not found" });
    }

    req.patient = patient; // Set req.patient for patient routes
    next();
  } catch (err) {
    return res.status(401).send({ error: "Unauthorized: " + err.message });
  }
};

module.exports = patientAuth;
