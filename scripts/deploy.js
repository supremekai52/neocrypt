const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying NeoCrypt Traceability Contract...");

  // Get the ContractFactory and Signers
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // Deploy the contract
  const NeoCryptTraceability = await ethers.getContractFactory("NeoCryptTraceability");
  const contract = await NeoCryptTraceability.deploy();

  await contract.deployed();

  console.log("NeoCryptTraceability deployed to:", contract.address);

  // Setup initial roles and rules
  console.log("Setting up initial configuration...");

  // Grant roles to demo accounts (you'll need to replace with actual addresses)
  const FARMER_ROLE = await contract.FARMER_ROLE();
  const PROCESSOR_ROLE = await contract.PROCESSOR_ROLE();
  const LAB_ROLE = await contract.LAB_ROLE();
  const MANUFACTURER_ROLE = await contract.MANUFACTURER_ROLE();

  // Create demo rule set for Ashwagandha
  await contract.updateRuleSet(
    "ASHW",
    "jodhpur_rajasthan",
    ["tsj"], // geohash prefixes
    [
      { startDate: "10-01", endDate: "12-31" },
      { startDate: "01-01", endDate: "03-31" }
    ],
    1000, // quota per season
    "1.0"  // version
  );

  console.log("Initial setup completed!");
  console.log("Contract ABI and address saved to deployments/");

  // Save deployment info
  const fs = require('fs');
  const deploymentInfo = {
    address: contract.address,
    abi: contract.interface.format('json'),
    network: network.name,
    deployer: deployer.address,
    deployedAt: new Date().toISOString()
  };

  if (!fs.existsSync('deployments')) {
    fs.mkdirSync('deployments');
  }

  fs.writeFileSync(
    'deployments/NeoCryptTraceability.json',
    JSON.stringify(deploymentInfo, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });