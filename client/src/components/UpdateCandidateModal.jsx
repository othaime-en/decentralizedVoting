import React, { useState, useEffect } from "react";
import FormField from "./FormField"; // Adjust import paths as needed
import CustomButton from "./CustomButton"; // Adjust import paths as needed

const UpdateCandidateModal = ({ isOpen, onClose, candidate, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    description: "",
  });

  // Populate form data when the modal opens with candidate details
  useEffect(() => {
    if (candidate) {
      setFormData({
        name: candidate.name,
        role: candidate.role,
        description: candidate.description,
      });
    }
  }, [candidate]);

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate({ ...formData, candidateId: candidate.candidateId });
    onClose(); // Close the modal after submission
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-[#1c1c24] p-5 rounded-lg max-w-lg w-full">
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <div className="w-full bg-[#8c6dfd] text-white text-center py-2 rounded-t-lg">
            <h2 className="font-epilogue font-bold">
              Update Candidate Details
            </h2>
          </div>
          <FormField
            labelName="Candidate Name *"
            placeholder="Candidate Name"
            inputType="text"
            value={formData.name}
            handleChange={(e) => handleFieldChange("name", e.target.value)}
          />
          <FormField
            labelName="Candidate Role *"
            placeholder="Candidate Role"
            inputType="text"
            value={formData.role}
            handleChange={(e) => handleFieldChange("role", e.target.value)}
          />
          <FormField
            labelName="Candidate Description *"
            placeholder="Describe the candidate"
            isTextArea={true}
            value={formData.description}
            handleChange={(e) =>
              handleFieldChange("description", e.target.value)
            }
          />
          <div className="flex justify-between items-center mt-4">
            <CustomButton
              btnType="submit"
              title="Update Candidate"
              styles="bg-[#4caf50]"
            />
            <button
              onClick={onClose}
              className="text-white bg-red-600 hover:bg-red-700 font-bold py-2 px-4 rounded-full"
              aria-label="Close Modal"
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateCandidateModal;
