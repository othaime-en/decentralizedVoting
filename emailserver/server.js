require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(cors());

// Email configuration from environment variables
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || "gmail",
  auth: {
    user: process.env.EMAIL_USER || "your_email@example.com",
    pass: process.env.EMAIL_PASSWORD || "your_app_password",
  },
});

const otpStorage = {};

const OTP_EXPIRATION_TIME = parseInt(process.env.OTP_EXPIRATION_TIME) || 120 * 60 * 1000;

// Generate and send OTP
app.post("/send-otp", (req, res) => {
  const { emails } = req.body; // Expecting 'emails' to be an array
  if (!emails || emails.length === 0) {
    return res.status(400).send("Emails are required");
  }

  emails.forEach((email) => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStorage[otp] = { email, timestamp: new Date() };

    const mailOptions = {
      from: process.env.EMAIL_USER || "your_email@example.com",
      to: email,
      subject: "Your Voting OTP",
      text:
        `Your OTP for voting is: ${otp}` +
        "\n\n" +
        "This OTP will expire in 60 minutes",
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(`Failed to send OTP to ${email}: ${error}`);
      } else {
        console.log(`OTP sent to ${email}: ${info.response}`);
      }
    });
  });

  return res.send("OTP sent successfully to all provided emails");
});

// Verify OTP
app.post("/verify-otp", (req, res) => {
  const { otp } = req.body;
  if (!otp) {
    return res.status(400).send("OTP is required");
  }

  const otpEntry = otpStorage[otp];
  if (!otpEntry) {
    return res.status(400).send("Invalid OTP");
  }

  const isExpired =
    new Date() - new Date(otpEntry.timestamp) > OTP_EXPIRATION_TIME;
  if (isExpired) {
    delete otpStorage[otp];
    return res.status(400).send("OTP has expired");
  }

  delete otpStorage[otp];
  return res.send("OTP verified successfully");
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
  
  // Check if environment variables are set
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.warn("WARNING: Email credentials not set in environment variables.");
    console.warn("Please create a .env file with EMAIL_USER and EMAIL_PASSWORD.");
  }
});
