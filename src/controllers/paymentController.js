const Razorpay = require("razorpay");
const crypto = require("crypto");
const Appointment = require("../models/appointment"); // adjust path

const razorpay = new Razorpay({
  key_id: "rzp_test_tNCWdVrA2X7cT9",
  key_secret: "qbTCh0Ufcuqeq6lXbf98uzGq",
});

exports.createOrder = async (req, res) => {
  try {
    const options = {
      amount: req.body.amount * 100,
      currency: "INR",
      receipt: `receipt_order_${Math.floor(Math.random() * 100000)}`,
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error("Order creation failed:", error);
    res.status(500).json({ error: "Order creation failed" });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      appointmentId,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", "qbTCh0Ufcuqeq6lXbf98uzGq")
      .update(body)
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      await Appointment.findByIdAndUpdate(appointmentId, {
        paymentDone: true,
      });

      return res.json({ success: true, message: "Payment verified" });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Invalid signature" });
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({ error: "Verification failed" });
  }
};
