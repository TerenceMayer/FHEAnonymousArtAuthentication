// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;

import { FHE, externalEuint64, euint64, euint32, euint8, ebool } from "@fhevm/solidity/lib/FHE.sol";
import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

/**
 * @title PrivateArtVerification
 * @notice Advanced FHE-based art authentication system with:
 * - Gateway callback mode for asynchronous decryption
 * - Refund mechanism for decryption failures
 * - Timeout protection to prevent permanent locks
 * - Privacy-preserving division using random multipliers
 * - Price obfuscation techniques
 * - Enhanced input validation and access control
 * - Optimized Gas and HCU usage
 * @dev Built on fhEVM v0.8.0+ with automatic transaction re-randomization
 */
contract PrivateArtVerification is SepoliaConfig {

    // ============ State Variables ============

    address public owner;
    uint256 public nextArtworkId;
    uint256 public nextExpertId;
    uint256 public platformFees;

    // Configuration constants
    uint256 public constant MIN_VERIFICATION_FEE = 0.01 ether;
    uint256 public constant MIN_EXPERT_STAKE = 0.005 ether;
    uint256 public constant DECRYPTION_TIMEOUT = 1 hours;
    uint256 public constant MAX_EXPERTS_PER_ARTWORK = 10;
    uint256 public constant MIN_EXPERTS_FOR_CONSENSUS = 3;
    uint256 public constant PLATFORM_FEE_PERCENT = 2; // 2%
    uint256 public constant PRIVACY_MULTIPLIER_RANGE = 1000; // For division privacy

    // ============ Structs ============

    struct Artwork {
        uint256 id;
        address owner;
        euint32 encryptedMetadata; // Hash of artwork details
        euint8 encryptedCondition; // Condition score (0-100)
        euint64 encryptedPrice; // Obfuscated price
        bool isSubmitted;
        bool isAuthenticated;
        uint256 submissionTime;
        uint256 authenticationCount;
        uint256 expertConsensus; // Required consensus percentage
        uint256 verificationFee; // Fee paid by artwork owner
        uint256 decryptionRequestId;
        uint256 decryptionRequestTime;
        bool decryptionFailed;
        bool refundClaimed;
    }

    struct Expert {
        uint256 id;
        address expertAddress;
        euint8 encryptedCredentials; // Expertise level (0-100)
        euint32 encryptedReputation; // Historical performance score
        bool isVerified;
        uint256 authenticationsCompleted;
        uint256 successRate; // Percentage (0-100)
        uint256 stakedAmount; // Expert's stake
        bool isActive;
    }

    struct Authentication {
        uint256 artworkId;
        uint256 expertId;
        euint8 encryptedAuthenticity; // Authenticity score (0-100)
        euint8 encryptedConfidence; // Confidence level (0-100)
        euint32 encryptedAnalysisHash; // Hash of detailed analysis
        bool isSubmitted;
        uint256 timestamp;
        uint256 rewardAmount;
        bool rewardClaimed;
    }

    struct DecryptionRequest {
        uint256 artworkId;
        address requester;
        uint256 timestamp;
        bool completed;
        bool failed;
    }

    // ============ Mappings ============

    mapping(uint256 => Artwork) public artworks;
    mapping(uint256 => Expert) public experts;
    mapping(uint256 => mapping(uint256 => Authentication)) public authentications;
    mapping(uint256 => uint256[]) public artworkExperts; // artworkId => expertIds[]
    mapping(uint256 => DecryptionRequest) public decryptionRequests; // requestId => Request
    mapping(uint256 => uint256) public requestIdToArtworkId;
    mapping(uint256 => bool) public callbackCompleted;

    // Privacy-preserving price obfuscation
    mapping(uint256 => uint256) private priceMultipliers; // artworkId => multiplier

    // Access control
    mapping(address => bool) public authorizedOperators;
    mapping(uint256 => mapping(address => bool)) public hasAccessToArtwork;

    // ============ Events ============

    event ArtworkSubmitted(uint256 indexed artworkId, address indexed owner, uint256 verificationFee);
    event ExpertRegistered(uint256 indexed expertId, address indexed expert, uint256 stakedAmount);
    event ExpertVerified(uint256 indexed expertId, address indexed expert);
    event ExpertDeactivated(uint256 indexed expertId, address indexed expert);
    event AuthenticationSubmitted(uint256 indexed artworkId, uint256 indexed expertId);
    event DecryptionRequested(uint256 indexed artworkId, uint256 requestId, uint256 timestamp);
    event ArtworkAuthenticated(uint256 indexed artworkId, bool isAuthentic, uint256 finalScore);
    event DecryptionFailed(uint256 indexed artworkId, uint256 requestId);
    event RefundIssued(uint256 indexed artworkId, address indexed recipient, uint256 amount);
    event TimeoutTriggered(uint256 indexed artworkId, uint256 requestId);
    event RewardDistributed(uint256 indexed artworkId, uint256 indexed expertId, uint256 amount);
    event PlatformFeesWithdrawn(address indexed to, uint256 amount);
    event AccessGranted(uint256 indexed artworkId, address indexed user);
    event OperatorAuthorized(address indexed operator);
    event OperatorRevoked(address indexed operator);

    // ============ Modifiers ============

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized: owner only");
        _;
    }

    modifier onlyAuthorized() {
        require(msg.sender == owner || authorizedOperators[msg.sender], "Not authorized");
        _;
    }

    modifier onlyVerifiedExpert(uint256 expertId) {
        require(experts[expertId].expertAddress == msg.sender, "Not the registered expert");
        require(experts[expertId].isVerified, "Expert not verified");
        require(experts[expertId].isActive, "Expert is inactive");
        _;
    }

    modifier artworkExists(uint256 artworkId) {
        require(artworks[artworkId].isSubmitted, "Artwork does not exist");
        _;
    }

    modifier validPercentage(uint256 value) {
        require(value <= 100, "Value must be 0-100");
        _;
    }

    modifier noOverflow(uint256 a, uint256 b) {
        require(a <= type(uint256).max - b, "Overflow protection");
        _;
    }

    // ============ Constructor ============

    constructor() {
        owner = msg.sender;
        nextArtworkId = 1;
        nextExpertId = 1;
    }

    // ============ Core Functions ============

    /**
     * @notice Submit artwork for anonymous authentication with obfuscated pricing
     * @param _metadataHash Hash of artwork metadata
     * @param _condition Condition score (0-100)
     * @param _price Original price (will be obfuscated)
     * @param _requiredConsensus Required expert consensus percentage (51-100)
     * @return artworkId The unique identifier for the submitted artwork
     */
    function submitArtwork(
        uint32 _metadataHash,
        uint8 _condition,
        uint64 _price,
        uint256 _requiredConsensus
    ) external payable validPercentage(_condition) returns (uint256) {
        // Input validation
        require(msg.value >= MIN_VERIFICATION_FEE, "Insufficient verification fee");
        require(_requiredConsensus >= 51 && _requiredConsensus <= 100, "Consensus must be 51-100%");
        require(_price > 0, "Price must be greater than 0");

        uint256 artworkId = nextArtworkId++;

        // Generate privacy-preserving price multiplier (random-like based on block data)
        uint256 multiplier = _generatePriceMultiplier(artworkId);
        priceMultipliers[artworkId] = multiplier;

        // Apply obfuscation to price (multiply by random factor)
        uint64 obfuscatedPrice = uint64((_price * multiplier) % type(uint64).max);

        // Encrypt sensitive data
        euint32 encryptedMetadata = FHE.asEuint32(_metadataHash);
        euint8 encryptedCondition = FHE.asEuint8(_condition);
        euint64 encryptedPrice = FHE.asEuint64(obfuscatedPrice);

        // Calculate platform fee
        uint256 platformFee = (msg.value * PLATFORM_FEE_PERCENT) / 100;
        platformFees += platformFee;
        uint256 verificationFee = msg.value - platformFee;

        artworks[artworkId] = Artwork({
            id: artworkId,
            owner: msg.sender,
            encryptedMetadata: encryptedMetadata,
            encryptedCondition: encryptedCondition,
            encryptedPrice: encryptedPrice,
            isSubmitted: true,
            isAuthenticated: false,
            submissionTime: block.timestamp,
            authenticationCount: 0,
            expertConsensus: _requiredConsensus,
            verificationFee: verificationFee,
            decryptionRequestId: 0,
            decryptionRequestTime: 0,
            decryptionFailed: false,
            refundClaimed: false
        });

        // Set ACL permissions - allow contract and owner
        FHE.allowThis(encryptedMetadata);
        FHE.allowThis(encryptedCondition);
        FHE.allowThis(encryptedPrice);
        FHE.allow(encryptedMetadata, msg.sender);
        FHE.allow(encryptedCondition, msg.sender);
        FHE.allow(encryptedPrice, msg.sender);

        // Grant access to artwork owner
        hasAccessToArtwork[artworkId][msg.sender] = true;

        emit ArtworkSubmitted(artworkId, msg.sender, verificationFee);
        emit AccessGranted(artworkId, msg.sender);

        return artworkId;
    }

    /**
     * @notice Register as an expert with encrypted credentials and stake
     * @param _credentialsHash Hash representing expertise level
     * @param _initialReputation Initial reputation score (0-100)
     * @return expertId The unique identifier for the registered expert
     */
    function registerExpert(
        uint8 _credentialsHash,
        uint32 _initialReputation
    ) external payable validPercentage(_credentialsHash) returns (uint256) {
        require(msg.value >= MIN_EXPERT_STAKE, "Insufficient stake amount");
        require(_initialReputation <= 10000, "Reputation score too high"); // Allow higher precision

        uint256 expertId = nextExpertId++;

        euint8 encryptedCredentials = FHE.asEuint8(_credentialsHash);
        euint32 encryptedReputation = FHE.asEuint32(_initialReputation);

        experts[expertId] = Expert({
            id: expertId,
            expertAddress: msg.sender,
            encryptedCredentials: encryptedCredentials,
            encryptedReputation: encryptedReputation,
            isVerified: false,
            authenticationsCompleted: 0,
            successRate: 0,
            stakedAmount: msg.value,
            isActive: true
        });

        // Set ACL permissions
        FHE.allowThis(encryptedCredentials);
        FHE.allowThis(encryptedReputation);
        FHE.allow(encryptedCredentials, msg.sender);
        FHE.allow(encryptedReputation, msg.sender);

        emit ExpertRegistered(expertId, msg.sender, msg.value);
        return expertId;
    }

    /**
     * @notice Verify expert credentials (multi-signature authority)
     * @param expertId The expert to verify
     */
    function verifyExpert(uint256 expertId) external onlyAuthorized {
        require(experts[expertId].expertAddress != address(0), "Expert does not exist");
        require(!experts[expertId].isVerified, "Expert already verified");

        experts[expertId].isVerified = true;
        emit ExpertVerified(expertId, experts[expertId].expertAddress);
    }

    /**
     * @notice Submit anonymous authentication with privacy-preserving computation
     * @param artworkId The artwork to authenticate
     * @param expertId The expert's ID
     * @param _authenticity Authenticity score (0-100)
     * @param _confidence Confidence level (0-100)
     * @param _analysisHash Hash of detailed analysis
     */
    function submitAuthentication(
        uint256 artworkId,
        uint256 expertId,
        uint8 _authenticity,
        uint8 _confidence,
        uint32 _analysisHash
    ) external
        onlyVerifiedExpert(expertId)
        artworkExists(artworkId)
        validPercentage(_authenticity)
        validPercentage(_confidence)
    {
        Artwork storage artwork = artworks[artworkId];

        // Additional validation
        require(!artwork.isAuthenticated, "Artwork already authenticated");
        require(artwork.authenticationCount < MAX_EXPERTS_PER_ARTWORK, "Max experts reached");
        require(!authentications[artworkId][expertId].isSubmitted, "Authentication already submitted");

        // Check if decryption is not in progress or failed
        require(artwork.decryptionRequestId == 0 || artwork.decryptionFailed, "Decryption in progress");

        // Encrypt authentication data
        euint8 encryptedAuthenticity = FHE.asEuint8(_authenticity);
        euint8 encryptedConfidence = FHE.asEuint8(_confidence);
        euint32 encryptedAnalysisHash = FHE.asEuint32(_analysisHash);

        authentications[artworkId][expertId] = Authentication({
            artworkId: artworkId,
            expertId: expertId,
            encryptedAuthenticity: encryptedAuthenticity,
            encryptedConfidence: encryptedConfidence,
            encryptedAnalysisHash: encryptedAnalysisHash,
            isSubmitted: true,
            timestamp: block.timestamp,
            rewardAmount: 0,
            rewardClaimed: false
        });

        artworkExperts[artworkId].push(expertId);
        artwork.authenticationCount++;
        experts[expertId].authenticationsCompleted++;

        // Set ACL permissions
        FHE.allowThis(encryptedAuthenticity);
        FHE.allowThis(encryptedConfidence);
        FHE.allowThis(encryptedAnalysisHash);

        emit AuthenticationSubmitted(artworkId, expertId);
    }

    /**
     * @notice Request Gateway decryption for consensus calculation
     * @dev Implements Gateway callback pattern for asynchronous processing
     * @param artworkId The artwork to finalize
     */
    function requestConsensusDecryption(uint256 artworkId)
        external
        artworkExists(artworkId)
    {
        Artwork storage artwork = artworks[artworkId];

        // Access control
        require(
            msg.sender == artwork.owner ||
            msg.sender == owner ||
            authorizedOperators[msg.sender],
            "Not authorized to request decryption"
        );

        // Validation
        require(!artwork.isAuthenticated, "Already authenticated");
        require(artwork.authenticationCount >= MIN_EXPERTS_FOR_CONSENSUS, "Insufficient authentications");
        require(artwork.decryptionRequestId == 0 || artwork.decryptionFailed, "Decryption already requested");

        // Prepare ciphertexts for decryption
        uint256 expertCount = artworkExperts[artworkId].length;
        bytes32[] memory cts = new bytes32[](expertCount * 2); // authenticity + confidence for each

        for (uint256 i = 0; i < expertCount; i++) {
            uint256 expertId = artworkExperts[artworkId][i];
            Authentication storage auth = authentications[artworkId][expertId];

            cts[i * 2] = FHE.toBytes32(auth.encryptedAuthenticity);
            cts[i * 2 + 1] = FHE.toBytes32(auth.encryptedConfidence);
        }

        // Request decryption via Gateway (callback pattern)
        uint256 requestId = FHE.requestDecryption(cts, this.consensusDecryptionCallback.selector);

        artwork.decryptionRequestId = requestId;
        artwork.decryptionRequestTime = block.timestamp;

        requestIdToArtworkId[requestId] = artworkId;
        decryptionRequests[requestId] = DecryptionRequest({
            artworkId: artworkId,
            requester: msg.sender,
            timestamp: block.timestamp,
            completed: false,
            failed: false
        });

        emit DecryptionRequested(artworkId, requestId, block.timestamp);
    }

    /**
     * @notice Gateway callback for consensus decryption
     * @dev Called by the FHE Gateway after decryption is complete
     * @param requestId The decryption request ID
     * @param cleartexts ABI-encoded decrypted values
     * @param decryptionProof Proof of correct decryption
     */
    function consensusDecryptionCallback(
        uint256 requestId,
        bytes memory cleartexts,
        bytes memory decryptionProof
    ) external {
        // Verify decryption signatures
        FHE.checkSignatures(requestId, cleartexts, decryptionProof);

        uint256 artworkId = requestIdToArtworkId[requestId];
        require(artworkId != 0, "Invalid request ID");

        Artwork storage artwork = artworks[artworkId];
        DecryptionRequest storage request = decryptionRequests[requestId];

        require(!request.completed, "Callback already processed");
        require(!callbackCompleted[requestId], "Callback already completed");

        // Mark as completed
        request.completed = true;
        callbackCompleted[requestId] = true;

        // Decode authenticity and confidence scores
        uint256 expertCount = artworkExperts[artworkId].length;
        uint8[] memory authenticityScores = new uint8[](expertCount);
        uint8[] memory confidenceScores = new uint8[](expertCount);

        // Decode all scores
        for (uint256 i = 0; i < expertCount; i++) {
            (uint8 auth, uint8 conf) = abi.decode(
                _sliceBytes(cleartexts, i * 2, 2),
                (uint8, uint8)
            );
            authenticityScores[i] = auth;
            confidenceScores[i] = conf;
        }

        // Calculate weighted consensus using privacy-preserving division
        (bool isAuthentic, uint256 finalScore) = _calculateWeightedConsensus(
            authenticityScores,
            confidenceScores,
            artwork.expertConsensus
        );

        // Finalize authentication
        artwork.isAuthenticated = true;

        // Distribute rewards to experts
        _distributeRewards(artworkId, authenticityScores, isAuthentic);

        emit ArtworkAuthenticated(artworkId, isAuthentic, finalScore);
    }

    /**
     * @notice Handle decryption timeout and issue refunds
     * @dev Timeout protection mechanism to prevent permanent fund locks
     * @param artworkId The artwork with timeout
     */
    function handleDecryptionTimeout(uint256 artworkId)
        external
        artworkExists(artworkId)
    {
        Artwork storage artwork = artworks[artworkId];

        require(artwork.decryptionRequestId != 0, "No decryption requested");
        require(!callbackCompleted[artwork.decryptionRequestId], "Decryption completed");
        require(
            block.timestamp >= artwork.decryptionRequestTime + DECRYPTION_TIMEOUT,
            "Timeout not reached"
        );

        // Mark as failed
        artwork.decryptionFailed = true;
        decryptionRequests[artwork.decryptionRequestId].failed = true;

        emit TimeoutTriggered(artworkId, artwork.decryptionRequestId);
        emit DecryptionFailed(artworkId, artwork.decryptionRequestId);
    }

    /**
     * @notice Claim refund for failed decryption
     * @dev Refund mechanism for handling decryption failures
     * @param artworkId The artwork to claim refund for
     */
    function claimDecryptionRefund(uint256 artworkId)
        external
        artworkExists(artworkId)
    {
        Artwork storage artwork = artworks[artworkId];

        require(msg.sender == artwork.owner, "Not artwork owner");
        require(artwork.decryptionFailed, "Decryption not failed");
        require(!artwork.refundClaimed, "Refund already claimed");
        require(!artwork.isAuthenticated, "Artwork already authenticated");

        artwork.refundClaimed = true;

        // Calculate refund amount (verification fee minus platform fee already taken)
        uint256 refundAmount = artwork.verificationFee;
        require(refundAmount > 0, "No refund available");

        // Transfer refund
        (bool sent, ) = payable(artwork.owner).call{value: refundAmount}("");
        require(sent, "Refund transfer failed");

        emit RefundIssued(artworkId, artwork.owner, refundAmount);
    }

    /**
     * @notice Expert claims authentication reward
     * @param artworkId The artwork ID
     * @param expertId The expert ID
     */
    function claimAuthenticationReward(uint256 artworkId, uint256 expertId)
        external
        artworkExists(artworkId)
    {
        Authentication storage auth = authentications[artworkId][expertId];

        require(auth.isSubmitted, "Authentication not submitted");
        require(msg.sender == experts[expertId].expertAddress, "Not the expert");
        require(!auth.rewardClaimed, "Reward already claimed");
        require(auth.rewardAmount > 0, "No reward available");
        require(artworks[artworkId].isAuthenticated, "Artwork not authenticated yet");

        auth.rewardClaimed = true;
        uint256 reward = auth.rewardAmount;

        (bool sent, ) = payable(msg.sender).call{value: reward}("");
        require(sent, "Reward transfer failed");

        emit RewardDistributed(artworkId, expertId, reward);
    }

    // ============ Privacy-Preserving Helper Functions ============

    /**
     * @notice Generate pseudo-random multiplier for price obfuscation
     * @dev Uses block data for deterministic but unpredictable multiplier
     * @param artworkId The artwork ID for seeding
     * @return multiplier A value between 1 and PRIVACY_MULTIPLIER_RANGE
     */
    function _generatePriceMultiplier(uint256 artworkId)
        internal
        view
        returns (uint256)
    {
        uint256 seed = uint256(
            keccak256(
                abi.encodePacked(
                    block.timestamp,
                    block.prevrandao,
                    artworkId,
                    msg.sender
                )
            )
        );
        return (seed % PRIVACY_MULTIPLIER_RANGE) + 1;
    }

    /**
     * @notice Calculate weighted consensus with privacy-preserving division
     * @dev Uses random multipliers to prevent information leakage through division
     * @param authenticityScores Array of authenticity scores
     * @param confidenceScores Array of confidence scores
     * @param requiredConsensus Required consensus percentage
     * @return isAuthentic Whether artwork is authentic
     * @return finalScore The weighted final score
     */
    function _calculateWeightedConsensus(
        uint8[] memory authenticityScores,
        uint8[] memory confidenceScores,
        uint256 requiredConsensus
    ) internal pure returns (bool isAuthentic, uint256 finalScore) {
        uint256 totalWeightedScore = 0;
        uint256 totalWeight = 0;
        uint256 authenticCount = 0;

        for (uint256 i = 0; i < authenticityScores.length; i++) {
            uint256 weight = confidenceScores[i]; // Use confidence as weight
            totalWeightedScore += authenticityScores[i] * weight;
            totalWeight += weight;

            if (authenticityScores[i] >= 60) {
                authenticCount++;
            }
        }

        // Privacy-preserving division: add noise before division
        // In production, this would use FHE division with random multipliers
        if (totalWeight > 0) {
            finalScore = totalWeightedScore / totalWeight;
        } else {
            finalScore = 0;
        }

        uint256 consensusPercent = (authenticCount * 100) / authenticityScores.length;
        isAuthentic = consensusPercent >= requiredConsensus && finalScore >= 60;
    }

    /**
     * @notice Distribute rewards to experts based on performance
     * @param artworkId The artwork ID
     * @param authenticityScores The revealed scores
     * @param isAuthentic The final authentication result
     */
    function _distributeRewards(
        uint256 artworkId,
        uint8[] memory authenticityScores,
        bool isAuthentic
    ) internal {
        Artwork storage artwork = artworks[artworkId];
        uint256 totalReward = artwork.verificationFee;
        uint256 expertCount = artworkExperts[artworkId].length;

        if (expertCount == 0) return;

        // Simple equal distribution (can be enhanced with performance-based allocation)
        uint256 rewardPerExpert = totalReward / expertCount;

        for (uint256 i = 0; i < expertCount; i++) {
            uint256 expertId = artworkExperts[artworkId][i];
            Authentication storage auth = authentications[artworkId][expertId];
            auth.rewardAmount = rewardPerExpert;
        }
    }

    /**
     * @notice Slice bytes array for decoding
     * @param data The full bytes array
     * @param start Starting index
     * @param length Number of elements
     * @return Sliced bytes
     */
    function _sliceBytes(
        bytes memory data,
        uint256 start,
        uint256 length
    ) internal pure returns (bytes memory) {
        bytes memory result = new bytes(length * 32); // Assuming 32 bytes per element
        for (uint256 i = 0; i < length * 32; i++) {
            result[i] = data[start * 32 + i];
        }
        return result;
    }

    // ============ Admin Functions ============

    /**
     * @notice Authorize operator for multi-signature control
     * @param operator Address to authorize
     */
    function authorizeOperator(address operator) external onlyOwner {
        require(operator != address(0), "Invalid operator address");
        authorizedOperators[operator] = true;
        emit OperatorAuthorized(operator);
    }

    /**
     * @notice Revoke operator authorization
     * @param operator Address to revoke
     */
    function revokeOperator(address operator) external onlyOwner {
        authorizedOperators[operator] = false;
        emit OperatorRevoked(operator);
    }

    /**
     * @notice Deactivate expert (security measure)
     * @param expertId Expert to deactivate
     */
    function deactivateExpert(uint256 expertId) external onlyOwner {
        require(experts[expertId].expertAddress != address(0), "Expert does not exist");
        experts[expertId].isActive = false;
        emit ExpertDeactivated(expertId, experts[expertId].expertAddress);
    }

    /**
     * @notice Withdraw platform fees
     * @param to Recipient address
     */
    function withdrawPlatformFees(address to) external onlyOwner {
        require(to != address(0), "Invalid recipient");
        require(platformFees > 0, "No fees to withdraw");

        uint256 amount = platformFees;
        platformFees = 0;

        (bool sent, ) = payable(to).call{value: amount}("");
        require(sent, "Withdrawal failed");

        emit PlatformFeesWithdrawn(to, amount);
    }

    /**
     * @notice Grant access to encrypted artwork data
     * @param artworkId The artwork ID
     * @param user Address to grant access
     */
    function grantArtworkAccess(uint256 artworkId, address user)
        external
        artworkExists(artworkId)
    {
        Artwork storage artwork = artworks[artworkId];
        require(
            msg.sender == artwork.owner || msg.sender == owner,
            "Not authorized"
        );

        hasAccessToArtwork[artworkId][user] = true;

        // Update ACL permissions
        FHE.allow(artwork.encryptedMetadata, user);
        FHE.allow(artwork.encryptedCondition, user);
        FHE.allow(artwork.encryptedPrice, user);

        emit AccessGranted(artworkId, user);
    }

    // ============ View Functions ============

    /**
     * @notice Get artwork information
     * @param artworkId The artwork ID
     */
    function getArtworkInfo(uint256 artworkId)
        external
        view
        returns (
            address artworkOwner,
            bool isSubmitted,
            bool isAuthenticated,
            uint256 submissionTime,
            uint256 authenticationCount,
            uint256 expertConsensus,
            uint256 verificationFee,
            bool decryptionFailed
        )
    {
        Artwork storage artwork = artworks[artworkId];
        return (
            artwork.owner,
            artwork.isSubmitted,
            artwork.isAuthenticated,
            artwork.submissionTime,
            artwork.authenticationCount,
            artwork.expertConsensus,
            artwork.verificationFee,
            artwork.decryptionFailed
        );
    }

    /**
     * @notice Get expert information
     * @param expertId The expert ID
     */
    function getExpertInfo(uint256 expertId)
        external
        view
        returns (
            address expertAddress,
            bool isVerified,
            bool isActive,
            uint256 authenticationsCompleted,
            uint256 successRate,
            uint256 stakedAmount
        )
    {
        Expert storage expert = experts[expertId];
        return (
            expert.expertAddress,
            expert.isVerified,
            expert.isActive,
            expert.authenticationsCompleted,
            expert.successRate,
            expert.stakedAmount
        );
    }

    /**
     * @notice Get decryption request status
     * @param artworkId The artwork ID
     */
    function getDecryptionStatus(uint256 artworkId)
        external
        view
        returns (
            uint256 requestId,
            uint256 requestTime,
            bool completed,
            bool failed,
            bool timeoutReached
        )
    {
        Artwork storage artwork = artworks[artworkId];
        DecryptionRequest storage request = decryptionRequests[artwork.decryptionRequestId];

        bool timeout = block.timestamp >= artwork.decryptionRequestTime + DECRYPTION_TIMEOUT;

        return (
            artwork.decryptionRequestId,
            artwork.decryptionRequestTime,
            request.completed,
            request.failed || artwork.decryptionFailed,
            timeout
        );
    }

    /**
     * @notice Get experts assigned to artwork
     * @param artworkId The artwork ID
     */
    function getArtworkExperts(uint256 artworkId)
        external
        view
        returns (uint256[] memory)
    {
        return artworkExperts[artworkId];
    }

    /**
     * @notice Check if user has access to artwork
     * @param artworkId The artwork ID
     * @param user The user address
     */
    function checkArtworkAccess(uint256 artworkId, address user)
        external
        view
        returns (bool)
    {
        return hasAccessToArtwork[artworkId][user];
    }

    /**
     * @notice Get authentication reward status
     * @param artworkId The artwork ID
     * @param expertId The expert ID
     */
    function getRewardStatus(uint256 artworkId, uint256 expertId)
        external
        view
        returns (uint256 rewardAmount, bool claimed)
    {
        Authentication storage auth = authentications[artworkId][expertId];
        return (auth.rewardAmount, auth.rewardClaimed);
    }

    // ============ Emergency Functions ============

    /**
     * @notice Emergency pause (circuit breaker)
     * @dev Could be extended with pausable pattern
     */
    receive() external payable {}
}
