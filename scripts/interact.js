const { ethers, network } = require("hardhat");

async function main() {
  console.log("=== Anonymous Art Authentication - Contract Interaction ===\n");

  // Get contract address from environment or deployment file
  let contractAddress = process.env.CONTRACT_ADDRESS;

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

  console.log("Connection Details:");
  console.log("- Network:", network.name);
  console.log("- Chain ID:", network.config.chainId);
  console.log("- Contract Address:", contractAddress);
  console.log(`- Explorer: https://${network.name !== 'hardhat' ? network.name + '.' : ''}etherscan.io/address/${contractAddress}\n`);

  // Get the contract instance
  console.log("Connecting to contract...");
  const AnonymousArtAuthentication = await ethers.getContractFactory("AnonymousArtAuthentication");
  const contract = AnonymousArtAuthentication.attach(contractAddress);

  try {
    // Verify contract exists
    const code = await ethers.provider.getCode(contractAddress);
    if (code === '0x') {
      throw new Error("No contract found at this address");
    }
    console.log("✅ Contract found and connected\n");
  } catch (error) {
    console.error("❌ Error: Could not connect to contract");
    console.error(error.message);
    process.exit(1);
  }

  // Get contract owner
  const owner = await contract.owner();
  const [currentUser] = await ethers.getSigners();
  const isOwner = owner.toLowerCase() === currentUser.address.toLowerCase();

  console.log("Contract Information:");
  console.log("- Owner:", owner);
  console.log("- Current User:", currentUser.address);
  console.log("- Is Owner:", isOwner ? "✅ Yes" : "❌ No");

  // Get current IDs
  const nextArtworkId = await contract.nextArtworkId();
  const nextExpertId = await contract.nextExpertId();
  console.log("\nContract State:");
  console.log("- Next Artwork ID:", nextArtworkId.toString());
  console.log("- Next Expert ID:", nextExpertId.toString());
  console.log("- Total Artworks:", (Number(nextArtworkId) - 1).toString());
  console.log("- Total Experts:", (Number(nextExpertId) - 1).toString());

  // List all artworks
  console.log("\n=== Artworks ===");
  const totalArtworks = Number(nextArtworkId) - 1;

  if (totalArtworks > 0) {
    for (let i = 1; i <= Math.min(totalArtworks, 10); i++) {
      try {
        const info = await contract.getArtworkInfo(i);
        console.log(`\nArtwork #${i}:`);
        console.log("  Owner:", info.artworkOwner);
        console.log("  Submitted:", info.isSubmitted);
        console.log("  Authenticated:", info.isAuthenticated);
        console.log("  Authentication Count:", info.authenticationCount.toString());
        console.log("  Required Consensus:", info.expertConsensus.toString() + "%");

        // Get experts for this artwork
        const expertIds = await contract.getArtworkExperts(i);
        if (expertIds.length > 0) {
          console.log("  Experts:", expertIds.map(id => id.toString()).join(", "));
        }
      } catch (error) {
        console.log(`  Error reading artwork #${i}:`, error.message);
      }
    }

    if (totalArtworks > 10) {
      console.log(`\n... and ${totalArtworks - 10} more artworks`);
    }
  } else {
    console.log("No artworks submitted yet.");
  }

  // List all experts
  console.log("\n=== Experts ===");
  const totalExperts = Number(nextExpertId) - 1;

  if (totalExperts > 0) {
    for (let i = 1; i <= Math.min(totalExperts, 10); i++) {
      try {
        const info = await contract.getExpertInfo(i);
        console.log(`\nExpert #${i}:`);
        console.log("  Address:", info.expertAddress);
        console.log("  Verified:", info.isVerified);
        console.log("  Authentications Completed:", info.authenticationsCompleted.toString());
        console.log("  Success Rate:", info.successRate.toString() + "%");
      } catch (error) {
        console.log(`  Error reading expert #${i}:`, error.message);
      }
    }

    if (totalExperts > 10) {
      console.log(`\n... and ${totalExperts - 10} more experts`);
    }
  } else {
    console.log("No experts registered yet.");
  }

  console.log("\n=== Summary ===");
  console.log(`Total Artworks: ${totalArtworks}`);
  console.log(`Total Experts: ${totalExperts}`);
  console.log(`Contract Owner: ${isOwner ? 'You (Admin Access)' : 'Different Address'}`);
  console.log("\n=== Interaction Complete ===\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Interaction failed:");
    console.error(error.message);
    process.exit(1);
  });
