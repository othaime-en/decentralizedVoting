import React, { useState } from "react";
import { CustomButton, FormField } from "../components"; // Adjust the path as needed

const VotersInput = ({ onVotersAdded }) => {
  const [emailInput, setEmailInput] = useState("");
  const [file, setFile] = useState(null);

  const handleEmailChange = (e) => {
    setEmailInput(e.target.value);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const parseEmailsFromText = (text) => {
    // Split text by new lines and commas for CSV, then filter out any empty strings
    return text
      .split(/[\n,]+/)
      .map((email) => email.trim())
      .filter((email) => email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let emails = [];

    if (emailInput) {
      emails = parseEmailsFromText(emailInput);
    }

    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const text = e.target.result;
        const fileEmails = parseEmailsFromText(text);
        onVotersAdded([...emails, ...fileEmails]);
      };
      reader.readAsText(file);
    } else {
      onVotersAdded(emails);
    }

    // Reset form
    setEmailInput("");
    setFile(null);
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
        />
      </div>
    </form>
  );
};

export default VotersInput;
