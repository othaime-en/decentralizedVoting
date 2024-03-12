import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { Sepolia } from "@thirdweb-dev/chains";

// Initialize SDK with your preferred configuration (client ID for frontend use)
const sdk = new ThirdwebSDK(Sepolia, {
  clientId: "617c32507411faa09e942a153827c59f", // Your client ID here
});

// Initialize and export the contract
const myContract = sdk.getContract(
  "0x51D0C0F930eFa8aaA3FdD728a433BCEECD957c40"
);

export default myContract;
