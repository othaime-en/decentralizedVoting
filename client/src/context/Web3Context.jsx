// StateContext.js
import React, { createContext, useContext } from 'react';
import { useContract, useContractWrite, useMetamask, useAddress, useContractRead } from '@thirdweb-dev/react';
import { ethers } from 'ethers';

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const { contract } = useContract("0x3fE6D2A5E0C7761a5edf4e9F33f417af86E93c90");

  const address = useAddress();
  const connect = useMetamask();

  // Function to create a voting instance
  const createNewInstance = async (instanceName, organizationName, description) => {
    const { mutateAsync: createInstanceCall } = useContractWrite(contract, "createInstance");
    try {
      const data = await createInstanceCall({ args: [instanceName, organizationName, description] });
      console.info("Instance creation success", data);
      return data; // This should include instance ID or related data from your contract's response
    } catch (error) {
      console.error("Instance creation failure", error);
      throw error; // Re-throw the error to handle it in the component
    }
  };

  // Function to add candidates to a voting instance
  const addCandidates = async (instanceId, candidates) => {
    const { mutateAsync: addCandidatesCall } = useContractWrite(contract, "addCandidates");
    try {
      const names = candidates.map(c => c.name);
      const roles = candidates.map(c => c.role);
      const descriptions = candidates.map(c => c.description);
      const data = await addCandidatesCall({ args: [instanceId, names, roles, descriptions] });
      console.info("Adding candidates success", data);
    } catch (error) {
      console.error("Adding candidates failure", error);
      throw error; // Re-throw the error to handle it in the component
    }
  };

  return (
    <StateContext.Provider value={{ createNewInstance, addCandidates }}>
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
