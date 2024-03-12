import React from "react";
import CustomButton from "./CustomButton"; // Ensure this import path matches your project structure

const ResultsModal = ({ isOpen, onClose, results, instanceName }) => {
  if (!isOpen) return null;

  const groupedByRole = results.reduce((acc, candidate) => {
    acc[candidate.role] = acc[candidate.role] || [];
    acc[candidate.role].push(candidate);
    return acc;
  }, {});

  Object.keys(groupedByRole).forEach((role) => {
    groupedByRole[role].sort((a, b) => b.voteCount - a.voteCount);
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center px-4 py-6">
      <div className="bg-[#1c1c24] rounded-[10px] max-w-4xl w-full p-6">
        <h3 className="font-epilogue font-semibold text-[22px] text-white mb-4 text-center">
          Voting Results for {instanceName}
        </h3>
        <div className="overflow-y-auto max-h-96">
          {Object.entries(groupedByRole).map(([role, candidates]) => (
            <div key={role} className="mt-6">
              <h4 className="font-epilogue font-semibold text-[20px] text-[#4acd8d] mb-4 text-center">
                Position: {role}
              </h4>
              {candidates.map((candidate, index) => (
                <div
                  key={index}
                  className="bg-[#13131a] rounded-[10px] p-3 my-2 flex justify-between items-center"
                >
                  <p className="font-epilogue font-semibold text-[16px] text-white">
                    {candidate.name}
                  </p>
                  <p className="font-epilogue font-semibold text-[16px] text-[#4acd8d]">
                    Votes: {candidate.voteCount}
                  </p>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-6">
          <CustomButton
            btnType="button"
            title="Close"
            styles="bg-[#8c6dfd] text-white font-epilogue py-2 px-4 rounded-[10px] text-[14px] font-semibold"
            handleClick={onClose}
          />
        </div>
      </div>
    </div>
  );
};

export default ResultsModal;
