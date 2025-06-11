const express = require("express");
const router = express.Router();
const patientAuth = require("../middleware/patientAuth");

const {
  patientSignup,
  patientLogin,
  patientLogout,
  getAppliedDoctors,
  viewPatientProfile,
  editPatientProfile,
} = require("../controllers/patientController");

router.post("/signup", patientSignup);
router.post("/login", patientLogin);
router.post("/logout", patientLogout);

router.get("/applied-doctors", patientAuth, getAppliedDoctors);

// patient profile view
router.get("/profile/view", patientAuth, viewPatientProfile);
// patient profile edit
router.patch("/profile/edit", patientAuth, editPatientProfile);

module.exports = router;
