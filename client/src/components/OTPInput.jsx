import React, { useState } from "react";

const OTPInput = ({ onOtpVerification }) => {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState(""); // For success/error messages
  const [messageColor, setMessageColor] = useState("green"); // Default color

  const handleChange = (event) => {
    const { value } = event.target;
    const regex = /^[0-9\b]+$/;
    if (value === "" || regex.test(value)) {
      setOtp(value.slice(0, 6));
    }
  };

  const handleKeyUp = () => {
    if (otp.length === 6) {
      verifyOTP(otp);
    }
  };

  const verifyOTP = async (otp) => {
    try {
      const response = await fetch("http://localhost:3001/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ otp }),
      });

      if (response.ok) {
        setMessage("OTP verified successfully");
        setMessageColor("green");
        onOtpVerification(true); // Inform parent component about successful verification
      } else {
        const error = await response.text();
        setMessage(error);
        setMessageColor("red");
        onOtpVerification(false); // Inform parent component about failed verification
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Failed to verify OTP");
      setMessageColor("red");
      onOtpVerification(false); // Handle errors
    }
  };

  return (
    <div>
      <p className="font-epilogue font-medium text-[16px] leading-[30px] text-center text-[#808191]">
        Please input OTP to start voting
      </p>
      <input
        type="tel"
        maxLength="6"
        className="otp-input"
        value={otp}
        onChange={handleChange}
        onKeyUp={handleKeyUp}
        placeholder="••••••"
        style={{
          width: "100%",
          padding: "10px 15px",
          margin: "10px 0",
          fontSize: "18px",
          textAlign: "center",
          letterSpacing: "8px",
          color: "white",
          background: "#2a2a35",
          border: "1px solid #3a3a43",
          borderRadius: "10px",
        }}
      />
      {/* Message display */}
      <p
        style={{
          color: messageColor,
          fontFamily: "'Epilogue', sans-serif",
          textAlign: "center",
          marginTop: "10px",
        }}
      >
        {message}
      </p>
    </div>
  );
};

export default OTPInput;
