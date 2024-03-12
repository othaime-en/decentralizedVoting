import { myContract } from "./contract.js";

// Function to listen to "VotingInstanceCreated" event
export const listenToVotingInstanceCreated = async () => {
  const events = await myContract.events.getEvents("VotingInstanceCreated");
  return events; // Process or log events as needed
};

// Function to listen to "CandidateAdded" event
export const listenToCandidateAdded = async () => {
  const events = await myContract.events.getEvents("CandidateAdded");
  return events;
};

// Function to listen to "CandidateUpdated" event
export const listenToCandidateUpdated = async () => {
  const events = await myContract.events.getEvents("CandidateUpdated");
  return events;
};

// Function to listen to "VoteCasted" event
export const listenToVoteCasted = async () => {
  const events = await myContract.events.getEvents("VoteCasted");
  return events;
};

// Optional: A function to listen to all events, if needed
export const listenToAllEvents = async () => {
  const listener = await myContract.events.listenToAllEvents((event) => {
    console.log("Event received:", event);
  });
  return listener; // Keep reference to listener for potential removal
};
