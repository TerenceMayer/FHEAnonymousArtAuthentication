const { ethers } = require("hardhat");

async function main() {
  const contractAddress = process.env.CONTRACT_ADDRESS || "0x4D874585f820437656554590C812b672305fbb72";

  console.log("=== Contract Interaction Demo ===\n");
  console.log("Contract Address:", contractAddress);

  // Get the contract instance
  const AnonymousArtAuthentication = await ethers.getContractFactory("AnonymousArtAuthentication");
  const contract = AnonymousArtAuthentication.attach(contractAddress);

  // Get contract owner
  const owner = await contract.owner();
  console.log("Contract Owner:", owner);

  // Get current IDs
  const nextArtworkId = await contract.nextArtworkId();
  const nextExpertId = await contract.nextExpertId();
  console.log("\nCurrent State:");
  console.log("- Next Artwork ID:", nextArtworkId.toString());
  console.log("- Next Expert ID:", nextExpertId.toString());

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

  console.log("\n=== Interaction Complete ===\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
