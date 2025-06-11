const validator = require("validator");

const validateSignUpData = (data) => {
  const { firstName, lastName, emailId, password } = data;

  if (!firstName || !lastName) {
    throw new Error("Name is not valid!");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Email is not valid!");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter a strong Password!");
  }
};

const validateEditDoctorProfileData = (req) => {
  const allowedEditFields = [
    "name",
    "email",
    "phone",
    "speciality",
    "clinicAddress",
    "experienceYears",
    "availableFrom",
    "availableTo",
    "qualification",
    "consultationFee",
    "languages",
    "profilePicture",
    "about",
    "clinicName",
    "daysAvailable",
  ];

  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );

  return isEditAllowed;
};
const validateEditPatientProfileData = (req) => {
  const allowedEditFields = [
    "name",
    "email",
    "phone",
    "age",
    "gender",
    "address",
    "bloodGroup",
    "medicalHistory",
    "profilePicture",
    "emergencyContact",
    "allergies",
  ];

  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );

  return isEditAllowed;
};

module.exports = {
  validateSignUpData,
  validateEditDoctorProfileData,
  validateEditPatientProfileData,
};
