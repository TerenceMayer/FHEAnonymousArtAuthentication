const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PrivateArtVerification", function () {
  let contract;
  let owner;
  let operator;
  let artworkOwner;
  let expert1;
  let expert2;
  let expert3;
  let nonExpert;

  const MIN_VERIFICATION_FEE = ethers.parseEther("0.01");
  const MIN_EXPERT_STAKE = ethers.parseEther("0.005");
  const DECRYPTION_TIMEOUT = 3600; // 1 hour in seconds

  beforeEach(async function () {
    [owner, operator, artworkOwner, expert1, expert2, expert3, nonExpert] = await ethers.getSigners();

    const PrivateArtVerification = await ethers.getContractFactory("PrivateArtVerification");
    contract = await PrivateArtVerification.deploy();
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

    it("Should initialize platformFees to 0", async function () {
      expect(await contract.platformFees()).to.equal(0);
    });

    it("Should have correct contract address", async function () {
      expect(await contract.getAddress()).to.be.properAddress;
    });
  });

  describe("Constants", function () {
    it("Should have correct MIN_VERIFICATION_FEE", async function () {
      expect(await contract.MIN_VERIFICATION_FEE()).to.equal(MIN_VERIFICATION_FEE);
    });

    it("Should have correct MIN_EXPERT_STAKE", async function () {
      expect(await contract.MIN_EXPERT_STAKE()).to.equal(MIN_EXPERT_STAKE);
    });

    it("Should have correct DECRYPTION_TIMEOUT", async function () {
      expect(await contract.DECRYPTION_TIMEOUT()).to.equal(DECRYPTION_TIMEOUT);
    });

    it("Should have correct MIN_EXPERTS_FOR_CONSENSUS", async function () {
      expect(await contract.MIN_EXPERTS_FOR_CONSENSUS()).to.equal(3);
    });

    it("Should have correct MAX_EXPERTS_PER_ARTWORK", async function () {
      expect(await contract.MAX_EXPERTS_PER_ARTWORK()).to.equal(10);
    });

    it("Should have correct PLATFORM_FEE_PERCENT", async function () {
      expect(await contract.PLATFORM_FEE_PERCENT()).to.equal(2);
    });
  });

  describe("Artwork Submission with Fee and Obfuscation", function () {
    it("Should allow artwork submission with valid fee", async function () {
      const metadataHash = 12345;
      const condition = 85;
      const price = 1000000n;
      const consensus = 75;

      await expect(
        contract.connect(artworkOwner).submitArtwork(metadataHash, condition, price, consensus, {
          value: MIN_VERIFICATION_FEE
        })
      )
        .to.emit(contract, "ArtworkSubmitted")
        .withArgs(1, artworkOwner.address, ethers.parseEther("0.0098")); // 98% of fee after platform cut
    });

    it("Should reject submission with insufficient fee", async function () {
      await expect(
        contract.connect(artworkOwner).submitArtwork(12345, 85, 1000000n, 75, {
          value: ethers.parseEther("0.005")
        })
      ).to.be.revertedWith("Insufficient verification fee");
    });

    it("Should reject zero price", async function () {
      await expect(
        contract.connect(artworkOwner).submitArtwork(12345, 85, 0n, 75, {
          value: MIN_VERIFICATION_FEE
        })
      ).to.be.revertedWith("Price must be greater than 0");
    });

    it("Should collect platform fees", async function () {
      await contract.connect(artworkOwner).submitArtwork(12345, 85, 1000000n, 75, {
        value: MIN_VERIFICATION_FEE
      });

      // Platform fee = 2% of 0.01 = 0.0002 ETH
      expect(await contract.platformFees()).to.equal(ethers.parseEther("0.0002"));
    });

    it("Should grant access to artwork owner", async function () {
      await contract.connect(artworkOwner).submitArtwork(12345, 85, 1000000n, 75, {
        value: MIN_VERIFICATION_FEE
      });

      expect(await contract.checkArtworkAccess(1, artworkOwner.address)).to.be.true;
    });

    it("Should store artwork info correctly", async function () {
      await contract.connect(artworkOwner).submitArtwork(12345, 85, 1000000n, 75, {
        value: MIN_VERIFICATION_FEE
      });

      const info = await contract.getArtworkInfo(1);
      expect(info.artworkOwner).to.equal(artworkOwner.address);
      expect(info.isSubmitted).to.be.true;
      expect(info.isAuthenticated).to.be.false;
      expect(info.authenticationCount).to.equal(0);
      expect(info.expertConsensus).to.equal(75);
      expect(info.decryptionFailed).to.be.false;
    });

    it("Should reject condition > 100", async function () {
      await expect(
        contract.connect(artworkOwner).submitArtwork(12345, 101, 1000000n, 75, {
          value: MIN_VERIFICATION_FEE
        })
      ).to.be.revertedWith("Value must be 0-100");
    });

    it("Should reject consensus < 51", async function () {
      await expect(
        contract.connect(artworkOwner).submitArtwork(12345, 85, 1000000n, 50, {
          value: MIN_VERIFICATION_FEE
        })
      ).to.be.revertedWith("Consensus must be 51-100%");
    });
  });

  describe("Expert Registration with Stake", function () {
    it("Should allow expert registration with stake", async function () {
      await expect(
        contract.connect(expert1).registerExpert(90, 5000, {
          value: MIN_EXPERT_STAKE
        })
      )
        .to.emit(contract, "ExpertRegistered")
        .withArgs(1, expert1.address, MIN_EXPERT_STAKE);
    });

    it("Should reject insufficient stake", async function () {
      await expect(
        contract.connect(expert1).registerExpert(90, 5000, {
          value: ethers.parseEther("0.001")
        })
      ).to.be.revertedWith("Insufficient stake amount");
    });

    it("Should store expert info correctly", async function () {
      await contract.connect(expert1).registerExpert(90, 5000, {
        value: MIN_EXPERT_STAKE
      });

      const info = await contract.getExpertInfo(1);
      expect(info.expertAddress).to.equal(expert1.address);
      expect(info.isVerified).to.be.false;
      expect(info.isActive).to.be.true;
      expect(info.authenticationsCompleted).to.equal(0);
      expect(info.stakedAmount).to.equal(MIN_EXPERT_STAKE);
    });

    it("Should reject credentials > 100", async function () {
      await expect(
        contract.connect(expert1).registerExpert(101, 5000, {
          value: MIN_EXPERT_STAKE
        })
      ).to.be.revertedWith("Value must be 0-100");
    });

    it("Should reject reputation > 10000", async function () {
      await expect(
        contract.connect(expert1).registerExpert(90, 10001, {
          value: MIN_EXPERT_STAKE
        })
      ).to.be.revertedWith("Reputation score too high");
    });
  });

  describe("Operator Authorization", function () {
    it("Should allow owner to authorize operator", async function () {
      await expect(contract.connect(owner).authorizeOperator(operator.address))
        .to.emit(contract, "OperatorAuthorized")
        .withArgs(operator.address);
    });

    it("Should reject non-owner authorization", async function () {
      await expect(
        contract.connect(artworkOwner).authorizeOperator(operator.address)
      ).to.be.revertedWith("Not authorized: owner only");
    });

    it("Should allow authorized operator to verify expert", async function () {
      await contract.connect(expert1).registerExpert(90, 5000, { value: MIN_EXPERT_STAKE });
      await contract.connect(owner).authorizeOperator(operator.address);

      await expect(contract.connect(operator).verifyExpert(1))
        .to.emit(contract, "ExpertVerified")
        .withArgs(1, expert1.address);
    });

    it("Should allow owner to revoke operator", async function () {
      await contract.connect(owner).authorizeOperator(operator.address);

      await expect(contract.connect(owner).revokeOperator(operator.address))
        .to.emit(contract, "OperatorRevoked")
        .withArgs(operator.address);
    });

    it("Should prevent revoked operator from verifying", async function () {
      await contract.connect(expert1).registerExpert(90, 5000, { value: MIN_EXPERT_STAKE });
      await contract.connect(owner).authorizeOperator(operator.address);
      await contract.connect(owner).revokeOperator(operator.address);

      await expect(
        contract.connect(operator).verifyExpert(1)
      ).to.be.revertedWith("Not authorized");
    });
  });

  describe("Expert Verification", function () {
    beforeEach(async function () {
      await contract.connect(expert1).registerExpert(90, 5000, { value: MIN_EXPERT_STAKE });
      await contract.connect(expert2).registerExpert(85, 4000, { value: MIN_EXPERT_STAKE });
    });

    it("Should allow owner to verify expert", async function () {
      await expect(contract.connect(owner).verifyExpert(1))
        .to.emit(contract, "ExpertVerified")
        .withArgs(1, expert1.address);

      const info = await contract.getExpertInfo(1);
      expect(info.isVerified).to.be.true;
    });

    it("Should reject verification from non-owner/operator", async function () {
      await expect(
        contract.connect(artworkOwner).verifyExpert(1)
      ).to.be.revertedWith("Not authorized");
    });

    it("Should reject verification of non-existent expert", async function () {
      await expect(
        contract.connect(owner).verifyExpert(999)
      ).to.be.revertedWith("Expert does not exist");
    });

    it("Should reject double verification", async function () {
      await contract.connect(owner).verifyExpert(1);
      await expect(
        contract.connect(owner).verifyExpert(1)
      ).to.be.revertedWith("Expert already verified");
    });
  });

  describe("Expert Deactivation", function () {
    beforeEach(async function () {
      await contract.connect(expert1).registerExpert(90, 5000, { value: MIN_EXPERT_STAKE });
      await contract.connect(owner).verifyExpert(1);
    });

    it("Should allow owner to deactivate expert", async function () {
      await expect(contract.connect(owner).deactivateExpert(1))
        .to.emit(contract, "ExpertDeactivated")
        .withArgs(1, expert1.address);

      const info = await contract.getExpertInfo(1);
      expect(info.isActive).to.be.false;
    });

    it("Should reject deactivation from non-owner", async function () {
      await expect(
        contract.connect(operator).deactivateExpert(1)
      ).to.be.revertedWith("Not authorized: owner only");
    });
  });

  describe("Authentication Submission", function () {
    beforeEach(async function () {
      await contract.connect(artworkOwner).submitArtwork(12345, 85, 1000000n, 75, {
        value: MIN_VERIFICATION_FEE
      });
      await contract.connect(expert1).registerExpert(90, 5000, { value: MIN_EXPERT_STAKE });
      await contract.connect(expert2).registerExpert(85, 4000, { value: MIN_EXPERT_STAKE });
      await contract.connect(owner).verifyExpert(1);
      await contract.connect(owner).verifyExpert(2);
    });

    it("Should allow verified expert to submit authentication", async function () {
      await expect(
        contract.connect(expert1).submitAuthentication(1, 1, 80, 90, 0xABCDEF12)
      )
        .to.emit(contract, "AuthenticationSubmitted")
        .withArgs(1, 1);
    });

    it("Should increment authentication count", async function () {
      await contract.connect(expert1).submitAuthentication(1, 1, 80, 90, 0xABCDEF12);

      const info = await contract.getArtworkInfo(1);
      expect(info.authenticationCount).to.equal(1);
    });

    it("Should reject unverified expert", async function () {
      await contract.connect(expert3).registerExpert(80, 3000, { value: MIN_EXPERT_STAKE });

      await expect(
        contract.connect(expert3).submitAuthentication(1, 3, 80, 90, 0xABCDEF12)
      ).to.be.revertedWith("Expert not verified");
    });

    it("Should reject deactivated expert", async function () {
      await contract.connect(owner).deactivateExpert(1);

      await expect(
        contract.connect(expert1).submitAuthentication(1, 1, 80, 90, 0xABCDEF12)
      ).to.be.revertedWith("Expert is inactive");
    });

    it("Should reject duplicate authentication", async function () {
      await contract.connect(expert1).submitAuthentication(1, 1, 80, 90, 0xABCDEF12);

      await expect(
        contract.connect(expert1).submitAuthentication(1, 1, 85, 95, 0x12345678)
      ).to.be.revertedWith("Authentication already submitted");
    });

    it("Should reject authenticity > 100", async function () {
      await expect(
        contract.connect(expert1).submitAuthentication(1, 1, 101, 90, 0xABCDEF12)
      ).to.be.revertedWith("Value must be 0-100");
    });

    it("Should reject confidence > 100", async function () {
      await expect(
        contract.connect(expert1).submitAuthentication(1, 1, 80, 101, 0xABCDEF12)
      ).to.be.revertedWith("Value must be 0-100");
    });

    it("Should track experts for artwork", async function () {
      await contract.connect(expert1).submitAuthentication(1, 1, 80, 90, 0xABCDEF12);
      await contract.connect(expert2).submitAuthentication(1, 2, 75, 85, 0x12345678);

      const experts = await contract.getArtworkExperts(1);
      expect(experts.length).to.equal(2);
      expect(experts[0]).to.equal(1);
      expect(experts[1]).to.equal(2);
    });
  });

  describe("Platform Fee Withdrawal", function () {
    beforeEach(async function () {
      await contract.connect(artworkOwner).submitArtwork(12345, 85, 1000000n, 75, {
        value: MIN_VERIFICATION_FEE
      });
    });

    it("Should allow owner to withdraw platform fees", async function () {
      const initialBalance = await ethers.provider.getBalance(operator.address);
      const platformFee = await contract.platformFees();

      await expect(contract.connect(owner).withdrawPlatformFees(operator.address))
        .to.emit(contract, "PlatformFeesWithdrawn")
        .withArgs(operator.address, platformFee);

      const finalBalance = await ethers.provider.getBalance(operator.address);
      expect(finalBalance - initialBalance).to.equal(platformFee);
    });

    it("Should reset platform fees after withdrawal", async function () {
      await contract.connect(owner).withdrawPlatformFees(operator.address);
      expect(await contract.platformFees()).to.equal(0);
    });

    it("Should reject withdrawal with zero fees", async function () {
      await contract.connect(owner).withdrawPlatformFees(operator.address);

      await expect(
        contract.connect(owner).withdrawPlatformFees(operator.address)
      ).to.be.revertedWith("No fees to withdraw");
    });

    it("Should reject withdrawal to zero address", async function () {
      await expect(
        contract.connect(owner).withdrawPlatformFees(ethers.ZeroAddress)
      ).to.be.revertedWith("Invalid recipient");
    });

    it("Should reject withdrawal from non-owner", async function () {
      await expect(
        contract.connect(artworkOwner).withdrawPlatformFees(artworkOwner.address)
      ).to.be.revertedWith("Not authorized: owner only");
    });
  });

  describe("Access Control", function () {
    beforeEach(async function () {
      await contract.connect(artworkOwner).submitArtwork(12345, 85, 1000000n, 75, {
        value: MIN_VERIFICATION_FEE
      });
    });

    it("Should allow artwork owner to grant access", async function () {
      await expect(contract.connect(artworkOwner).grantArtworkAccess(1, expert1.address))
        .to.emit(contract, "AccessGranted")
        .withArgs(1, expert1.address);

      expect(await contract.checkArtworkAccess(1, expert1.address)).to.be.true;
    });

    it("Should allow contract owner to grant access", async function () {
      await expect(contract.connect(owner).grantArtworkAccess(1, expert1.address))
        .to.emit(contract, "AccessGranted");
    });

    it("Should reject access grant from unauthorized address", async function () {
      await expect(
        contract.connect(nonExpert).grantArtworkAccess(1, expert1.address)
      ).to.be.revertedWith("Not authorized");
    });
  });

  describe("Decryption Status", function () {
    beforeEach(async function () {
      await contract.connect(artworkOwner).submitArtwork(12345, 85, 1000000n, 75, {
        value: MIN_VERIFICATION_FEE
      });
    });

    it("Should return correct initial decryption status", async function () {
      const status = await contract.getDecryptionStatus(1);

      expect(status.requestId).to.equal(0);
      expect(status.requestTime).to.equal(0);
      expect(status.completed).to.be.false;
      expect(status.failed).to.be.false;
      expect(status.timeoutReached).to.be.false;
    });
  });

  describe("Reward Status", function () {
    beforeEach(async function () {
      await contract.connect(artworkOwner).submitArtwork(12345, 85, 1000000n, 75, {
        value: MIN_VERIFICATION_FEE
      });
      await contract.connect(expert1).registerExpert(90, 5000, { value: MIN_EXPERT_STAKE });
      await contract.connect(owner).verifyExpert(1);
      await contract.connect(expert1).submitAuthentication(1, 1, 80, 90, 0xABCDEF12);
    });

    it("Should return correct initial reward status", async function () {
      const status = await contract.getRewardStatus(1, 1);

      expect(status.rewardAmount).to.equal(0);
      expect(status.claimed).to.be.false;
    });
  });

  describe("Complete Workflow", function () {
    it("Should handle complete authentication workflow", async function () {
      // 1. Submit artwork with fee
      await contract.connect(artworkOwner).submitArtwork(12345, 85, 1000000n, 75, {
        value: MIN_VERIFICATION_FEE
      });

      // 2. Register experts with stake
      await contract.connect(expert1).registerExpert(90, 5000, { value: MIN_EXPERT_STAKE });
      await contract.connect(expert2).registerExpert(85, 4000, { value: MIN_EXPERT_STAKE });
      await contract.connect(expert3).registerExpert(80, 3000, { value: MIN_EXPERT_STAKE });

      // 3. Verify experts
      await contract.connect(owner).verifyExpert(1);
      await contract.connect(owner).verifyExpert(2);
      await contract.connect(owner).verifyExpert(3);

      // 4. Submit authentications
      await contract.connect(expert1).submitAuthentication(1, 1, 80, 90, 0xABCDEF12);
      await contract.connect(expert2).submitAuthentication(1, 2, 75, 85, 0x12345678);
      await contract.connect(expert3).submitAuthentication(1, 3, 85, 95, 0x87654321);

      // 5. Verify final state
      const artworkInfo = await contract.getArtworkInfo(1);
      expect(artworkInfo.authenticationCount).to.equal(3);

      const expert1Info = await contract.getExpertInfo(1);
      expect(expert1Info.authenticationsCompleted).to.equal(1);
    });

    it("Should handle multiple artworks with same experts", async function () {
      // Setup experts
      await contract.connect(expert1).registerExpert(90, 5000, { value: MIN_EXPERT_STAKE });
      await contract.connect(expert2).registerExpert(85, 4000, { value: MIN_EXPERT_STAKE });
      await contract.connect(expert3).registerExpert(80, 3000, { value: MIN_EXPERT_STAKE });
      await contract.connect(owner).verifyExpert(1);
      await contract.connect(owner).verifyExpert(2);
      await contract.connect(owner).verifyExpert(3);

      // Submit 2 artworks
      await contract.connect(artworkOwner).submitArtwork(11111, 80, 500000n, 70, {
        value: MIN_VERIFICATION_FEE
      });
      await contract.connect(artworkOwner).submitArtwork(22222, 90, 1500000n, 80, {
        value: MIN_VERIFICATION_FEE
      });

      // Authenticate both
      await contract.connect(expert1).submitAuthentication(1, 1, 80, 90, 0xAAAAAAA1);
      await contract.connect(expert2).submitAuthentication(1, 2, 75, 85, 0xAAAAAAA2);
      await contract.connect(expert3).submitAuthentication(1, 3, 70, 80, 0xAAAAAAA3);

      await contract.connect(expert1).submitAuthentication(2, 1, 85, 95, 0xBBBBBBB1);
      await contract.connect(expert2).submitAuthentication(2, 2, 90, 90, 0xBBBBBBB2);
      await contract.connect(expert3).submitAuthentication(2, 3, 88, 92, 0xBBBBBBB3);

      // Verify expert completion counts
      const expert1Info = await contract.getExpertInfo(1);
      expect(expert1Info.authenticationsCompleted).to.equal(2);
    });
  });

  describe("Edge Cases", function () {
    it("Should handle minimum boundary values", async function () {
      await contract.connect(artworkOwner).submitArtwork(0, 0, 1n, 51, {
        value: MIN_VERIFICATION_FEE
      });

      const info = await contract.getArtworkInfo(1);
      expect(info.isSubmitted).to.be.true;
    });

    it("Should handle maximum boundary values", async function () {
      await contract.connect(artworkOwner).submitArtwork(
        0xFFFFFFFF, // max uint32
        100,        // max condition
        0xFFFFFFFFFFFFFFFFn, // max uint64
        100,        // max consensus
        { value: MIN_VERIFICATION_FEE }
      );

      const info = await contract.getArtworkInfo(1);
      expect(info.isSubmitted).to.be.true;
    });

    it("Should handle large verification fee", async function () {
      await contract.connect(artworkOwner).submitArtwork(12345, 85, 1000000n, 75, {
        value: ethers.parseEther("10")
      });

      // Platform fee = 2% of 10 = 0.2 ETH
      expect(await contract.platformFees()).to.equal(ethers.parseEther("0.2"));
    });

    it("Should return empty array for artwork with no experts", async function () {
      await contract.connect(artworkOwner).submitArtwork(12345, 85, 1000000n, 75, {
        value: MIN_VERIFICATION_FEE
      });

      const experts = await contract.getArtworkExperts(1);
      expect(experts.length).to.equal(0);
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

  describe("Security Checks", function () {
    it("Should prevent unauthorized operator authorization", async function () {
      await expect(
        contract.connect(artworkOwner).authorizeOperator(operator.address)
      ).to.be.revertedWith("Not authorized: owner only");
    });

    it("Should prevent zero address operator", async function () {
      await expect(
        contract.connect(owner).authorizeOperator(ethers.ZeroAddress)
      ).to.be.revertedWith("Invalid operator address");
    });

    it("Should prevent wrong expert ID usage", async function () {
      await contract.connect(artworkOwner).submitArtwork(12345, 85, 1000000n, 75, {
        value: MIN_VERIFICATION_FEE
      });
      await contract.connect(expert1).registerExpert(90, 5000, { value: MIN_EXPERT_STAKE });
      await contract.connect(expert2).registerExpert(85, 4000, { value: MIN_EXPERT_STAKE });
      await contract.connect(owner).verifyExpert(1);
      await contract.connect(owner).verifyExpert(2);

      // Expert 1 tries to use expert 2's ID
      await expect(
        contract.connect(expert1).submitAuthentication(1, 2, 80, 90, 0xABCDEF12)
      ).to.be.revertedWith("Not the registered expert");
    });

    it("Should prevent authentication on non-existent artwork", async function () {
      await contract.connect(expert1).registerExpert(90, 5000, { value: MIN_EXPERT_STAKE });
      await contract.connect(owner).verifyExpert(1);

      await expect(
        contract.connect(expert1).submitAuthentication(999, 1, 80, 90, 0xABCDEF12)
      ).to.be.revertedWith("Artwork does not exist");
    });
  });

  describe("Event Emission", function () {
    it("Should emit ArtworkSubmitted with correct args", async function () {
      await expect(
        contract.connect(artworkOwner).submitArtwork(12345, 85, 1000000n, 75, {
          value: MIN_VERIFICATION_FEE
        })
      )
        .to.emit(contract, "ArtworkSubmitted")
        .to.emit(contract, "AccessGranted");
    });

    it("Should emit ExpertRegistered with correct args", async function () {
      await expect(
        contract.connect(expert1).registerExpert(90, 5000, { value: MIN_EXPERT_STAKE })
      )
        .to.emit(contract, "ExpertRegistered")
        .withArgs(1, expert1.address, MIN_EXPERT_STAKE);
    });

    it("Should emit OperatorAuthorized on authorization", async function () {
      await expect(contract.connect(owner).authorizeOperator(operator.address))
        .to.emit(contract, "OperatorAuthorized")
        .withArgs(operator.address);
    });

    it("Should emit OperatorRevoked on revocation", async function () {
      await contract.connect(owner).authorizeOperator(operator.address);

      await expect(contract.connect(owner).revokeOperator(operator.address))
        .to.emit(contract, "OperatorRevoked")
        .withArgs(operator.address);
    });
  });
});
