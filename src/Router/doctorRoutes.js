const express = require("express");
const router = express.Router();
const doctorAuth = require("../middleware/doctorAuth");
const upload = require("../controllers/upload");

const {
  doctorSignup,
  doctorLogin,
  applyAsDoctor,
  doctorLogout,
  viewProfile,
  editProfile,
} = require("../controllers/doctorController");

// Doctor signup
router.post("/signup", doctorSignup);

// Doctor login
router.post("/login", doctorLogin);

//ApplyAs a doctor
router.post(
  "/apply-doctor",
  upload.single("picture"),
  doctorAuth,
  applyAsDoctor
);

// Doctor logout
router.post("/logout", doctorLogout);

// Doctor profile view (authenticated doctor hi access kar sakta hai)
router.get("/profile/view", doctorAuth, viewProfile);

// Doctor profile edit (authenticated doctor hi access kar sakta hai)
router.patch("/profile/edit", doctorAuth, editProfile);

module.exports = router;
