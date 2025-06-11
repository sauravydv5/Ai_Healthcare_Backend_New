// const express = require("express");
// const router = express.Router();
// const appointmentAuth = require("../middleware/appointmentAuth");
// const {
//   createAppointment,
//   getAppointmentsList,
//   getMyAppointments,
//   updateAppointmentStatus,
// } = require("../controllers/appointmentController");

// router.post("/appointmentCreate", appointmentAuth, createAppointment);
// router.get("/appointments-list", appointmentAuth, getAppointmentsList);
// router.get("/my-appointments", appointmentAuth, getMyAppointments);
// router.get("/updateStatus", appointmentAuth, updateAppointmentStatus);

// module.exports = router;

const express = require("express");
const router = express.Router();
const appointmentAuth = require("../middleware/appointmentAuth"); // Assuming this is your auth middleware
const {
  createAppointment,
  getAppointmentsList,
  getMyAppointments,
  updateAppointmentStatus,
  submitDiagnosis,
  getCompletedAppointmentsWithDiagnosis,
} = require("../controllers/appointmentController");

// Route for creating an appointment (POST request)
router.post("/appointmentCreate", appointmentAuth, createAppointment);

// Route for getting doctor's appointments list (GET request)
router.get("/appointments-list", appointmentAuth, getAppointmentsList);

// Route for getting patient's appointments (GET request)
router.get("/my-appointments", appointmentAuth, getMyAppointments);

// --- *** THIS IS THE CORRECTED LINE *** ---
// For updating appointment status, use PUT or PATCH, and include the :id parameter
router.patch("/updateStatus/:id", appointmentAuth, updateAppointmentStatus);
// If you specifically want to use POST for updates, it would be:
// router.post("/updateStatus/:id", appointmentAuth, updateAppointmentStatus);
// However, PUT is semantically preferred for full resource updates.

router.post("/submitdiagnosis", appointmentAuth, submitDiagnosis);
router.get(
  "/getdigonsisresult",
  appointmentAuth,
  getCompletedAppointmentsWithDiagnosis
);

module.exports = router;
