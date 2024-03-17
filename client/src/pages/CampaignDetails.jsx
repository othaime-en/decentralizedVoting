import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { Lumiflex, Zenitho, Novatrix } from "uvcanvas";

import { useStateContext } from "../context";
import {
  CountBox,
  CustomButton,
  Loader,
  OTPInput,
  ResultsModal,
} from "../components";
import { calculateBarPercentage, hoursLeft } from "../utils";
import { thirdweb } from "../assets";

const CampaignDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { donate, getDonations, contract, address, getCandidates, vote } =
    useStateContext();

  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidateId, setSelectedCandidateId] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [uniqueRoles, setUniqueRoles] = useState([]);
  const [votedRoles, setVotedRoles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [results, setResults] = useState([]);
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  const remainingHours = hoursLeft(state.endTime);
  const isVoteButtonEnabled =
    isOtpVerified && state.instanceStatus === "Active";

  const fetchCandidates = async () => {
    const data = await getCandidates(state.instanceId);

    setCandidates(data);
  };

  useEffect(() => {
    if (contract) fetchCandidates();
  }, [contract, address]);

  useEffect(() => {
    const roles = candidates.reduce((acc, candidate) => {
      const { role } = candidate;
      if (!acc.includes(role) && !votedRoles.includes(role)) {
        acc.push(role);
      }
      return acc;
    }, []);

    setUniqueRoles(roles);
    // Update selectedRole if it gets removed
    if (!roles.includes(selectedRole)) setSelectedRole(roles[0] || "");
  }, [candidates, votedRoles]);

  const handleOtpVerification = (verified) => {
    setIsOtpVerified(verified);
  };

  const handleVote = async () => {
    setIsLoading(true);

    try {
      if (selectedRole === "" || selectedCandidateId === "") {
        alert("Please complete your selection before voting.");
        setIsLoading(false);
        return;
      }

      await vote(state.instanceId, selectedCandidateId);

      // Assume vote is successful; update votedRoles
      const candidateRole = candidates.find(
        (candidate) => candidate.name === selectedCandidateId
      )?.role;
      if (candidateRole && !votedRoles.includes(candidateRole)) {
        setVotedRoles((prevRoles) => [...prevRoles, candidateRole]);
      }

      navigate("/");
    } catch (error) {
      console.error("Vote failed:", error.message);
    }

    setIsLoading(false);
  };

  const handleGetVoteCount = async () => {
    setIsModalOpen(true);
    const fetchedResults = await getCandidates(state.instanceId);
    setResults(fetchedResults);
  };

  return (
    <div>
      {isLoading && <Loader />}

      <div className="w-full flex md:flex-row flex-col mt-10 gap-[30px]">
        <div className="flex-1 flex-col">
          <Novatrix
            alt="campaign"
            className="w-full object-cover rounded-[15px] h-auto sm:h-[410px]"
          />

          <div className="relative w-full h-[5px] bg-[#3a3a43] mt-2">
            <div
              className="absolute h-full bg-[#4acd8d]"
              style={{
                width: `${calculateBarPercentage(
                  state.startTime,
                  state.endTime
                )}%`,
                maxWidth: "100%",
              }}
            ></div>
          </div>
        </div>

        <div className="flex md:w-[150px] w-full flex-wrap justify-between gap-[30px]">
          <CountBox title="Hours Left" value={remainingHours} />
          <CountBox title="Candidates" value={state.candidateCount} />
          <CountBox title="Total Votes" value="1" /*{candidates.length}*/ />
        </div>
      </div>

      <div className="mt-[60px] flex lg:flex-row flex-col gap-5">
        <div className="flex-[2] flex flex-col gap-[40px]">
          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">
              Creator
            </h4>

            <div className="mt-[20px] flex flex-row items-center flex-wrap gap-[14px]">
              <div className="w-[52px] h-[52px] flex items-center justify-center rounded-full bg-[#2c2f32] cursor-pointer">
                <img
                  src={thirdweb}
                  alt="user"
                  className="w-[60%] h-[60%] object-contain"
                />
              </div>
              <div>
                <h4 className="font-epilogue font-semibold text-[14px] text-white break-all">
                  {state.owner}
                </h4>
                <p className="mt-[4px] font-epilogue font-normal text-[12px] text-[#808191]">
                  10 Campaigns
                </p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">
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

            <div>
              <div className="mt-[20px] flex flex-col gap-4">
                {candidates.length > 0 ? (
                  candidates.map((candidate, index) => (
                    <div
                      key={candidate.candidateId}
                      className="bg-[#1c1c24] p-4 rounded-[10px]"
                    >
                      <div className="flex justify-between items-center">
                        <p className="font-epilogue font-semibold text-[16px] text-white">
                          {index + 1}. {candidate.name}
                        </p>
                        <p className="font-epilogue font-medium text-[14px] text-[#b2b3bd]">
                          {candidate.role}
                        </p>
                      </div>
                      <p className="font-epilogue font-normal text-[14px] text-[#808191] mt-2">
                        {candidate.description}
                      </p>
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
        </div>

        <div className="flex-1">
          <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">
            Cast your Vote
          </h4>

          <div className="mt-[20px] flex flex-col p-4 bg-[#1c1c24] rounded-[10px]">
            <div className="mt-[30px]">
              <p className="font-epilogue font-medium text-[16px] text-[#808191] mb-[10px]">
                Select a role to vote for
              </p>
              {/* Role selection */}
              <select
                className="w-full py-[10px] mb-[20px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-[#2a2a35] font-epilogue text-white text-[18px] leading-[30px] rounded-[10px]"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                style={{ backgroundColor: "#2a2a35", color: "white" }}
              >
                <option value="" disabled>
                  Select a Role
                </option>
                {uniqueRoles.map((role) => (
                  <option
                    key={role}
                    value={role}
                    style={{ backgroundColor: "#2a2a35", color: "white" }}
                  >
                    {role}
                  </option>
                ))}
              </select>

              {/* Candidate selection based on the selected role */}
              <p className="font-epilogue font-medium text-[16px] text-[#808191] mb-[10px]">
                Choose your preferred candidate
              </p>
              <select
                className="w-full py-[10px] mb-[20px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-[#2a2a35] font-epilogue text-white text-[18px] leading-[30px] rounded-[10px]"
                value={selectedCandidateId}
                onChange={(e) => {
                  console.log("Selected candidate ID:", e.target.value);
                  setSelectedCandidateId(e.target.value);
                }}
                style={{ backgroundColor: "#2a2a35", color: "white" }}
              >
                <option value="" disabled>
                  Choose your preferred candidate
                </option>
                {candidates
                  .filter((candidate) => candidate.role === selectedRole)
                  .map((candidate) => (
                    <option
                      key={candidate.candidateId}
                      value={candidate.candidateId} // Use candidateId here
                      style={{ backgroundColor: "#2a2a35", color: "white" }}
                    >
                      {candidate.name}
                    </option>
                  ))}
              </select>

              <div className="my-[20px] p-4 bg-[#13131a] rounded-[10px]">
                <h4 className="font-epilogue font-semibold text-[14px] leading-[22px] text-white">
                  Vote for who you believe in.
                </h4>
                <p className="mt-[20px] font-epilogue font-normal leading-[22px] text-[#808191]">
                  Support the candidate of your choice, just because the
                  resonate with you.
                </p>
              </div>
              <OTPInput onOtpVerification={handleOtpVerification} />

              <CustomButton
                btnType="button"
                title="Vote Now"
                styles={`w-full ${
                  isVoteButtonEnabled ? "bg-[#8c6dfd]" : "bg-gray-400"
                }`} // Conditional styling based on OTP verification and instance status
                handleClick={isVoteButtonEnabled ? handleVote : null} // Only set handleClick if the button is enabled
                disabled={!isVoteButtonEnabled} // Disable based on both conditions
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

              <ResultsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                results={results}
                instanceName={state.title}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetails;
