const { run, network } = require("hardhat");

async function main() {
  console.log("=== Contract Verification on Etherscan ===\n");

  // Get contract address from environment or deployment file
  let contractAddress = process.env.CONTRACT_ADDRESS;

  // Try to read from deployment-info.json if not in env
  if (!contractAddress) {
    try {
      const fs = require('fs');
      const deploymentInfo = JSON.parse(fs.readFileSync('deployment-info.json', 'utf8'));
      contractAddress = deploymentInfo.contractAddress;
      console.log("📄 Using contract address from deployment-info.json");
    } catch (error) {
      contractAddress = "0x4D874585f820437656554590C812b672305fbb72"; // Fallback
      console.log("⚠️  Using fallback contract address");
    }
  }

  console.log("Verification Details:");
  console.log("- Network:", network.name);
  console.log("- Contract Address:", contractAddress);
  console.log("- Constructor Args: (none)");
  console.log("- Compiler Version: 0.8.24");
  console.log("- Optimization: Enabled (200 runs)\n");

  if (!process.env.ETHERSCAN_API_KEY) {
    console.error("❌ Error: ETHERSCAN_API_KEY not found in .env file");
    console.log("\nPlease set your Etherscan API key in .env:");
    console.log("ETHERSCAN_API_KEY=your_api_key_here");
    console.log("\nGet your API key from: https://etherscan.io/myapikey");
    process.exit(1);
  }

  console.log("Submitting contract for verification...");

  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: [],
    });

    console.log("\n✅ Contract verified successfully!");
    console.log(`\nView on Etherscan: https://${network.name}.etherscan.io/address/${contractAddress}#code`);
  } catch (error) {
    if (error.message.toLowerCase().includes("already verified")) {
      console.log("\n✅ Contract is already verified!");
      console.log(`\nView on Etherscan: https://${network.name}.etherscan.io/address/${contractAddress}#code`);
    } else if (error.message.toLowerCase().includes("does not have bytecode")) {
      console.error("\n❌ Error: Contract not found at the specified address");
      console.log("\nPossible issues:");
      console.log("1. Wrong contract address in .env");
      console.log("2. Contract not deployed to this network");
      console.log("3. Wrong network specified");
      process.exit(1);
    } else {
      console.error("\n❌ Error verifying contract:");
      console.error(error.message);
      console.log("\nTroubleshooting:");
      console.log("1. Wait a few minutes after deployment");
      console.log("2. Check your ETHERSCAN_API_KEY in .env");
      console.log("3. Verify the contract address is correct");
      console.log("4. Try manual verification on Etherscan");
      process.exit(1);
    }
  }

  console.log("\n=== Verification Complete ===");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Verification script failed:");
    console.error(error);
    process.exit(1);
  });
