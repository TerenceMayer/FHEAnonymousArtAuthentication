const { ethers, network } = require("hardhat");

async function main() {
  console.log("=== Anonymous Art Authentication Deployment ===\n");

  // Get deployer information
  const [deployer] = await ethers.getSigners();
  const deployerAddress = deployer.address;
  const deployerBalance = await ethers.provider.getBalance(deployerAddress);

  console.log("Deployment Configuration:");
  console.log("- Network:", network.name);
  console.log("- Chain ID:", network.config.chainId);
  console.log("- Deployer:", deployerAddress);
  console.log("- Balance:", ethers.formatEther(deployerBalance), "ETH\n");

  // Check if deployer has sufficient balance
  if (deployerBalance === 0n) {
    throw new Error("Deployer account has zero balance. Please fund the account before deployment.");
  }

  console.log("Deploying AnonymousArtAuthentication contract...");

  // Get the ContractFactory
  const AnonymousArtAuthentication = await ethers.getContractFactory("AnonymousArtAuthentication");

  // Deploy the contract
  const contract = await AnonymousArtAuthentication.deploy();

  console.log("Transaction submitted. Waiting for confirmation...");
  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();
  console.log("✅ Contract deployed successfully!\n");

  // Verify deployment
  console.log("Contract Verification:");
  try {
    const owner = await contract.owner();
    const nextArtworkId = await contract.nextArtworkId();
    const nextExpertId = await contract.nextExpertId();

    console.log("- Owner:", owner);
    console.log("- Next Artwork ID:", nextArtworkId.toString());
    console.log("- Next Expert ID:", nextExpertId.toString());
    console.log("- Deployment successful: ✅\n");
  } catch (error) {
    console.log("⚠️  Warning: Could not verify contract state");
    console.log("Error:", error.message, "\n");
  }

  console.log("=== Deployment Summary ===");
  console.log(`Contract Address: ${contractAddress}`);
  console.log(`Network: ${network.name} (Chain ID: ${network.config.chainId})`);
  console.log(`Deployer: ${deployerAddress}`);
  console.log(`Block Explorer: https://${network.name !== 'hardhat' ? network.name + '.' : ''}etherscan.io/address/${contractAddress}`);

  console.log("\n=== Next Steps ===");
  console.log("1. Update CONTRACT_ADDRESS in .env file:");
  console.log(`   CONTRACT_ADDRESS=${contractAddress}`);
  console.log("\n2. Verify contract on Etherscan:");
  console.log("   npm run verify");
  console.log("\n3. Interact with deployed contract:");
  console.log("   npm run interact");
  console.log("\n4. Update frontend with contract address in index.html");

  // Save deployment info to file
  const fs = require('fs');
  const deploymentInfo = {
    network: network.name,
    chainId: network.config.chainId,
    contractAddress: contractAddress,
    deployer: deployerAddress,
    deploymentDate: new Date().toISOString(),
    blockNumber: await ethers.provider.getBlockNumber(),
  };

  try {
    fs.writeFileSync(
      'deployment-info.json',
      JSON.stringify(deploymentInfo, null, 2)
    );
    console.log("\n✅ Deployment info saved to deployment-info.json");
  } catch (error) {
    console.log("⚠️  Could not save deployment info:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });