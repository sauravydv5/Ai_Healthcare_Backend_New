const express = require("express");
const router = express.Router();
const doctorAuth = require("../middleware/doctorAuth");

const {
  doctorSignup,
  doctorLogin,

  doctorLogout,
  viewProfile,
  editProfile,
  updateDoctorProfile,
  getDoctorsList,
  getDoctorProfileById,
} = require("../controllers/doctorController");

// Doctor signup
router.post("/signup", doctorSignup);

// Doctor login
router.post("/login", doctorLogin);

// Doctor logout
router.post("/logout", doctorLogout);

// Doctor profile view (authenticated doctor hi access kar sakta hai)
router.get("/profile/view", doctorAuth, viewProfile);

// Doctor profile edit (authenticated doctor hi access kar sakta hai)
router.patch("/profile/edit", doctorAuth, editProfile);

//to see doc updated profile
router.get("/profile/edit", doctorAuth, updateDoctorProfile);
//to see doc  profile by id
router.get("/profile/:id", getDoctorProfileById);

// get doctors list
router.get("/list", getDoctorsList);

module.exports = router;
