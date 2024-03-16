import React, { useState, useEffect, Suspense, lazy } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ethers } from "ethers";

import { useStateContext } from "../context";
import {
  CountBox,
  CustomButton,
  Loader,
  PieChartCandidate,
  FormField,
  UpdateCandidateModal,
} from "../components";
import { hoursLeft } from "../utils";

// Dynamically import the ResultsModal component
const ResultsModal = lazy(() => import("../components/ResultsModal"));
const durationOptions = [
  { label: "Hours", value: "hours" },
  { label: "Days", value: "days" },
  { label: "Weeks", value: "weeks" },
];
const voters = [];

const InstanceConfigDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const {
    contract,
    address,
    getCandidates,
    startVoting,
    extendVoting,
    addCandidates,
    updateYourCandidate,
    deleteCandidate,
  } = useStateContext();

  const [isLoading, setIsLoading] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [results, setResults] = useState([]);
  const [duration, setDuration] = useState("");
  const [durationUnit, setDurationUnit] = useState("hours");
  const remainingHours = hoursLeft(state.endTime);
  const [isAddCandidateModalOpen, setIsAddCandidateModalOpen] = useState(false);
  const [newCandidates, setNewCandidates] = useState([
    { name: "", role: "", description: "" },
  ]);

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  // Function to open update modal with selected candidate details
  const openUpdateModal = (candidate) => {
    setSelectedCandidate(candidate);
    setIsUpdateModalOpen(true);
  };

  const handleUpdatesCandidate = (updatedCandidate) => {
    // Perform the update operation here, likely involving an API call or state update
    console.log("Updated Candidate:", updatedCandidate);
    // Close the modal and possibly refresh the candidate list
    setIsUpdateModalOpen(false);
  };

  const openAddCandidateModal = () => setIsAddCandidateModalOpen(true);
  const closeAddCandidateModal = () => setIsAddCandidateModalOpen(false);

  const handleCandidateFieldChange = (field, event, index) => {
    const updatedCandidates = [...newCandidates];
    updatedCandidates[index] = {
      ...updatedCandidates[index],
      [field]: event.target.value,
    };
    setNewCandidates(updatedCandidates);
  };

  const handleSubmitCandidates = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await addCandidates(state.instanceId, newCandidates);
      setIsLoading(false);
      closeAddCandidateModal();
      fetchCandidates();
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const fetchCandidates = async () => {
    const data = await getCandidates(state.instanceId);

    setCandidates(data);
  };

  useEffect(() => {
    if (contract) fetchCandidates();
  }, [contract, address]);

  const handleGetVoteCount = async () => {
    setIsModalOpen(true);
    const fetchedResults = await getCandidates(state.instanceId);
    setResults(fetchedResults);
  };

  const handleUpdateCandidate = async (updatedCandidate) => {
    setIsLoading(true);
    try {
      await updateYourCandidate(
        state.instanceId,
        updatedCandidate.candidateId,
        updatedCandidate.name,
        updatedCandidate.role,
        updatedCandidate.description
      );
      fetchCandidates();
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const handleDeleteCandidate = async (candidateId) => {
    setIsLoading(true);
    try {
      await deleteCandidate(state.instanceId, candidateId);
      fetchCandidates();
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const handleActionBasedOnStatus = () => {
    if (state.instanceStatus === "Pending") {
      startVoting(state.instanceId, duration);
    } else if (state.instanceStatus === "Active") {
      extendVoting(state.instanceId, duration);
    }
    // No action for 'Ended' as the button will be disabled
  };

  return (
    <div className="p-[20px]">
      {isLoading && <Loader />}

      <div className="flex justify-between items-center">
        <CountBox title="Status" value={state.instanceStatus} />
        <CountBox title="Hours Left" value={remainingHours} />
        <CountBox title="Candidates" value={candidates.length} />
        <CountBox title="Total Votes" value="1" />{" "}
        <CountBox title="Unique Voters" value="X" />{" "}
        {/* Placeholder for the new CountBox */}
      </div>

      <div className="mt-[60px] flex lg:flex-row flex-col gap-5">
        <div className="flex-[2] flex flex-col gap-[40px]">
          <div>
            <h4
              align="center"
              className="font-epilogue font-semibold text-[20px] text-white uppercase"
            >
              {state.title}
            </h4>
          </div>

          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">
              Description
            </h4>

            <div className="mt-[20px]">
              <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">
                {state.description}
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">
              Candidates
            </h4>
            <CustomButton
              btnType="button"
              title="Add Candidates"
              styles="py-2 px-4 bg-[#4caf50] text-white rounded-[10px] hover:bg-[#43a047]"
              handleClick={openAddCandidateModal}
            />

            {/* Modal implementation */}
            {isAddCandidateModalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                <div className="bg-[#1c1c24] p-5 rounded-lg max-w-lg w-full">
                  <form
                    onSubmit={handleSubmitCandidates}
                    className="w-full flex flex-col gap-4"
                  >
                    <div className="w-full bg-[#8c6dfd] text-white text-center py-2 rounded-t-lg">
                      <h2 className="font-epilogue font-bold">
                        Add Candidate Details
                      </h2>
                    </div>
                    {newCandidates.map((candidate, index) => (
                      <div key={index} className="flex flex-col gap-4">
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
                    <div className="flex justify-between items-center mt-4">
                      <CustomButton
                        btnType="submit"
                        title="Submit Candidate"
                        styles="bg-[#4caf50]"
                      />
                      <button
                        onClick={closeAddCandidateModal}
                        className="text-white bg-red-600 hover:bg-red-700 font-bold py-2 px-4 rounded-full"
                        aria-label="Close Add Candidate Modal"
                      >
                        Close
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            <div>
              <div className="mt-[20px] flex flex-col gap-4">
                {candidates.length > 0 ? (
                  candidates.map((candidate, index) => (
                    <div
                      key={candidate.candidateId}
                      className="bg-[#1c1c24] p-4 rounded-[10px] flex flex-col gap-2"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex flex-col gap-2">
                          <p className="font-epilogue font-semibold text-[16px] text-white">
                            {index + 1}. {candidate.name}
                          </p>
                          <p className="font-epilogue font-medium text-[14px] text-[#b2b3bd]">
                            {candidate.role}
                          </p>
                          <p className="font-epilogue font-normal text-[14px] text-[#808191]">
                            {candidate.description}
                          </p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <CustomButton
                            btnType="button"
                            title="Update"
                            styles="py-1 px-2 bg-[#8c6dfd] text-white rounded-[10px] hover:bg-[#7b5df8]"
                            handleClick={() => openUpdateModal(candidate)}
                          />
                          <CustomButton
                            btnType="button"
                            title="Delete"
                            styles="py-1 px-2 bg-[#df6d6d] text-white rounded-[10px] hover:bg-[#d65d5d]"
                            handleClick={() =>
                              handleDeleteCandidate(candidate.candidateId)
                            }
                          />
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">
                    No Candidates added yet.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* New section for Voters */}
          <div className="w-full bg-[#1c1c24] p-4 rounded-[10px] mt-10">
            <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase mb-4">
              Voters
            </h4>
            <div>
              {/* Assuming you have a 'voters' state or prop containing voter details */}
              {voters.length > 0 ? (
                voters.map((voter, index) => (
                  <div
                    key={index}
                    className="bg-[#2a2a35] p-2 rounded-[10px] mb-2"
                  >
                    <p className="font-epilogue text-[16px] text-white">
                      {voter.address} - {voter.roles}
                    </p>
                  </div>
                ))
              ) : (
                <p className="font-epilogue text-[16px] text-[#808191]">
                  No voters yet.
                </p>
              )}
            </div>
          </div>

          {/* New section for Voting Chart */}
          <div className="mt-10">
            <h3 align="center" className="text-lg font-bold text-white mb-2">
              Votes distribution for each candidate
            </h3>
            <div
              className="bg-[#1c1c24] rounded-lg p-5"
              style={{ height: "400px", position: "relative" }}
            >
              {/* Assuming 'PieChartComponent' is imported and 'voteByCandidateData' is available */}
              <PieChartCandidate data={candidates} />
            </div>
          </div>
        </div>

        <div className="flex-1">
          <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">
            Activate your instance
          </h4>

          <div className="mt-[20px] flex flex-col p-4 bg-[#1c1c24] rounded-[10px]">
            <div className="mt-[20px]">
              <div className="flex gap-[10px]">
                <input
                  type="number"
                  min="1"
                  placeholder="Enter duration"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="flex-1 py-[10px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-[#2a2a35] font-epilogue text-white text-[18px] leading-[30px] rounded-[10px]"
                />
                <select
                  value={durationUnit}
                  onChange={(e) => setDurationUnit(e.target.value)}
                  className="py-[10px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-[#2a2a35] font-epilogue text-white text-[18px] leading-[30px] rounded-[10px]"
                >
                  {durationOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="my-[20px] p-4 bg-[#13131a] rounded-[10px]">
                <h4 className="font-epilogue font-semibold text-[14px] leading-[22px] text-white">
                  Set a duration for your voting instance
                </h4>
                <p className="mt-[20px] font-epilogue font-normal leading-[22px] text-[#808191]">
                  Set a duration and click the button below to officially open
                  your instance. If the status is active, add a duration to
                  extend the voting deadline
                </p>
              </div>
              <CustomButton
                btnType="button"
                title={
                  state.instanceStatus === "Pending"
                    ? "Start Voting"
                    : state.instanceStatus === "Active"
                    ? "Extend Voting Time"
                    : "Instance has Ended"
                }
                styles={`w-full mt-4 ${
                  state.instanceStatus === "Ended"
                    ? "bg-[#3a3a43]"
                    : "bg-[#8c6dfd] hover:bg-[#7b5df8]"
                }`}
                handleClick={handleActionBasedOnStatus}
                disabled={state.instanceStatus === "Ended"}
              />
            </div>
          </div>
          <div className="mt-[20px] flex flex-col p-4 bg-[#1c1c24] rounded-[10px]">
            <div className="mt-[20px]">
              <div className="my-[10px] p-4 bg-[#13131a] rounded-[10px]">
                <h4 className="font-epilogue font-semibold text-[14px] leading-[22px] text-white">
                  Get the current vote tally
                </h4>
                <p className="mt-[20px] font-epilogue font-normal leading-[22px] text-[#808191]">
                  Bear in mind that voting might still be ongoing so check back
                  later to find out the winner.
                </p>
              </div>

              <CustomButton
                btnType="button"
                title="Get Vote Count"
                styles="w-full bg-[#8c6dfd]"
                handleClick={handleGetVoteCount}
              />

              <Suspense fallback={<div>Loading...</div>}>
                <ResultsModal
                  isOpen={isModalOpen}
                  onClose={() => setIsModalOpen(false)}
                  results={results}
                  instanceName={state.title}
                />
              </Suspense>

              <UpdateCandidateModal
                isOpen={isUpdateModalOpen}
                onClose={() => setIsUpdateModalOpen(false)}
                candidate={selectedCandidate}
                onUpdate={handleUpdateCandidate}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstanceConfigDetails;
