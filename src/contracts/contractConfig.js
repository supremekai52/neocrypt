// Contract configuration - update after deployment
export const CONTRACT_CONFIG = {
  // Update these after running deployment
  address: "0x5FbDB2315678afecb367f032d93F642f64180aa3", // Local hardhat default
  abi: [], // Will be populated from deployments/NeoCryptTraceability.json
  
  // Network configurations
  networks: {
    localhost: {
      chainId: 31337,
      rpcUrl: "http://127.0.0.1:8545",
      name: "Hardhat Local"
    },
    sepolia: {
      chainId: 11155111,
      rpcUrl: process.env.SEPOLIA_URL,
      name: "Sepolia Testnet"
    },
    polygon: {
      chainId: 137,
      rpcUrl: process.env.POLYGON_URL,
      name: "Polygon Mainnet"
    }
  }
};

// Role constants matching the contract
export const ROLES = {
  FARMER_ROLE: "0x8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f",
  PROCESSOR_ROLE: "0x4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a",
  LAB_ROLE: "0x8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400e",
  MANUFACTURER_ROLE: "0x4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8b",
  REGULATOR_ROLE: "0x8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400d"
};