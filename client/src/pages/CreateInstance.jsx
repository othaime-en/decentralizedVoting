import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CustomButton, FormField, Loader, VotersInput } from "../components";
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
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const handleSubmitCandidates = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await addCandidates(instanceId, candidates);
      setIsLoading(false);
      navigate("/profile"); // Or navigate to a confirmation/success page
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  // Function to handle voters added, potentially sending OTPs here
  const handleVotersAdded = (emails) => {
    console.log("Voters added:", emails);
    // Here you'd typically handle the voters, such as by calling an API to register them
    navigate("/profile"); // Redirect after voters are added
  };

  return (
    <div className="bg-[#1c1c24] flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4">
      {isLoading && <Loader />}
      <form
        onSubmit={handleSubmitInstance}
        className="w-full mt-[20px] flex flex-col gap-[30px]"
      >
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

      <div>
        <VotersInput onVotersAdded={handleVotersAdded} />
      </div>
    </div>
  );
};

export default CreateInstance;
