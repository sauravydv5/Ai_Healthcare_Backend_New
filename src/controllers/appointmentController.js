const mongoose = require("mongoose");
const Appointment = require("../models/appointment");
const user = require("../models/User");
const Doctor = require("../models/doctorLogin");
const Patient = require("../models/patient");

// const createAppointment = async (req, res) => {
//   try {
//     const {
//       name,
//       doctor,
//       appointmentDate,
//       appointmentTime,
//       reason,
//       createdBy,
//     } = req.body;

//     const patientId = req.user._id;

//     // Validate required fields
//     if (!name || !doctor || !appointmentDate || !appointmentTime || !reason) {
//       return res
//         .status(400)
//         .json({ success: false, message: "All fields are required." });
//     }

//     // Create new appointment document
//     const newAppointment = new Appointment({
//       name: name,
//       patient: patientId,
//       doctor,
//       appointmentDate,
//       appointmentTime,
//       reason,
//     });

//     const savedAppointment = await newAppointment.save();

//     return res.status(201).json({
//       success: true,
//       message: "Appointment booked successfully",
//       data: savedAppointment,
//     });
//   } catch (error) {
//     console.error("Appointment creation error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Something went wrong. Please try again.",
//       error: error.message,
//     });
//   }
// };

//For doc who see appointement list

//NEW CODE
const createAppointment = async (req, res) => {
  try {
    const {
      name,
      doctor,
      appointmentDate,
      appointmentTime,
      reason,
      createdBy,
    } = req.body;

    const patientId = req.patient._id; // ✅ Corrected from req.user

    // Validate required fields
    if (!name || !doctor || !appointmentDate || !appointmentTime || !reason) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    // Create new appointment document
    const newAppointment = new Appointment({
      name,
      patient: patientId,
      doctor,
      appointmentDate,
      appointmentTime,
      reason,
      createdBy: createdBy || "Patient", // fallback
    });

    const savedAppointment = await newAppointment.save();

    return res.status(201).json({
      success: true,
      message: "Appointment booked successfully",
      data: savedAppointment,
    });
  } catch (error) {
    console.error("Appointment creation error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again.",
      error: error.message,
    });
  }
};

const getAppointmentsList = async (req, res) => {
  // console.log("Doctor from token middleware:", req.user);

  try {
    const doctorId = req.user._id;

    // Fetch all appointments for this doctor
    const appointments = await Appointment.find({ doctor: doctorId })
      .populate("patient", "firstName lastName emailId phone")
      .sort({ appointmentDate: 1, appointmentTime: 1 });

    res.status(200).json({
      success: true,
      message: "Doctor appointments fetched successfully",
      data: appointments,
    });
  } catch (error) {
    console.error("Fetching doctor appointments failed:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch doctor appointments",
      error: error.message,
    });
  }
};

//for patient who see whom applied for appointment
const getMyAppointments = async (req, res) => {
  try {
    const patientId = req.user._id;

    const appointments = await Appointment.find({ patient: patientId })
      .populate("doctor", "name emailId speciality phone clinicAddress")
      .sort({ appointmentDate: -1, appointmentTime: 1 });

    res.status(200).json({
      success: true,
      message: "Patient appointments fetched successfully",
      data: appointments,
    });
  } catch (error) {
    console.error("Fetching patient appointments failed:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

//Reject or accept by doctor
const updateAppointmentStatus = async (req, res) => {
  try {
    const doctorId = req.user._id;
    const appointmentId = req.params.id;
    const { status } = req.body; // accepted or rejected

    if (!["accepted", "rejected"].includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status" });
    }

    const appointment = await Appointment.findOne({
      _id: appointmentId,
      doctor: doctorId,
    });

    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found" });
    }

    appointment.status = status;
    await appointment.save();

    res.status(200).json({
      success: true,
      message: `Appointment ${status}`,
      data: appointment,
    });
  } catch (error) {
    console.error("Update status failed:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /appointments/submit-diagnosis
const submitDiagnosis = async (req, res) => {
  try {
    const doctorId = req.doctor._id;
    const { appointmentId, diagnosis, prescription } = req.body;

    if (!appointmentId || !diagnosis || !prescription) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required." });
    }

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found." });
    }

    if (appointment.doctor.toString() !== doctorId.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized action." });
    }

    appointment.diagnosis = diagnosis;
    appointment.prescription = prescription;
    appointment.status = "accepted";

    await appointment.save();

    return res.status(200).json({
      success: true,
      message: "Diagnosis and prescription submitted successfully.",
      data: appointment,
    });
  } catch (error) {
    console.error("Error submitting diagnosis:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

//GET diagonis resultr from patient..
const getCompletedAppointmentsWithDiagnosis = async (req, res) => {
  try {
    const patientId = req.patient._id;

    const completedAppointments = await Appointment.find({
      patient: patientId,
      status: "accepted",
    })
      .populate("doctor", "firstName lastName speciality emailId")
      .select(
        "appointmentDate appointmentTime reason diagnosis prescription status"
      );

    res.status(200).json({
      success: true,
      data: completedAppointments,
    });
  } catch (error) {
    console.error("Error fetching diagnosis:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// For doctor: Get diagnosis + prescription history

// const getDoctorActivitySummary = async (req, res) => {
//   try {
//     const doctorId = req.doctor?._id || req.user?._id;

//     // Total Appointments
//     const totalAppointments = await Appointment.countDocuments({
//       doctor: doctorId,
//     });

//     // Accepted
//     const acceptedAppointments = await Appointment.countDocuments({
//       doctor: doctorId,
//       status: "accepted",
//     });

//     // Rejected
//     const rejectedAppointments = await Appointment.countDocuments({
//       doctor: doctorId,
//       status: "rejected",
//     });

//     // With diagnosis
//     const diagnosedAppointments = await Appointment.countDocuments({
//       doctor: doctorId,
//       status: "accepted",
//       diagnosis: { $ne: null },
//       prescription: { $ne: null },
//     });

//     // Profile update history (count how many times updated)
//     const doctor = await Doctor.findById(doctorId);
//     const profileUpdatedCount = doctor.profileUpdatedCount || 0;

//     res.status(200).json({
//       success: true,
//       message: "Doctor activity summary fetched successfully.",
//       data: {
//         totalAppointments,
//         acceptedAppointments,
//         rejectedAppointments,
//         diagnosedAppointments,
//         profileUpdatedCount,
//       },
//     });
//   } catch (error) {
//     console.error("Doctor summary fetch error:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

const getDoctorActivitySummary = async (req, res) => {
  try {
    let query = {};
    if (req.user?.role === "patient") {
      query.patient = req.user._id;
    } else if (req.doctor || req.user?.role === "doctor") {
      query.doctor = req.doctor?._id || req.user._id;
    } else {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    const allAppointments = await Appointment.find(query);

    const accepted = allAppointments.filter(
      (a) => a.status === "accepted"
    ).length;
    const rejected = allAppointments.filter(
      (a) => a.status === "rejected"
    ).length;
    const diagnosed = allAppointments.filter((a) => a.prescription).length;

    res.status(200).json({
      success: true,
      message: "History fetched",
      data: {
        totalAppointments: allAppointments.length,
        acceptedAppointments: accepted,
        rejectedAppointments: rejected,
        diagnosedAppointments: diagnosed,
      },
    });
  } catch (error) {
    console.error("History fetch error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const deleteMyAppointment = async (req, res) => {
  try {
    const appt = await Appointment.findById(req.params.id);
    if (!appt) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    await appt.deleteOne(); // Or appt.remove()
    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (error) {
    console.error("Delete Appointment Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  createAppointment,
  getAppointmentsList,
  getMyAppointments,
  updateAppointmentStatus,
  submitDiagnosis,
  getCompletedAppointmentsWithDiagnosis,
  getDoctorActivitySummary,
  deleteMyAppointment,
};
