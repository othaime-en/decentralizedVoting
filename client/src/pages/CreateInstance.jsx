import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { CustomButton, FormField, Loader, StatusModal } from "../components";
import { generateOTP } from "../utils";
import { useStateContext } from "../context";

const CreateInstance = () => {
  const navigate = useNavigate();
  const { createNewInstance, addCandidates } = useStateContext();
  const [isLoading, setIsLoading] = useState(false);
  const [instanceId, setInstanceId] = useState(null);
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

  const showStatusModal = (title, message, status) => {
    setModalInfo({ title, message, status });
    setIsStatusModalOpen(true);
  };

  // Handle form email submission and validation
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

  const validateAndSendEmails = (emailList) => {
    const emailRegex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    // Filter unique emails
    const uniqueEmails = Array.from(new Set(emailList));

    // Validate emails
    const validEmails = uniqueEmails.filter((email) => emailRegex.test(email));
    const invalidEmails = uniqueEmails.filter(
      (email) => !emailRegex.test(email)
    );

    if (invalidEmails.length > 0) {
      // Handle invalid emails, e.g., show an error message to the user
      console.error("Invalid emails detected:", invalidEmails);
      showStatusModal(
        "Error",
        "Invalid Emails detected. Please double check your input and try again.",
        "error"
      );

      // Optionally, continue with valid emails or stop the process here
      return; // Early return; adjust based on your application's needs
    }

    console.log("Valid emails ready for OTP:", validEmails);
    // Proceed with OTP sending or further processing for valid emails
    generateOTP(validEmails);
    console.log("OTP sent successfully to all emails");
  };

  const handleSubmitEmails = (e) => {
    e.preventDefault();

    // Combine emails from textarea and file upload
    const combinedEmails = [
      ...emails,
      ...emailInput.split(/\s*,\s*/).filter((email) => email.trim()),
    ];

    // Check if both the email input and file upload are empty
    if (combinedEmails.length === 0) {
      showStatusModal(
        "Error",
        "Please enter emails or upload a file.",
        "error"
      );
      return; // Stop the submission if no emails are provided
    }

    // Call the validate and send function
    validateAndSendEmails(combinedEmails);

    // Reset states
    setEmailInput("");
    setEmails([]);
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

  const handleSubmitInstance = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const instanceId = await createNewInstance(
        form.instanceName,
        form.organizationName,
        form.description
      );
      setInstanceId(instanceId); // Assuming the returned object has an instanceId field
      setIsLoading(false);
      showStatusModal(
        "Success",
        "Voting instance created successfully",
        "confirmation"
      );
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      showStatusModal("Error", "Failed to create voting instance", "error");
    }
  };

  const handleSubmitCandidates = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await addCandidates(instanceId, candidates);
      setIsLoading(false);
      showStatusModal(
        "Success",
        "Candidates added successfully",
        "confirmation"
      );
      // navigate("/profile"); // Or navigate to a confirmation/success page
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      showStatusModal("Error", "Failed to add candidates", "error");
    }
  };

  return (
    <div className="bg-[#1c1c24] flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4">
      {isLoading && <Loader />}
      <form
        onSubmit={handleSubmitInstance}
        className="w-full mt-[20px] flex flex-col gap-[30px]"
      >
        <div className="w-full bg-[#8c6dfd] text-white text-center py-[10px] rounded-[10px]">
          <h2 className="font-epilogue font-bold">
            1. Create a Voting Instance
          </h2>
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
        {!instanceId && (
          <div className="flex justify-center items-center">
            <CustomButton
              btnType="submit"
              title="Create Instance"
              styles="bg-[#1dc071]"
            />
          </div>
        )}
      </form>

      {/* Candidate Details Form */}
      {instanceId && ( // Only show this form if an instanceId is set
        <form
          onSubmit={handleSubmitCandidates}
          className="w-full mt-[40px] flex flex-col gap-[30px]"
        >
          <div className="w-full bg-[#8c6dfd] text-white text-center py-[10px] rounded-[10px]">
            <h2 className="font-epilogue font-bold">
              2. Add Candidate Details
            </h2>
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
          <div className="flex justify-between items-center">
            <CustomButton
              btnType="button"
              title="Add another candidate"
              styles="bg-[#1dc071]"
              handleClick={handleAddCandidate}
            />
            <CustomButton
              btnType="submit"
              title="Submit Candidates"
              styles="bg-[#4caf50]"
            />
          </div>
        </form>
      )}
      {instanceId && (
        <form
          onSubmit={handleSubmitEmails}
          className="w-full mt-4 flex flex-col gap-4"
        >
          <div className="w-full bg-[#8c6dfd] text-white text-center py-[10px] rounded-[10px]">
            <h2 className="font-epilogue font-bold">
              3. Add Voters to your instance
            </h2>
          </div>
          <FormField
            labelName="Emails"
            placeholder="Enter emails separated by commas"
            isTextArea={true}
            value={emailInput}
            handleChange={handleEmailInputChange}
          />
          <div className="flex-1 w-full flex flex-col">
            <span className="font-epilogue font-medium text-[14px] leading-[22px] text-[#808191] mb-[10px]">
              Upload email list (.csv, .txt)
            </span>
            <input
              type="file"
              onChange={handleFileChange}
              accept=".csv, .txt"
              className="py-[15px] sm:px-[25px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[14px] placeholder:text-[#4b5264] rounded-[10px] sm:min-w-[300px] cursor-pointer"
            />
          </div>
          <div className="flex justify-between items-center gap-4">
            <CustomButton
              btnType="submit"
              title="Submit Emails"
              styles="bg-[#4caf50]"
            />
          </div>
        </form>
      )}
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
