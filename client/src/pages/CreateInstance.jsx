import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { useStateContext } from "../context";
import { CustomButton, FormField, Loader } from "../components";
import { checkIfImage } from "../utils";
import { StatusModal } from "../components";

const CreateInstance = () => {
  const navigate = useNavigate();
  const { createInstance } = useStateContext();
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

  const handleFormFieldChange = (fieldName, e) => {
    setForm({ ...form, [fieldName]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      const data = await createInstance({
        ...form,
        candidates,
        emails,
      });

      setInstanceId(data);
      setIsStatusModalOpen(true);
      setModalInfo({
        title: "Success!",
        message: "Your instance has been created successfully.",
        status: "confirmation",
      });
    } catch (error) {
      console.error("Error creating instance:", error);
      setIsStatusModalOpen(true);
      setModalInfo({
        title: "Error",
        message: "Failed to create instance. Please try again.",
        status: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCandidateChange = (index, field, value) => {
    const newCandidates = [...candidates];
    newCandidates[index][field] = value;
    setCandidates(newCandidates);
  };

  const addCandidate = () => {
    setCandidates([...candidates, { name: "", role: "", description: "" }]);
  };

  const removeCandidate = (index) => {
    const newCandidates = candidates.filter((_, i) => i !== index);
    setCandidates(newCandidates);
  };

  const handleEmailInputChange = (e) => {
    setEmailInput(e.target.value);
  };

  const addEmail = () => {
    if (emailInput && /\S+@\S+\.\S+/.test(emailInput)) {
      setEmails([...emails, emailInput.trim()]);
      setEmailInput("");
    }
  };

  const removeEmail = (index) => {
    const newEmails = emails.filter((_, i) => i !== index);
    setEmails(newEmails);
  };

  const handleModalClose = () => {
    setIsStatusModalOpen(false);
    if (modalInfo.status === "confirmation") {
      navigate("/");
    }
  };

  return (
    <div className="bg-[#1c1c24] flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4">
      {isLoading && <Loader />}

      <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#3a3a43] rounded-[10px]">
        <h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white">
          Create a New Instance
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full mt-[65px] flex flex-col gap-[30px]"
      >
        <div className="flex flex-wrap gap-[40px]">
          <FormField
            labelName="Instance Name *"
            placeholder="Write your instance name"
            inputType="text"
            value={form.instanceName}
            handleChange={(e) => handleFormFieldChange("instanceName", e)}
          />
          <FormField
            labelName="Organization Name *"
            placeholder="Write your organization name"
            inputType="text"
            value={form.organizationName}
            handleChange={(e) => handleFormFieldChange("organizationName", e)}
          />
        </div>

        <FormField
          labelName="Description *"
          placeholder="Write your description"
          isTextArea
          value={form.description}
          handleChange={(e) => handleFormFieldChange("description", e)}
        />

        <div className="flex flex-col gap-[30px]">
          <h3 className="font-epilogue font-bold text-[18px] text-white">
            Candidates
          </h3>
          {candidates.map((candidate, index) => (
            <div key={index} className="flex flex-col gap-[15px]">
              <div className="flex justify-between items-center">
                <h4 className="font-epilogue font-semibold text-[16px] text-white">
                  Candidate {index + 1}
                </h4>
                {candidates.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeCandidate(index)}
                    className="text-red-500"
                  >
                    Remove
                  </button>
                )}
              </div>
              <FormField
                labelName="Name *"
                placeholder="Candidate name"
                inputType="text"
                value={candidate.name}
                handleChange={(e) =>
                  handleCandidateChange(index, "name", e.target.value)
                }
              />
              <FormField
                labelName="Role *"
                placeholder="Candidate role"
                inputType="text"
                value={candidate.role}
                handleChange={(e) =>
                  handleCandidateChange(index, "role", e.target.value)
                }
              />
              <FormField
                labelName="Description"
                placeholder="Candidate description"
                isTextArea
                value={candidate.description}
                handleChange={(e) =>
                  handleCandidateChange(index, "description", e.target.value)
                }
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addCandidate}
            className="bg-[#1dc071] text-white px-4 py-2 rounded"
          >
            Add Candidate
          </button>
        </div>

        <div className="flex flex-col gap-[30px]">
          <h3 className="font-epilogue font-bold text-[18px] text-white">
            Voters
          </h3>
          <div className="flex gap-[15px]">
            <FormField
              labelName="Email"
              placeholder="Enter voter email"
              inputType="email"
              value={emailInput}
              handleChange={handleEmailInputChange}
            />
            <button
              type="button"
              onClick={addEmail}
              className="bg-[#1dc071] text-white px-4 py-2 rounded mt-[24px]"
            >
              Add Email
            </button>
          </div>
          <div className="flex flex-wrap gap-[10px]">
            {emails.map((email, index) => (
              <div
                key={index}
                className="bg-[#28282e] text-white px-3 py-1 rounded flex items-center gap-[5px]"
              >
                <span>{email}</span>
                <button
                  type="button"
                  onClick={() => removeEmail(index)}
                  className="text-red-500 ml-2"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center items-center mt-[40px]">
          <CustomButton
            btnType="submit"
            title="Submit new instance"
            styles="bg-[#1dc071]"
          />
        </div>
      </form>

      <StatusModal
        isOpen={isStatusModalOpen}
        onClose={handleModalClose}
        title={modalInfo.title}
        message={modalInfo.message}
        status={modalInfo.status}
      />
    </div>
  );
};

export default CreateInstance; 