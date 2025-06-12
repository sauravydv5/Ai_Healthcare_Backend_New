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
  getDoctorHistory,
} = require("../controllers/appointmentController");

// Route for creating an appointment (POST request)
router.post("/appointmentCreate", appointmentAuth, createAppointment);

// Route for getting doctor's appointments list (GET request)
router.get("/appointments-list", appointmentAuth, getAppointmentsList);

// Route for getting patient's appointments (GET request)
router.get("/my-appointments", appointmentAuth, getMyAppointments);

router.patch("/updateStatus/:id", appointmentAuth, updateAppointmentStatus);
router.get("/history", appointmentAuth, getDoctorHistory);

router.post("/submitdiagnosis", appointmentAuth, submitDiagnosis);
router.get(
  "/getdigonsisresult",
  appointmentAuth,
  getCompletedAppointmentsWithDiagnosis
);

module.exports = router;
