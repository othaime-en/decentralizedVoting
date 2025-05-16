require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");
const { body, validationResult } = require("express-validator");

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

// Validation error handler middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Email validation regex
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Generate and send OTP
app.post(
  "/send-otp",
  [
    body("emails")
      .isArray({ min: 1 })
      .withMessage("At least one email is required"),
    body("emails.*")
      .isEmail()
      .withMessage("Invalid email format")
      .matches(emailRegex)
      .withMessage("Invalid email format"),
  ],
  handleValidationErrors,
  (req, res) => {
    const { emails } = req.body;

    const sentEmails = [];
    const failedEmails = [];

    const sendMailPromises = emails.map((email) => {
      return new Promise((resolve) => {
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
            failedEmails.push({ email, error: error.message });
          } else {
            console.log(`OTP sent to ${email}: ${info.response}`);
            sentEmails.push(email);
          }
          resolve();
        });
      });
    });

    Promise.all(sendMailPromises).then(() => {
      return res.status(200).json({
        message: "OTP processing completed",
        sent: sentEmails,
        failed: failedEmails,
      });
    });
  }
);

// Verify OTP
app.post(
  "/verify-otp",
  [
    body("otp")
      .notEmpty()
      .withMessage("OTP is required")
      .isString()
      .withMessage("OTP must be a string")
      .isLength({ min: 6, max: 6 })
      .withMessage("OTP must be 6 digits")
      .isNumeric()
      .withMessage("OTP must contain only numbers"),
  ],
  handleValidationErrors,
  (req, res) => {
    const { otp } = req.body;

    const otpEntry = otpStorage[otp];
    if (!otpEntry) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const isExpired =
      new Date() - new Date(otpEntry.timestamp) > OTP_EXPIRATION_TIME;
    if (isExpired) {
      delete otpStorage[otp];
      return res.status(400).json({ message: "OTP has expired" });
    }

    delete otpStorage[otp];
    return res.status(200).json({ message: "OTP verified successfully" });
  }
);

// Health check endpoint
app.get("/health", (req, res) => {
  return res.status(200).json({ status: "ok", timestamp: new Date() });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
  
  // Check if environment variables are set
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.warn("WARNING: Email credentials not set in environment variables.");
    console.warn("Please create a .env file with EMAIL_USER and EMAIL_PASSWORD.");
  }
});
