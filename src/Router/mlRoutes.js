const express = require("express");
const {
  checkSymptoms,
  predictDisease,
} = require("../controllers/aiController");

const router = express.Router();

router.post("/check", checkSymptoms); // POST /api/symptom/check
router.post("/predict-disease", predictDisease);

module.exports = router;
