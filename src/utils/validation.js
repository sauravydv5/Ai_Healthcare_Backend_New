const validator = require("validator");

const validateSignUpData = (data) => {
  const { firstName, lastName, emailId, password } = data;

  if (!firstName || !lastName) {
    throw new Error("Name is not valid!");
  } else if (
    !emailId ||
    typeof emailId !== "string" ||
    !validator.isEmail(emailId)
  ) {
    throw new Error("Email is not valid!");
  } else if (
    !password ||
    typeof password !== "string" ||
    !validator.isStrongPassword(password)
  ) {
    throw new Error("Please enter a strong password!");
  }
};

const validateEditDoctorProfileData = (req) => {
  const allowedEditFields = [
    "firstName",
    "emailId",
    "phone",
    "age",
    "gender",
    "address",
    "bloodGroup",
    "medicalHistory",
    "emergencyContact",
    "allergies",
    "photoUrl",
  ];

  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );

  return isEditAllowed;
};

//pPatient Edit Profile
const validateEditPatientProfileData = (req) => {
  const allowedEditFields = [
    "firstName",
    "emailId",
    "phone",
    "age",
    "gender",
    "address",
    "bloodGroup",
    "medicalHistory",
    "emergencyContact",
    "allergies",
    "photoUrl",
  ];

  return Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );
};

module.exports = {
  validateSignUpData,
  validateEditDoctorProfileData,
  validateEditPatientProfileData,
};
