const Appointment = require("../models/appointment");

const createAppointment = async (req, res) => {
  try {
    const {
      name, // patient's name
      doctor, // doctor ID or object ID
      appointmentDate,
      appointmentTime,
      reason,
      createdBy,
    } = req.body;

    const patientId = req.user._id;

    // Validate required fields
    if (
      !doctor ||
      !appointmentDate ||
      !appointmentTime ||
      !reason ||
      !createdBy ||
      !name
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required." });
    }

    // Create new appointment document
    const newAppointment = new Appointment({
      name: name,
      patient: patientId,
      doctor,
      appointmentDate,
      appointmentTime,
      reason,
      createdBy,
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
  try {
    const doctorId = req.user._id;

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

const getMyAppointments = async (req, res) => {
  try {
    const patientId = req.user._id;

    const appointments = await Appointment.find({ patient: patientId })
      .populate("doctor", "name email speciality phone clinicAddress") // You can modify this
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

//Reject or accept
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

module.exports = {
  createAppointment,
  getAppointmentsList,
  getMyAppointments,
  updateAppointmentStatus,
  submitDiagnosis,
  getCompletedAppointmentsWithDiagnosis,
};
