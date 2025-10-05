const { ethers } = require("hardhat");

async function main() {
  console.log("=== Complete Authentication Flow Simulation ===\n");

  // Get signers
  const [owner, artworkOwner, expert1, expert2, expert3] = await ethers.getSigners();

  console.log("Participants:");
  console.log("- Owner/Admin:", owner.address);
  console.log("- Artwork Owner:", artworkOwner.address);
  console.log("- Expert 1:", expert1.address);
  console.log("- Expert 2:", expert2.address);
  console.log("- Expert 3:", expert3.address);

  // Deploy contract (for simulation on local network)
  console.log("\n1. Deploying contract...");
  const AnonymousArtAuthentication = await ethers.getContractFactory("AnonymousArtAuthentication");
  const contract = await AnonymousArtAuthentication.deploy();
  await contract.waitForDeployment();
  const contractAddress = await contract.getAddress();
  console.log("✅ Contract deployed to:", contractAddress);

  // 2. Submit artwork
  console.log("\n2. Artwork owner submits artwork for authentication...");
  const metadataHash = 12345; // Simulated hash of artwork metadata
  const condition = 85; // Condition score (0-100)
  const requiredConsensus = 67; // 67% consensus required (2 out of 3)

  const submitTx = await contract.connect(artworkOwner).submitArtwork(
    metadataHash,
    condition,
    requiredConsensus
  );
  await submitTx.wait();
  console.log("✅ Artwork submitted with ID: 1");
  console.log("   - Condition: 85/100");
  console.log("   - Required Consensus: 67%");

  // 3. Register experts
  console.log("\n3. Experts register on the platform...");

  const expert1Tx = await contract.connect(expert1).registerExpert(99);
  await expert1Tx.wait();
  console.log("✅ Expert 1 registered with ID: 1");

  const expert2Tx = await contract.connect(expert2).registerExpert(98);
  await expert2Tx.wait();
  console.log("✅ Expert 2 registered with ID: 2");

  const expert3Tx = await contract.connect(expert3).registerExpert(97);
  await expert3Tx.wait();
  console.log("✅ Expert 3 registered with ID: 3");

  // 4. Admin verifies experts
  console.log("\n4. Admin verifies expert credentials...");

  const verify1Tx = await contract.connect(owner).verifyExpert(1);
  await verify1Tx.wait();
  console.log("✅ Expert 1 verified");

  const verify2Tx = await contract.connect(owner).verifyExpert(2);
  await verify2Tx.wait();
  console.log("✅ Expert 2 verified");

  const verify3Tx = await contract.connect(owner).verifyExpert(3);
  await verify3Tx.wait();
  console.log("✅ Expert 3 verified");

  // 5. Experts submit authentications
  console.log("\n5. Verified experts submit their authentication assessments...");

  const auth1Tx = await contract.connect(expert1).submitAuthentication(
    1, // artworkId
    1, // expertId
    80, // authenticity score
    90  // confidence level
  );
  await auth1Tx.wait();
  console.log("✅ Expert 1 authenticated:");
  console.log("   - Authenticity: 80/100");
  console.log("   - Confidence: 90%");

  const auth2Tx = await contract.connect(expert2).submitAuthentication(
    1, // artworkId
    2, // expertId
    75, // authenticity score
    85  // confidence level
  );
  await auth2Tx.wait();
  console.log("✅ Expert 2 authenticated:");
  console.log("   - Authenticity: 75/100");
  console.log("   - Confidence: 85%");

  const auth3Tx = await contract.connect(expert3).submitAuthentication(
    1, // artworkId
    3, // expertId
    85, // authenticity score
    95  // confidence level
  );
  await auth3Tx.wait();
  console.log("✅ Expert 3 authenticated:");
  console.log("   - Authenticity: 85/100");
  console.log("   - Confidence: 95%");

  // 6. Check artwork status
  console.log("\n6. Checking artwork authentication status...");
  const artworkInfo = await contract.getArtworkInfo(1);
  console.log("   - Total Authentications:", artworkInfo.authenticationCount.toString());
  console.log("   - Required Consensus:", artworkInfo.expertConsensus.toString() + "%");

  // 7. Admin finalizes authentication
  console.log("\n7. Admin finalizes authentication result...");
  const finalScore = 80; // Average of 80, 75, 85
  const isAuthentic = true; // 100% of experts agreed (3/3 >= 67%)

  const finalizeTx = await contract.connect(owner).finalizeAuthentication(
    1,
    isAuthentic,
    finalScore
  );
  await finalizeTx.wait();
  console.log("✅ Authentication finalized");
  console.log("   - Result: AUTHENTIC");
  console.log("   - Final Score:", finalScore);

  // 8. Final verification
  console.log("\n8. Final verification...");
  const finalInfo = await contract.getArtworkInfo(1);
  console.log("   - Is Authenticated:", finalInfo.isAuthenticated);

  const expertIds = await contract.getArtworkExperts(1);
  console.log("   - Number of Experts:", expertIds.length);

  console.log("\n=== Simulation Complete ===");
  console.log("\nSummary:");
  console.log("✅ Artwork submitted and authenticated successfully");
  console.log("✅ 3 experts provided blind evaluations");
  console.log("✅ Consensus reached (100% agreement)");
  console.log("✅ Final authentication: AUTHENTIC with score 80/100");
  console.log("\nThis demonstrates the complete anonymous art authentication workflow!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
