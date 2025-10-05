const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AnonymousArtAuthentication", function () {
  let contract;
  let owner;
  let artworkOwner;
  let expert1;
  let expert2;
  let expert3;
  let nonExpert;

  beforeEach(async function () {
    // Get signers
    [owner, artworkOwner, expert1, expert2, expert3, nonExpert] = await ethers.getSigners();

    // Deploy contract
    const AnonymousArtAuthentication = await ethers.getContractFactory("AnonymousArtAuthentication");
    contract = await AnonymousArtAuthentication.deploy();
    await contract.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await contract.owner()).to.equal(owner.address);
    });

    it("Should initialize nextArtworkId to 1", async function () {
      expect(await contract.nextArtworkId()).to.equal(1);
    });

    it("Should initialize nextExpertId to 1", async function () {
      expect(await contract.nextExpertId()).to.equal(1);
    });

    it("Should have correct contract address", async function () {
      expect(await contract.getAddress()).to.be.properAddress;
    });

    it("Should be deployed on correct network", async function () {
      const network = await ethers.provider.getNetwork();
      expect(network.chainId).to.be.oneOf([31337n, 11155111n]); // Hardhat or Sepolia
    });
  });

  describe("Artwork Submission", function () {
    it("Should allow artwork submission with valid data", async function () {
      const metadataHash = 12345;
      const condition = 85;
      const consensus = 75;

      await expect(
        contract.connect(artworkOwner).submitArtwork(metadataHash, condition, consensus)
      )
        .to.emit(contract, "ArtworkSubmitted")
        .withArgs(1, artworkOwner.address);
    });

    it("Should increment artworkId after submission", async function () {
      await contract.connect(artworkOwner).submitArtwork(12345, 85, 75);
      expect(await contract.nextArtworkId()).to.equal(2);
    });

    it("Should reject condition > 100", async function () {
      await expect(
        contract.connect(artworkOwner).submitArtwork(12345, 101, 75)
      ).to.be.revertedWith("Condition must be 0-100");
    });

    it("Should reject consensus < 51", async function () {
      await expect(
        contract.connect(artworkOwner).submitArtwork(12345, 85, 50)
      ).to.be.revertedWith("Consensus must be 51-100%");
    });

    it("Should reject consensus > 100", async function () {
      await expect(
        contract.connect(artworkOwner).submitArtwork(12345, 85, 101)
      ).to.be.revertedWith("Consensus must be 51-100%");
    });

    it("Should accept condition = 0 (minimum boundary)", async function () {
      await expect(
        contract.connect(artworkOwner).submitArtwork(12345, 0, 75)
      ).to.not.be.reverted;
    });

    it("Should accept condition = 100 (maximum boundary)", async function () {
      await expect(
        contract.connect(artworkOwner).submitArtwork(12345, 100, 75)
      ).to.not.be.reverted;
    });

    it("Should accept consensus = 51 (minimum boundary)", async function () {
      await expect(
        contract.connect(artworkOwner).submitArtwork(12345, 85, 51)
      ).to.not.be.reverted;
    });

    it("Should store artwork information correctly", async function () {
      await contract.connect(artworkOwner).submitArtwork(12345, 85, 75);

      const artworkInfo = await contract.getArtworkInfo(1);
      expect(artworkInfo.artworkOwner).to.equal(artworkOwner.address);
      expect(artworkInfo.isSubmitted).to.be.true;
      expect(artworkInfo.isAuthenticated).to.be.false;
      expect(artworkInfo.authenticationCount).to.equal(0);
      expect(artworkInfo.expertConsensus).to.equal(75);
    });

    it("Should handle multiple artwork submissions", async function () {
      await contract.connect(artworkOwner).submitArtwork(11111, 80, 70);
      await contract.connect(artworkOwner).submitArtwork(22222, 90, 80);
      await contract.connect(artworkOwner).submitArtwork(33333, 75, 60);

      expect(await contract.nextArtworkId()).to.equal(4);
    });
  });

  describe("Expert Registration", function () {
    it("Should allow expert registration", async function () {
      const credentialsHash = 99;

      await expect(
        contract.connect(expert1).registerExpert(credentialsHash)
      )
        .to.emit(contract, "ExpertRegistered")
        .withArgs(1, expert1.address);
    });

    it("Should increment expertId after registration", async function () {
      await contract.connect(expert1).registerExpert(99);
      expect(await contract.nextExpertId()).to.equal(2);
    });

    it("Should set expert as not verified initially", async function () {
      await contract.connect(expert1).registerExpert(99);

      const expertInfo = await contract.getExpertInfo(1);
      expect(expertInfo.isVerified).to.be.false;
    });

    it("Should store expert information correctly", async function () {
      await contract.connect(expert1).registerExpert(99);

      const expertInfo = await contract.getExpertInfo(1);
      expect(expertInfo.expertAddress).to.equal(expert1.address);
      expect(expertInfo.authenticationsCompleted).to.equal(0);
      expect(expertInfo.successRate).to.equal(0);
    });

    it("Should allow multiple experts to register", async function () {
      await contract.connect(expert1).registerExpert(91);
      await contract.connect(expert2).registerExpert(92);
      await contract.connect(expert3).registerExpert(93);

      expect(await contract.nextExpertId()).to.equal(4);
    });

    it("Should allow same address to register multiple times (different IDs)", async function () {
      await contract.connect(expert1).registerExpert(91);
      await contract.connect(expert1).registerExpert(92);

      expect(await contract.nextExpertId()).to.equal(3);
    });

    it("Should accept credentials hash of 0", async function () {
      await expect(
        contract.connect(expert1).registerExpert(0)
      ).to.not.be.reverted;
    });

    it("Should accept credentials hash of 255 (max euint8)", async function () {
      await expect(
        contract.connect(expert1).registerExpert(255)
      ).to.not.be.reverted;
    });
  });

  describe("Expert Verification (Admin Only)", function () {
    beforeEach(async function () {
      // Register experts first
      await contract.connect(expert1).registerExpert(99);
      await contract.connect(expert2).registerExpert(98);
    });

    it("Should allow owner to verify expert", async function () {
      await expect(
        contract.connect(owner).verifyExpert(1)
      )
        .to.emit(contract, "ExpertVerified")
        .withArgs(1, expert1.address);
    });

    it("Should update expert verification status", async function () {
      await contract.connect(owner).verifyExpert(1);

      const expertInfo = await contract.getExpertInfo(1);
      expect(expertInfo.isVerified).to.be.true;
    });

    it("Should reject verification from non-owner", async function () {
      await expect(
        contract.connect(expert2).verifyExpert(1)
      ).to.be.revertedWith("Not authorized");
    });

    it("Should reject verification of non-existent expert", async function () {
      await expect(
        contract.connect(owner).verifyExpert(999)
      ).to.be.revertedWith("Expert does not exist");
    });

    it("Should allow verifying multiple experts", async function () {
      await contract.connect(owner).verifyExpert(1);
      await contract.connect(owner).verifyExpert(2);

      const expert1Info = await contract.getExpertInfo(1);
      const expert2Info = await contract.getExpertInfo(2);

      expect(expert1Info.isVerified).to.be.true;
      expect(expert2Info.isVerified).to.be.true;
    });

    it("Should allow verifying already verified expert (idempotent)", async function () {
      await contract.connect(owner).verifyExpert(1);
      await expect(
        contract.connect(owner).verifyExpert(1)
      ).to.not.be.reverted;
    });
  });

  describe("Authentication Submission", function () {
    beforeEach(async function () {
      // Setup: Submit artwork, register and verify experts
      await contract.connect(artworkOwner).submitArtwork(12345, 85, 75);
      await contract.connect(expert1).registerExpert(99);
      await contract.connect(expert2).registerExpert(98);
      await contract.connect(owner).verifyExpert(1);
      await contract.connect(owner).verifyExpert(2);
    });

    it("Should allow verified expert to submit authentication", async function () {
      await expect(
        contract.connect(expert1).submitAuthentication(1, 1, 80, 90)
      )
        .to.emit(contract, "AuthenticationSubmitted")
        .withArgs(1, 1);
    });

    it("Should increment artwork authentication count", async function () {
      await contract.connect(expert1).submitAuthentication(1, 1, 80, 90);

      const artworkInfo = await contract.getArtworkInfo(1);
      expect(artworkInfo.authenticationCount).to.equal(1);
    });

    it("Should increment expert authentications completed", async function () {
      await contract.connect(expert1).submitAuthentication(1, 1, 80, 90);

      const expertInfo = await contract.getExpertInfo(1);
      expect(expertInfo.authenticationsCompleted).to.equal(1);
    });

    it("Should reject authentication from unverified expert", async function () {
      await contract.connect(expert3).registerExpert(97);

      await expect(
        contract.connect(expert3).submitAuthentication(1, 3, 80, 90)
      ).to.be.revertedWith("Expert not verified");
    });

    it("Should reject authentication for non-existent artwork", async function () {
      await expect(
        contract.connect(expert1).submitAuthentication(999, 1, 80, 90)
      ).to.be.revertedWith("Artwork does not exist");
    });

    it("Should reject authenticity > 100", async function () {
      await expect(
        contract.connect(expert1).submitAuthentication(1, 1, 101, 90)
      ).to.be.revertedWith("Authenticity must be 0-100");
    });

    it("Should reject confidence > 100", async function () {
      await expect(
        contract.connect(expert1).submitAuthentication(1, 1, 80, 101)
      ).to.be.revertedWith("Confidence must be 0-100");
    });

    it("Should reject duplicate authentication from same expert", async function () {
      await contract.connect(expert1).submitAuthentication(1, 1, 80, 90);

      await expect(
        contract.connect(expert1).submitAuthentication(1, 1, 85, 95)
      ).to.be.revertedWith("Already submitted");
    });

    it("Should allow multiple experts to authenticate same artwork", async function () {
      await contract.connect(expert1).submitAuthentication(1, 1, 80, 90);
      await contract.connect(expert2).submitAuthentication(1, 2, 75, 85);

      const artworkInfo = await contract.getArtworkInfo(1);
      expect(artworkInfo.authenticationCount).to.equal(2);
    });

    it("Should reject when wrong expertId is used", async function () {
      await expect(
        contract.connect(expert1).submitAuthentication(1, 2, 80, 90)
      ).to.be.revertedWith("Not the expert");
    });

    it("Should accept authenticity = 0 (minimum boundary)", async function () {
      await expect(
        contract.connect(expert1).submitAuthentication(1, 1, 0, 90)
      ).to.not.be.reverted;
    });

    it("Should accept confidence = 0 (minimum boundary)", async function () {
      await expect(
        contract.connect(expert1).submitAuthentication(1, 1, 80, 0)
      ).to.not.be.reverted;
    });

    it("Should track artwork experts correctly", async function () {
      await contract.connect(expert1).submitAuthentication(1, 1, 80, 90);
      await contract.connect(expert2).submitAuthentication(1, 2, 75, 85);

      const expertIds = await contract.getArtworkExperts(1);
      expect(expertIds.length).to.equal(2);
      expect(expertIds[0]).to.equal(1);
      expect(expertIds[1]).to.equal(2);
    });
  });

  describe("Authentication Finalization", function () {
    beforeEach(async function () {
      // Setup: Submit artwork, register 3 experts, verify them, and submit authentications
      await contract.connect(artworkOwner).submitArtwork(12345, 85, 75);
      await contract.connect(expert1).registerExpert(99);
      await contract.connect(expert2).registerExpert(98);
      await contract.connect(expert3).registerExpert(97);
      await contract.connect(owner).verifyExpert(1);
      await contract.connect(owner).verifyExpert(2);
      await contract.connect(owner).verifyExpert(3);
      await contract.connect(expert1).submitAuthentication(1, 1, 80, 90);
      await contract.connect(expert2).submitAuthentication(1, 2, 75, 85);
      await contract.connect(expert3).submitAuthentication(1, 3, 85, 95);
    });

    it("Should allow owner to finalize authentication", async function () {
      await expect(
        contract.connect(owner).finalizeAuthentication(1, true, 80)
      )
        .to.emit(contract, "ArtworkAuthenticated")
        .withArgs(1, true, 80);
    });

    it("Should update artwork authentication status", async function () {
      await contract.connect(owner).finalizeAuthentication(1, true, 80);

      const artworkInfo = await contract.getArtworkInfo(1);
      expect(artworkInfo.isAuthenticated).to.be.true;
    });

    it("Should reject finalization from non-owner", async function () {
      await expect(
        contract.connect(expert1).finalizeAuthentication(1, true, 80)
      ).to.be.revertedWith("Not authorized");
    });

    it("Should reject finalization of non-existent artwork", async function () {
      await expect(
        contract.connect(owner).finalizeAuthentication(999, true, 80)
      ).to.be.revertedWith("Artwork does not exist");
    });

    it("Should reject finalization with insufficient authentications", async function () {
      await contract.connect(artworkOwner).submitArtwork(11111, 80, 70);
      await contract.connect(expert1).submitAuthentication(2, 1, 80, 90);

      await expect(
        contract.connect(owner).finalizeAuthentication(2, true, 80)
      ).to.be.revertedWith("Not enough authentications");
    });

    it("Should reject double finalization", async function () {
      await contract.connect(owner).finalizeAuthentication(1, true, 80);

      await expect(
        contract.connect(owner).finalizeAuthentication(1, true, 85)
      ).to.be.revertedWith("Already authenticated");
    });

    it("Should allow finalization with isAuthentic = false", async function () {
      await expect(
        contract.connect(owner).finalizeAuthentication(1, false, 40)
      ).to.not.be.reverted;
    });
  });

  describe("Success Rate Updates", function () {
    beforeEach(async function () {
      await contract.connect(expert1).registerExpert(99);
      await contract.connect(owner).verifyExpert(1);
    });

    it("Should allow owner to update expert success rate", async function () {
      await contract.connect(owner).updateExpertSuccessRate(1, 85);

      const expertInfo = await contract.getExpertInfo(1);
      expect(expertInfo.successRate).to.equal(85);
    });

    it("Should reject success rate > 100", async function () {
      await expect(
        contract.connect(owner).updateExpertSuccessRate(1, 101)
      ).to.be.revertedWith("Success rate must be 0-100");
    });

    it("Should reject update from non-owner", async function () {
      await expect(
        contract.connect(expert1).updateExpertSuccessRate(1, 85)
      ).to.be.revertedWith("Not authorized");
    });

    it("Should reject update for non-existent expert", async function () {
      await expect(
        contract.connect(owner).updateExpertSuccessRate(999, 85)
      ).to.be.revertedWith("Expert does not exist");
    });

    it("Should accept success rate = 0", async function () {
      await expect(
        contract.connect(owner).updateExpertSuccessRate(1, 0)
      ).to.not.be.reverted;
    });

    it("Should accept success rate = 100", async function () {
      await expect(
        contract.connect(owner).updateExpertSuccessRate(1, 100)
      ).to.not.be.reverted;
    });
  });

  describe("View Functions", function () {
    beforeEach(async function () {
      await contract.connect(artworkOwner).submitArtwork(12345, 85, 75);
      await contract.connect(expert1).registerExpert(99);
      await contract.connect(owner).verifyExpert(1);
    });

    it("Should return correct artwork info", async function () {
      const info = await contract.getArtworkInfo(1);

      expect(info.artworkOwner).to.equal(artworkOwner.address);
      expect(info.isSubmitted).to.be.true;
      expect(info.isAuthenticated).to.be.false;
      expect(info.authenticationCount).to.equal(0);
      expect(info.expertConsensus).to.equal(75);
    });

    it("Should return correct expert info", async function () {
      const info = await contract.getExpertInfo(1);

      expect(info.expertAddress).to.equal(expert1.address);
      expect(info.isVerified).to.be.true;
      expect(info.authenticationsCompleted).to.equal(0);
      expect(info.successRate).to.equal(0);
    });

    it("Should return empty array for artwork with no experts", async function () {
      const expertIds = await contract.getArtworkExperts(1);
      expect(expertIds.length).to.equal(0);
    });

    it("Should return default values for non-existent artwork", async function () {
      const info = await contract.getArtworkInfo(999);

      expect(info.artworkOwner).to.equal(ethers.ZeroAddress);
      expect(info.isSubmitted).to.be.false;
    });

    it("Should return default values for non-existent expert", async function () {
      const info = await contract.getExpertInfo(999);

      expect(info.expertAddress).to.equal(ethers.ZeroAddress);
      expect(info.isVerified).to.be.false;
    });
  });

  describe("Complex Scenarios", function () {
    it("Should handle complete authentication workflow", async function () {
      // 1. Submit artwork
      await contract.connect(artworkOwner).submitArtwork(12345, 85, 67);

      // 2. Register 3 experts
      await contract.connect(expert1).registerExpert(99);
      await contract.connect(expert2).registerExpert(98);
      await contract.connect(expert3).registerExpert(97);

      // 3. Verify experts
      await contract.connect(owner).verifyExpert(1);
      await contract.connect(owner).verifyExpert(2);
      await contract.connect(owner).verifyExpert(3);

      // 4. Submit authentications
      await contract.connect(expert1).submitAuthentication(1, 1, 80, 90);
      await contract.connect(expert2).submitAuthentication(1, 2, 75, 85);
      await contract.connect(expert3).submitAuthentication(1, 3, 85, 95);

      // 5. Finalize
      await contract.connect(owner).finalizeAuthentication(1, true, 80);

      // 6. Verify final state
      const artworkInfo = await contract.getArtworkInfo(1);
      expect(artworkInfo.isAuthenticated).to.be.true;
      expect(artworkInfo.authenticationCount).to.equal(3);

      const expert1Info = await contract.getExpertInfo(1);
      expect(expert1Info.authenticationsCompleted).to.equal(1);
    });

    it("Should handle multiple artworks with different experts", async function () {
      // Submit 2 artworks
      await contract.connect(artworkOwner).submitArtwork(11111, 80, 70);
      await contract.connect(artworkOwner).submitArtwork(22222, 90, 80);

      // Register and verify 3 experts
      await contract.connect(expert1).registerExpert(99);
      await contract.connect(expert2).registerExpert(98);
      await contract.connect(expert3).registerExpert(97);
      await contract.connect(owner).verifyExpert(1);
      await contract.connect(owner).verifyExpert(2);
      await contract.connect(owner).verifyExpert(3);

      // Authenticate artwork 1 with expert 1 & 2
      await contract.connect(expert1).submitAuthentication(1, 1, 80, 90);
      await contract.connect(expert2).submitAuthentication(1, 2, 75, 85);
      await contract.connect(expert3).submitAuthentication(1, 3, 70, 80);

      // Authenticate artwork 2 with expert 2 & 3
      await contract.connect(expert1).submitAuthentication(2, 1, 85, 95);
      await contract.connect(expert2).submitAuthentication(2, 2, 80, 90);
      await contract.connect(expert3).submitAuthentication(2, 3, 90, 95);

      // Verify counts
      const artwork1Info = await contract.getArtworkInfo(1);
      const artwork2Info = await contract.getArtworkInfo(2);
      expect(artwork1Info.authenticationCount).to.equal(3);
      expect(artwork2Info.authenticationCount).to.equal(3);

      const expert2Info = await contract.getExpertInfo(2);
      expect(expert2Info.authenticationsCompleted).to.equal(2);
    });
  });
});
