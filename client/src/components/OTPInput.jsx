import React, { useState } from "react";

const OTPInput = () => {
  const [otp, setOtp] = useState("");

  const handleChange = (event) => {
    const { value } = event.target;
    const regex = /^[0-9\b]+$/;
    if (value === "" || regex.test(value)) {
      setOtp(value.slice(0, 6));
    }
  };

  const handleKeyUp = () => {
    if (otp.length === 6) {
      verifyOTP();
    }
  };

  const verifyOTP = () => {
    console.log("Verifying OTP:", otp);
    // Verification logic to be implemented here.
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
          width: "100%", // Adjust width as needed
          padding: "10px 15px",
          margin: "10px 0",
          fontSize: "18px",
          textAlign: "center",
          letterSpacing: "8px", // Space out the digits
          color: "white",
          background: "#2a2a35",
          border: "1px solid #3a3a43",
          borderRadius: "10px",
        }}
      />
    </div>
  );
};

export default OTPInput;
