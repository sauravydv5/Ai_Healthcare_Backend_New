const express = require("express");
const { checkSymptoms } = require("../controllers/aiController");

const router = express.Router();

router.post("/check", checkSymptoms); // POST /api/symptom/check

module.exports = router;
