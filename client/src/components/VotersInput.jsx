import React, { useState, useEffect } from "react";
import { CustomButton, FormField } from "../components"; // Adjust the path as needed

const VotersInput = ({ onVotersAdded }) => {
  const [emailInput, setEmailInput] = useState("");
  const [file, setFile] = useState(null);
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    // Update form validity on email or file input change
    const emails = parseEmailsFromText(emailInput);
    setIsFormValid(emails.length > 0 || file !== null);
  }, [emailInput, file]);

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const parseEmailsFromText = (text) => {
    return text
      .split(/[\n,]+/)
      .map((email) => email.trim())
      .filter((email) => email && isValidEmail(email));
  };

  const handleEmailChange = (e) => {
    setEmailInput(e.target.value);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let emails = parseEmailsFromText(emailInput);

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileContent = e.target.result;
        const fileEmails = parseEmailsFromText(fileContent);
        const allEmails = [...new Set([...emails, ...fileEmails])]; // Remove duplicates
        if (allEmails.length > 0) {
          onVotersAdded(allEmails);
          // Reset form upon successful handling
          setEmailInput("");
          setFile(null);
          setIsFormValid(false);
        } else {
          // Handle case where no valid emails are found
          console.error("No valid emails provided.");
        }
      };
      reader.readAsText(file);
    } else if (emails.length > 0) {
      onVotersAdded(emails);
      // Reset form upon successful handling
      setEmailInput("");
      setFile(null);
      setIsFormValid(false);
    } else {
      // Handle case where no valid emails are inputted and no file is selected
      console.error(
        "Please input valid emails or select a file with valid emails."
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full mt-[40px] flex flex-col gap-[30px]"
    >
      <FormField
        labelName="Email Addresses (comma or newline separated):"
        isTextArea={true}
        value={emailInput}
        handleChange={handleEmailChange}
      />
      <label className="flex flex-col items-start">
        <span className="text-white mb-2">Or upload a CSV/TXT file:</span>
        <input
          type="file"
          accept=".csv, .txt"
          onChange={handleFileChange}
          className="bg-[#8c6dfd] text-white file:mr-4 file:py-2 file:px-4 file:rounded-[10px] file:border-0 file:text-sm file:font-semibold file:bg-[#4caf50] hover:file:bg-[#1dc071]"
        />
      </label>
      <div className="flex justify-center items-center">
        <CustomButton
          btnType="submit"
          title="Add Voters"
          styles="bg-[#1dc071]"
          disabled={!isFormValid}
        />
      </div>
    </form>
  );
};

export default VotersInput;
