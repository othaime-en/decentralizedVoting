import React, { useContext, createContext } from "react";
import myContract from "../contract.js";

import {
  useAddress,
  useContract,
  useMetamask,
  useContractWrite,
  useContractRead,
} from "@thirdweb-dev/react";
import { ethers } from "ethers";
import { EditionMetadataWithOwnerOutputSchema } from "@thirdweb-dev/sdk";
import { epochToDateTime } from "../utils";

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const { contract } = useContract(
    "0x81ba256Dd8B05c0577c72E02Bec40f22322e4469"
  );
  const { mutateAsync: createCampaign } = useContractWrite(
    contract,
    "createCampaign"
  );
  const { mutateAsync: createInstanceCall } = useContractWrite(
    contract,
    "createInstance"
  );
  const { mutateAsync: addCandidatesCall } = useContractWrite(
    contract,
    "addCandidates"
  );
  const { mutateAsync: removeCandidate } = useContractWrite(
    contract,
    "removeCandidate"
  );
  const { mutateAsync: updateCandidate } = useContractWrite(
    contract,
    "updateCandidate"
  );
  const { mutateAsync: closeInstance } = useContractWrite(
    contract,
    "closeInstance"
  );
  const { mutateAsync: deleteInstance } = useContractWrite(
    contract,
    "deleteInstance"
  );

  const address = useAddress();
  const connect = useMetamask();

  // Function to create a voting instance
  const createNewInstance = async (
    instanceName,
    organizationName,
    description
  ) => {
    try {
      const data = await createInstanceCall({
        args: [instanceName, organizationName, description],
      });
      console.info("Instance creation success", data);
      const value = data.receipt.logs[0].topics[1];
      const instanceId = ethers.BigNumber.from(value).toNumber();
      console.log("The instanceId is: ", instanceId);
      return instanceId; // This should include instance ID or related data from your contract's response
    } catch (error) {
      console.error("Instance creation failure", error);
      throw error; // Re-throw the error to handle it in the component
    }
  };

  // Function to add candidates to a voting instance
  const addCandidates = async (instanceId, candidates) => {
    try {
      const names = candidates.map((c) => c.name);
      const roles = candidates.map((c) => c.role);
      const descriptions = candidates.map((c) => c.description);
      const data = await addCandidatesCall({
        args: [instanceId, names, roles, descriptions],
      });
      console.info("Adding candidates success", data);
    } catch (error) {
      console.error("Adding candidates failure", error);
      throw error; // Re-throw the error to handle it in the component
    }
  };

  // Function to query the number of instances
  const getNumberOfInstances = async () => {
    const data = await contract.call("instanceId");
    const instanceIds = ethers.BigNumber.from(data).toNumber();

    console.log("The number of instances is: ", instanceIds);
    return instanceIds;
  };

  // Function to query all instances
  const getAllInstances = async () => {
    const count = await getNumberOfInstances();
    const instances = [];
    for (let i = 1; i <= count; i++) {
      const instance = await contract.call("instances", [i]);
      // Fetch only voter addresses for the current instance
      const votersAndRoles = await getVoterAndRoles(i); // Adjusted to get only voters
      const voters = votersAndRoles.voters;

      // Parse the instance with only voters data included
      const parsedInstance = {
        instanceId: instance.id.toNumber(),
        title: instance.name,
        organizationName: instance.organizationName,
        description: instance.description,
        owner: instance.creator,
        candidateCount: instance.candidateCount.toNumber(),
        instanceStatus: getStatus(instance.status),
        startTime: epochToDateTime(instance.startTime.toNumber()),
        endTime: epochToDateTime(instance.endTime.toNumber()),
        isPrivate: instance.isPrivate,
        voters, // Only include voters here
        votersCount: voters.length,
        votersAndRoles,
      };

      instances.push(parsedInstance);
    }

    console.log("Here are the parsed instances with voters only: ", instances);
    return instances;
  };

  function getStatus(status) {
    switch (status) {
      case 0:
        return "Pending";
      case 1:
        return "Active";
      case 2:
        return "Ended";
      default:
        return "Unknown"; // Handle unexpected status
    }
  }

  const getUserInstances = async () => {
    const allCampaigns = await getAllInstances();

    const filteredCampaigns = allCampaigns.filter(
      (instance) => instance.owner === address
    );

    return filteredCampaigns;
  };

  // Function to query all the candidates for a particular instance
  const getCandidates = async (instanceId) => {
    const data = await contract.call("getCandidates", [instanceId]);

    const parsedCandidates = data.map((candidate, i) => ({
      candidateId: candidate.id.toNumber(),
      name: candidate.name,
      role: candidate.role,
      description: candidate.description,
      voteCount: candidate.voteCount.toNumber(),
      pId: i,
    }));
    console.log("Here are the parsed candidates: ", parsedCandidates);
    return parsedCandidates;
  };

  const vote = async (instanceId, candidateId) => {
    try {
      const data = await contract.call("vote", [instanceId, candidateId]);

      console.info("Successful voting process", data);
    } catch (error) {
      console.error("There was an error in your voting process", error);
      throw error; // Re-throw the error to handle it in the component
    }
  };

  const getVoterAndRoles = async (instanceId) => {
    const [voters, roles] = await contract.call("getVotersAndRoles", [
      instanceId,
    ]);
    return { voters, roles };
  };

  // Function to get the voters and the roles they've voted for
  const displayVoterRoles = async (instanceId) => {
    const { voters, roles } = await getVoterAndRoles(instanceId);
    const tableData = voters.map((voter, index) => ({
      voterAddress: voter,
      votedRoles: roles[index].join(", "), // Combining roles into a single string
    }));

    return tableData;
  };

  const deleteCandidate = async (instanceId, candidateId) => {
    try {
      const data = await removeCandidate({ args: [instanceId, candidateId] });
      console.info("Contract Call Success!!", data);
    } catch (err) {
      console.error("There was an error deleting the candidate", err);
      throw err;
    }
  };

  const updateYourCandidate = async (
    instanceId,
    candidateId,
    newCandidateName,
    newCandidateRole,
    newCandidateDescription
  ) => {
    try {
      const data = await updateCandidate({
        args: [
          instanceId,
          candidateId,
          newCandidateName,
          newCandidateRole,
          newCandidateDescription,
        ],
      });
      console.info("Contract Call Success!!", data);
    } catch (err) {
      console.error("There was an error updating the candidate", err);
      throw err;
    }
  };

  const startVoting = async (instanceId, duration) => {
    try {
      const data = await contract.call("startVoting", [instanceId, duration]);
      console.log("Voting started successfully!");
    } catch (error) {
      console.error("There was an error initializing your instance");
    }
  };

  const extendVoting = async (instanceId, duration) => {
    try {
      const data = await contract.call("extendVoting", [instanceId, duration]);
      console.log("Voting time extended successfully");
    } catch (error) {
      console.error(
        "You have encountered an error while extending the deadline: ",
        error
      );
    }
  };

  const endVoting = async (instanceId) => {
    try {
      const data = await closeInstance({ args: [instanceId] });
      console.log("Voting closed successfully!");
    } catch (error) {
      console.error("There was an error closing your instance");
    }
  };

  const deleteVotingInstance = async (instanceId) => {
    try {
      const data = await deleteInstance({ args: [instanceId] });
      console.log("Voting instance deleted successfully!");
    } catch (error) {
      console.error("There was an error deleting your instance");
    }
  };

  return (
    <StateContext.Provider
      value={{
        address,
        contract,
        connect,
        createNewInstance,
        addCandidates,
        getNumberOfInstances,
        getAllInstances,
        getUserInstances,
        getCandidates,
        vote,
        startVoting,
        extendVoting,
        deleteCandidate,
        updateYourCandidate,
        endVoting,
        deleteVotingInstance,
        getVoterAndRoles,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
