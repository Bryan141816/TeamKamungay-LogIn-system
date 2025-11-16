
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch'; // if using Node.js < 18, install: npm i node-fetch

dotenv.config(); // Load .env

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(morgan(':date[iso] :method :url :status :response-time ms'));

const API_KEY = process.env.PHILSMS_API_KEY;
const SENDER_ID = "PhilSMS";

if (!API_KEY) {
  console.error("❌ PHILSMS_API_KEY is not set in .env!");
  process.exit(1);
}

// Simple in-memory OTP store (phone -> OTP)
const otpStore = {};

// Send OTP
app.post("/send-otp", async (req, res) => {
  try {
    let { phone } = req.body;
    if (!phone) return res.status(400).json({ error: "Phone is required" });

    // Convert +639XXXXXXXXX -> 639XXXXXXXXX
    if (phone.startsWith("+63")) phone = "63" + phone.slice(3);

    // Generate random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP in memory
    otpStore[phone] = otp;
    console.log(`OTP for ${phone}: ${otp}`);

    // Send SMS
    const response = await fetch("https://dashboard.philsms.com/api/v3/sms/send", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        recipient: phone,
        sender_id: SENDER_ID,
        type: "plain",
        message: `Your OTP Code is ${otp}.`,
      }),
    });

    const data = await response.json();
    console.log("PhilSMS response:", data);

    return res.json({ success: true, data });
  } catch (err) {
    console.error("Failed to send OTP:", err);
    return res.status(500).json({ error: "Failed to send OTP" });
  }
});

// Verify OTP
app.post("/verify-otp", (req, res) => {
  const { phone, otp } = req.body;
  if (!phone || !otp) return res.status(400).json({ error: "Phone and OTP required" });

  let phoneKey = phone;
  if (phoneKey.startsWith("+63")) phoneKey = "63" + phoneKey.slice(3);

  if (otpStore[phoneKey] === otp) {
    delete otpStore[phoneKey]; // Remove OTP after verification
    return res.json({ success: true });
  } else {
    return res.status(400).json({ success: false, error: "Invalid OTP" });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
