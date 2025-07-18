const express = require("express");
const connectDB = require("./database/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const doctorRoutes = require("./Router/doctorRoutes");
const patientRoutes = require("./Router/patientRoutes");
const appointmentRoutes = require("./Router/appointmentRoute");
const chatBoatRoute = require("./Router/chatBoatRoute");
const symptomRoutes = require("./Router/mlRoutes");
const paymentRoutes = require("./Router/paymentRoutes");

require("dotenv").config();
const app = express();

// Middleware
app.use(
  cors({
    origin: ["http://localhost:5173", "https://swathyaai.netlify.app"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/doctor", doctorRoutes);
app.use("/patient", patientRoutes);
app.use("/appointments", appointmentRoutes);
app.use("/chatbot", chatBoatRoute);

app.use("/api/symptom", symptomRoutes);
app.use("/payment", paymentRoutes);
// Start server after DB connection
connectDB()
  .then(() => {
    console.log("✅ Database Connection Established!");
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err);
  });
