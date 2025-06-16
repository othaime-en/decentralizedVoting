import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { CustomButton, FormField, Loader, StatusModal } from "../components";
import { generateOTP } from "../utils";
import { useStateContext } from "../context";
import { useTheme } from '../context/ThemeContext';

const CreateInstance = () => {
  const navigate = useNavigate();
  const { createNewInstance, addCandidates } = useStateContext();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    instanceName: "",
    organizationName: "",
    description: "",
  });
  const [candidates, setCandidates] = useState([
    { name: "", role: "", description: "" },
  ]);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [modalInfo, setModalInfo] = useState({
    title: "",
    message: "",
    status: "", // 'confirmation', 'error', 'warning'
  });
  const [emailInput, setEmailInput] = useState("");
  const [emails, setEmails] = useState([]);
  const fileInputRef = useRef(null);
  const { isDarkMode } = useTheme();

  const showStatusModal = (title, message, status) => {
    setModalInfo({ title, message, status });
    setIsStatusModalOpen(true);
  };

  const handleEmailInputChange = (e) => {
    setEmailInput(e.target.value);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const text = await file.text();
      const lines = text.split(/\r?\n/);
      const fileEmails = lines
        .map((line) => line.trim())
        .filter((line) => line.length > 0);
      setEmails([...emails, ...fileEmails]);
    }
  };

  const validateEmails = (emailList) => {
    const emailRegex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    const uniqueEmails = Array.from(new Set(emailList));
    const validEmails = uniqueEmails.filter((email) => emailRegex.test(email));
    const invalidEmails = uniqueEmails.filter(
      (email) => !emailRegex.test(email)
    );

    if (invalidEmails.length > 0) {
      throw new Error("Invalid emails detected");
    }

    return validEmails;
  };

  const handleInstanceFieldChange = (fieldName, e) => {
    setForm({ ...form, [fieldName]: e.target.value });
  };

  const handleCandidateFieldChange = (fieldName, e, index) => {
    const updatedCandidates = candidates.map((candidate, idx) => {
      if (idx === index) {
        return { ...candidate, [fieldName]: e.target.value };
      }
      return candidate;
    });
    setCandidates(updatedCandidates);
  };

  const handleAddCandidate = () => {
    const newCandidate = { name: "", role: "", description: "" };
    setCandidates([...candidates, newCandidate]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate emails first
      const combinedEmails = [
        ...emails,
        ...emailInput.split(/\s*,\s*/).filter((email) => email.trim()),
      ];

      if (combinedEmails.length === 0) {
        throw new Error("Please enter emails or upload a file.");
      }

      const validEmails = validateEmails(combinedEmails);

      // Create instance and add candidates in one transaction
      const instanceId = await createNewInstance(
        form.instanceName,
        form.organizationName,
        form.description,
        candidates // Pass candidates directly to be handled in the same transaction
      );

      // If instance creation and candidate addition was successful, send OTPs
      generateOTP(validEmails);

      setIsLoading(false);
      showStatusModal(
        "Success",
        "Voting instance created and invitations sent successfully",
        "confirmation"
      );
      
      // Navigate to profile or instance details
      navigate("/profile");
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      showStatusModal(
        "Error",
        error.message || "Failed to create voting instance",
        "error"
      );
    }
  };

  return (
    <div className={`flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4 transition-colors duration-300 ${
      isDarkMode ? 'bg-[#1c1c24]' : 'bg-white shadow-lg'
    }`}>
      {isLoading && <Loader />}
      <form onSubmit={handleSubmit} className="w-full mt-[20px] flex flex-col gap-[30px]">
        {/* Instance Details Section */}
        <div className="w-full bg-[#8c6dfd] text-white text-center py-[10px] rounded-[10px]">
          <h2 className="font-epilogue font-bold">Create a Voting Instance</h2>
        </div>
        
        <div className="flex flex-wrap gap-[40px]">
          <FormField
            labelName="Instance Name *"
            placeholder="Instance Name"
            inputType="text"
            value={form.instanceName}
            handleChange={(e) => handleInstanceFieldChange("instanceName", e)}
          />
          <FormField
            labelName="Organization Name *"
            placeholder="Organization Name"
            inputType="text"
            value={form.organizationName}
            handleChange={(e) =>
              handleInstanceFieldChange("organizationName", e)
            }
          />
        </div>
        
        <FormField
          labelName="Description *"
          placeholder="Describe the voting instance"
          isTextArea={true}
          value={form.description}
          handleChange={(e) => handleInstanceFieldChange("description", e)}
        />

        {/* Candidate Details Section */}
        <div className="w-full bg-[#8c6dfd] text-white text-center py-[10px] rounded-[10px] mt-[20px]">
          <h2 className="font-epilogue font-bold">Add Candidate Details</h2>
        </div>

        {candidates.map((candidate, index) => (
          <div key={index}>
            <div className="flex flex-wrap gap-[40px]">
              <FormField
                labelName="Candidate Name *"
                placeholder="Candidate Name"
                inputType="text"
                value={candidate.name}
                handleChange={(e) =>
                  handleCandidateFieldChange("name", e, index)
                }
              />
              <FormField
                labelName="Candidate Role *"
                placeholder="Candidate Role"
                inputType="text"
                value={candidate.role}
                handleChange={(e) =>
                  handleCandidateFieldChange("role", e, index)
                }
              />
            </div>
            <FormField
              labelName="Candidate Description *"
              placeholder="Describe the candidate"
              isTextArea={true}
              value={candidate.description}
              handleChange={(e) =>
                handleCandidateFieldChange("description", e, index)
              }
            />
          </div>
        ))}

        <div className="flex justify-end">
          <CustomButton
            btnType="button"
            title="Add another candidate"
            styles="bg-[#1dc071]"
            handleClick={handleAddCandidate}
          />
        </div>

        {/* Voter Emails Section */}
        <div className="w-full bg-[#8c6dfd] text-white text-center py-[10px] rounded-[10px] mt-[20px]">
          <h2 className="font-epilogue font-bold">Add Voters</h2>
        </div>

        <FormField
          labelName="Emails"
          placeholder="Enter emails separated by commas"
          isTextArea={true}
          value={emailInput}
          handleChange={handleEmailInputChange}
        />

        <div className="flex-1 w-full flex flex-col">
          <span className={`font-epilogue font-medium text-[14px] leading-[22px] mb-[10px] transition-colors duration-300 ${
            isDarkMode ? 'text-[#808191]' : 'text-gray-600'
          }`}>
            Upload email list (.csv, .txt)
          </span>
          <input
            type="file"
            onChange={handleFileChange}
            accept=".csv, .txt"
            className={`py-[15px] sm:px-[25px] px-[15px] outline-none border-[1px] font-epilogue text-[14px] rounded-[10px] sm:min-w-[300px] cursor-pointer transition-colors duration-300 ${
              isDarkMode 
                ? 'border-[#3a3a43] bg-transparent text-white placeholder:text-[#4b5264]' 
                : 'border-gray-200 bg-transparent text-gray-900 placeholder:text-gray-500'
            }`}
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-center items-center mt-[20px]">
          <CustomButton
            btnType="submit"
            title="Create Instance & Send Invitations"
            styles="bg-[#4caf50]"
          />
        </div>
      </form>

      <StatusModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        title={modalInfo.title}
        message={modalInfo.message}
        status={modalInfo.status}
      />
    </div>
  );
};

export default CreateInstance; 