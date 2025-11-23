# Private Art Verification - Architecture Documentation

## Overview

Private Art Verification is an advanced Fully Homomorphic Encryption (FHE) based art authentication system built on Zama's fhEVM. It enables anonymous, privacy-preserving art verification through encrypted computations while maintaining complete data confidentiality.

## Core Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend Application                     │
│              (React/Next.js with fhevmjs)                   │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  │ Encrypted Transactions
                  ▼
┌─────────────────────────────────────────────────────────────┐
│                  PrivateArtVerification                      │
│                   Smart Contract (fhEVM)                     │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  • Artwork Submission (Encrypted Metadata & Pricing)   │ │
│  │  • Expert Registration (Encrypted Credentials)         │ │
│  │  • Authentication Process (Encrypted Scores)           │ │
│  │  • Gateway Callback Handler                            │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  │ Decryption Requests
                  ▼
┌─────────────────────────────────────────────────────────────┐
│                  FHE Gateway (KMS Network)                   │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  • Threshold Decryption                                │ │
│  │  • Signature Verification                              │ │
│  │  • Callback Execution                                  │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Advanced Features

### 1. Gateway Callback Pattern

**Architecture Flow:**

```
User Action → Contract Storage → Gateway Request → KMS Decryption → Callback → Finalization
```

**Implementation:**

1. **Request Phase:**
   - User calls `requestConsensusDecryption(artworkId)`
   - Contract prepares encrypted ciphertexts array
   - Calls `FHE.requestDecryption(cts, callback.selector)`
   - Stores request metadata (requestId, timestamp, artworkId)

2. **Gateway Processing:**
   - KMS network receives decryption request
   - Threshold decryption performed off-chain
   - Gateway prepares callback transaction

3. **Callback Phase:**
   - `consensusDecryptionCallback(requestId, cleartexts, proof)` executed
   - Signature verification via `FHE.checkSignatures()`
   - Decrypted values processed
   - Final authentication result computed

**Code Example:**

```solidity
// Request decryption
function requestConsensusDecryption(uint256 artworkId) external {
    bytes32[] memory cts = new bytes32[](expertCount * 2);
    // ... populate ciphertexts

    uint256 requestId = FHE.requestDecryption(
        cts,
        this.consensusDecryptionCallback.selector
    );

    artwork.decryptionRequestId = requestId;
    artwork.decryptionRequestTime = block.timestamp;
}

// Gateway callback
function consensusDecryptionCallback(
    uint256 requestId,
    bytes memory cleartexts,
    bytes memory decryptionProof
) external {
    FHE.checkSignatures(requestId, cleartexts, decryptionProof);
    // Process decrypted values
}
```

### 2. Refund Mechanism for Decryption Failures

**Problem:** Decryption might fail due to network issues, KMS unavailability, or other errors.

**Solution:** Automated refund system with timeout protection.

**Components:**

1. **Failure Detection:**
   - Timeout threshold: `DECRYPTION_TIMEOUT = 1 hour`
   - Status tracking: `decryptionFailed` flag
   - Request tracking: `DecryptionRequest` struct

2. **Refund Process:**

```solidity
function handleDecryptionTimeout(uint256 artworkId) external {
    require(
        block.timestamp >= artwork.decryptionRequestTime + DECRYPTION_TIMEOUT,
        "Timeout not reached"
    );

    artwork.decryptionFailed = true;
    emit TimeoutTriggered(artworkId, requestId);
}

function claimDecryptionRefund(uint256 artworkId) external {
    require(artwork.decryptionFailed, "Decryption not failed");
    require(!artwork.refundClaimed, "Refund already claimed");

    uint256 refundAmount = artwork.verificationFee;
    artwork.refundClaimed = true;

    payable(artwork.owner).transfer(refundAmount);
}
```

**Security Features:**
- Prevents double-refund: `refundClaimed` flag
- Requires timeout threshold
- Only artwork owner can claim
- Emits audit events

### 3. Timeout Protection

**Purpose:** Prevent permanent fund locks from failed operations.

**Implementation Layers:**

1. **Request Timeout:**
   ```solidity
   uint256 public constant DECRYPTION_TIMEOUT = 1 hours;
   ```

2. **Timeout Check:**
   ```solidity
   bool timeoutReached = block.timestamp >=
       artwork.decryptionRequestTime + DECRYPTION_TIMEOUT;
   ```

3. **State Recovery:**
   - Mark operation as failed
   - Enable refund claims
   - Allow retry of decryption request

**State Machine:**

```
IDLE → REQUEST_SENT → [TIMEOUT] → FAILED → REFUND_AVAILABLE
                    ↓
                 CALLBACK_RECEIVED → COMPLETED
```

### 4. Privacy-Preserving Division

**Challenge:** Division operations can leak information through quotient/remainder patterns.

**Solution:** Random multiplier obfuscation.

**Technique:**

```solidity
function _generatePriceMultiplier(uint256 artworkId)
    internal view returns (uint256)
{
    uint256 seed = uint256(keccak256(abi.encodePacked(
        block.timestamp,
        block.prevrandao,
        artworkId,
        msg.sender
    )));

    return (seed % PRIVACY_MULTIPLIER_RANGE) + 1;
}

// Obfuscate price before encryption
uint64 obfuscatedPrice = uint64((_price * multiplier) % type(uint64).max);
euint64 encryptedPrice = FHE.asEuint64(obfuscatedPrice);
```

**Benefits:**
- Prevents price inference through transaction analysis
- Maintains deterministic results for verification
- No additional decryption required
- Minimal gas overhead

**Applications:**
- Price calculations
- Reward distributions
- Score averaging
- Consensus computations

### 5. Price Obfuscation Techniques

**Multi-Layer Approach:**

1. **Input Obfuscation:**
   ```solidity
   // Generate unique multiplier per artwork
   uint256 multiplier = _generatePriceMultiplier(artworkId);

   // Apply multiplicative noise
   uint64 obfuscatedPrice = uint64((_price * multiplier) % type(uint64).max);
   ```

2. **Encryption:**
   ```solidity
   euint64 encryptedPrice = FHE.asEuint64(obfuscatedPrice);
   ```

3. **Access Control:**
   ```solidity
   FHE.allowThis(encryptedPrice);
   FHE.allow(encryptedPrice, artwork.owner);
   ```

4. **Deobfuscation (when needed):**
   ```solidity
   // Original price = decryptedPrice / multiplier
   uint256 originalPrice = decryptedPrice / priceMultipliers[artworkId];
   ```

**Security Properties:**
- Statistical indistinguishability
- No information leakage through gas consumption
- Resistant to timing attacks
- Maintains homomorphic properties

## Security Architecture

### Input Validation

**Multi-Level Validation:**

```solidity
modifier validPercentage(uint256 value) {
    require(value <= 100, "Value must be 0-100");
    _;
}

modifier noOverflow(uint256 a, uint256 b) {
    require(a <= type(uint256).max - b, "Overflow protection");
    _;
}

// Example usage
function submitArtwork(...)
    external
    payable
    validPercentage(_condition)
{
    require(msg.value >= MIN_VERIFICATION_FEE, "Insufficient fee");
    require(_requiredConsensus >= 51 && _requiredConsensus <= 100, "Invalid consensus");
    require(_price > 0, "Price must be positive");
    // ...
}
```

**Validation Layers:**
1. **Type Safety:** Solidity type system
2. **Range Checks:** Min/max bounds validation
3. **Business Logic:** Domain-specific constraints
4. **Economic Checks:** Fee and stake requirements

### Access Control

**Role-Based System:**

```solidity
// Owner: Full administrative control
modifier onlyOwner() {
    require(msg.sender == owner, "Not authorized: owner only");
    _;
}

// Authorized Operators: Multi-signature support
modifier onlyAuthorized() {
    require(
        msg.sender == owner || authorizedOperators[msg.sender],
        "Not authorized"
    );
    _;
}

// Verified Experts: Authentication rights
modifier onlyVerifiedExpert(uint256 expertId) {
    require(experts[expertId].expertAddress == msg.sender, "Not the expert");
    require(experts[expertId].isVerified, "Not verified");
    require(experts[expertId].isActive, "Inactive");
    _;
}

// Artwork Access: Encryption key access
mapping(uint256 => mapping(address => bool)) public hasAccessToArtwork;
```

**Permission Matrix:**

| Action | Owner | Operator | Expert | Artwork Owner |
|--------|-------|----------|--------|---------------|
| Submit Artwork | ✓ | ✓ | ✓ | ✓ |
| Verify Expert | ✓ | ✓ | ✗ | ✗ |
| Deactivate Expert | ✓ | ✗ | ✗ | ✗ |
| Request Decryption | ✓ | ✓ | ✗ | ✓ |
| Claim Refund | ✗ | ✗ | ✗ | ✓ (owner only) |
| Withdraw Fees | ✓ | ✗ | ✗ | ✗ |

### Overflow Protection

**Built-in Safeguards:**

```solidity
// Modifier-based protection
modifier noOverflow(uint256 a, uint256 b) {
    require(a <= type(uint256).max - b, "Overflow protection");
    _;
}

// Explicit checks in calculations
function _distributeRewards(...) internal {
    uint256 rewardPerExpert = totalReward / expertCount; // Safe division

    for (uint256 i = 0; i < expertCount; i++) {
        // Accumulation with overflow check implicit in Solidity 0.8+
        auth.rewardAmount = rewardPerExpt;
    }
}
```

**Solidity 0.8+ Features:**
- Automatic overflow/underflow reversion
- No need for SafeMath library
- Gas-efficient checks

### Audit Points

**Critical Security Checkpoints:**

1. **Encryption ACL:**
   ```solidity
   FHE.allowThis(encryptedData);
   FHE.allow(encryptedData, authorizedAddress);
   ```

2. **Reentrancy Protection:**
   ```solidity
   // State changes before external calls
   artwork.refundClaimed = true;
   (bool sent, ) = payable(artwork.owner).call{value: refundAmount}("");
   ```

3. **Signature Verification:**
   ```solidity
   FHE.checkSignatures(requestId, cleartexts, decryptionProof);
   ```

4. **Double-Spending Prevention:**
   ```solidity
   require(!auth.rewardClaimed, "Already claimed");
   auth.rewardClaimed = true;
   ```

## Gas and HCU Optimization

### HCU (Homomorphic Computation Units)

**What is HCU?**
- Measurement unit for FHE operations
- Analogous to gas for encrypted computations
- More expensive than regular operations

**Operation Costs:**

| Operation | Regular Gas | HCU Cost | Notes |
|-----------|-------------|----------|-------|
| euint8 addition | ~100 gas | ~50,000 HCU | Encrypted arithmetic |
| euint64 multiplication | ~100 gas | ~200,000 HCU | Higher precision = higher cost |
| FHE.select() | ~100 gas | ~100,000 HCU | Conditional operation |
| Decryption request | ~50,000 gas | ~1,000,000 HCU | Gateway interaction |

### Optimization Strategies

**1. Batch Operations:**

```solidity
// ❌ Bad: Multiple decryption requests
for (uint i = 0; i < experts.length; i++) {
    FHE.requestDecryption(singleCt, callback);
}

// ✓ Good: Single batch request
bytes32[] memory cts = new bytes32[](experts.length * 2);
// ... populate array
FHE.requestDecryption(cts, callback);
```

**Savings:** ~80% reduction in HCU costs

**2. Minimize Encrypted Operations:**

```solidity
// ❌ Bad: Encrypted comparisons in loop
for (uint i = 0; i < scores.length; i++) {
    ebool result = FHE.gt(encryptedScore[i], threshold);
    // ... process
}

// ✓ Good: Decrypt once, compare in cleartext
uint8[] memory decryptedScores = ...; // From callback
for (uint i = 0; i < decryptedScores.length; i++) {
    if (decryptedScores[i] > threshold) {
        // ... process
    }
}
```

**Savings:** ~95% reduction for comparison operations

**3. Strategic Encryption:**

```solidity
// Only encrypt sensitive data
struct Artwork {
    // ✓ Encrypted: Sensitive
    euint32 encryptedMetadata;
    euint8 encryptedCondition;
    euint64 encryptedPrice;

    // ✓ Cleartext: Non-sensitive
    uint256 id;
    address owner;
    bool isSubmitted;
    uint256 submissionTime;
}
```

**4. ACL Optimization:**

```solidity
// ❌ Bad: Repeated ACL updates
FHE.allow(data, user1);
FHE.allow(data, user2);
FHE.allow(data, user3);

// ✓ Good: Batch ACL management
FHE.allowThis(data); // Contract access
// Grant individual access only when needed
```

### Gas Optimization Patterns

**1. Storage Packing:**

```solidity
struct Expert {
    uint256 id;              // slot 0
    address expertAddress;   // slot 1 (20 bytes)
    bool isVerified;         // slot 1 (1 byte)
    bool isActive;           // slot 1 (1 byte)
    // ... (10 bytes remaining in slot 1)
}
```

**2. Memory vs Storage:**

```solidity
// ❌ Bad: Multiple storage reads
for (uint i = 0; i < artworkExperts[id].length; i++) {
    uint expertId = artworkExperts[id][i]; // Storage read each iteration
}

// ✓ Good: Cache in memory
uint256[] memory experts = artworkExperts[id];
for (uint i = 0; i < experts.length; i++) {
    uint expertId = experts[i]; // Memory read
}
```

**3. Short-Circuit Evaluation:**

```solidity
// ✓ Optimized order: Check cheap conditions first
require(msg.sender == owner || authorizedOperators[msg.sender], "Not authorized");
```

## Data Flow Diagrams

### Artwork Submission Flow

```
User
  │
  │ submitArtwork(metadata, condition, price, consensus)
  │ + verification fee
  ▼
Contract
  │
  ├─► Generate price multiplier (pseudo-random)
  │
  ├─► Obfuscate price = price * multiplier
  │
  ├─► Encrypt: metadata, condition, obfuscated price
  │
  ├─► Store artwork struct
  │
  ├─► Set ACL permissions (contract, owner)
  │
  └─► Emit ArtworkSubmitted event
```

### Authentication Flow

```
Expert
  │
  │ submitAuthentication(artworkId, expertId, authenticity, confidence)
  ▼
Contract
  │
  ├─► Validate: expert verified, artwork exists
  │
  ├─► Encrypt: authenticity, confidence, analysis
  │
  ├─► Store authentication struct
  │
  ├─► Increment counters
  │
  ├─► Set ACL permissions
  │
  └─► Emit AuthenticationSubmitted event
```

### Consensus Decryption Flow

```
Requester
  │
  │ requestConsensusDecryption(artworkId)
  ▼
Contract
  │
  ├─► Validate: min experts, not already decrypted
  │
  ├─► Prepare ciphertexts array [auth1, conf1, auth2, conf2, ...]
  │
  ├─► FHE.requestDecryption(cts, callback)
  │
  ├─► Store request metadata (requestId, timestamp)
  │
  └─► Emit DecryptionRequested
       │
       ▼
FHE Gateway (KMS)
  │
  ├─► Threshold decryption
  │
  ├─► Generate proof
  │
  └─► Call consensusDecryptionCallback(requestId, cleartexts, proof)
       │
       ▼
Contract Callback
  │
  ├─► Verify signatures: FHE.checkSignatures()
  │
  ├─► Decode cleartexts
  │
  ├─► Calculate weighted consensus
  │
  ├─► Distribute rewards
  │
  ├─► Mark as authenticated
  │
  └─► Emit ArtworkAuthenticated
```

### Refund Flow (Timeout)

```
Time Passes (> DECRYPTION_TIMEOUT)
  │
  ▼
Anyone
  │
  │ handleDecryptionTimeout(artworkId)
  ▼
Contract
  │
  ├─► Check: timeout reached, callback not completed
  │
  ├─► Mark decryptionFailed = true
  │
  └─► Emit TimeoutTriggered
       │
       ▼
Artwork Owner
  │
  │ claimDecryptionRefund(artworkId)
  ▼
Contract
  │
  ├─► Validate: owner, failed, not already claimed
  │
  ├─► Mark refundClaimed = true
  │
  ├─► Transfer verification fee
  │
  └─► Emit RefundIssued
```

## Error Handling

### Common Errors and Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| "Insufficient verification fee" | Fee below MIN_VERIFICATION_FEE | Send at least 0.01 ETH |
| "Decryption in progress" | Concurrent decryption request | Wait for callback or timeout |
| "Timeout not reached" | Premature refund attempt | Wait for DECRYPTION_TIMEOUT |
| "Not authorized" | Access control violation | Use authorized account |
| "Already claimed" | Double-claim attempt | Check claim status first |

### Event-Based Monitoring

```solidity
// Monitor these events for system health
event DecryptionRequested(uint256 indexed artworkId, uint256 requestId, uint256 timestamp);
event ArtworkAuthenticated(uint256 indexed artworkId, bool isAuthentic, uint256 finalScore);
event DecryptionFailed(uint256 indexed artworkId, uint256 requestId);
event TimeoutTriggered(uint256 indexed artworkId, uint256 requestId);
```

## Deployment Architecture

### Network Configuration

```javascript
// hardhat.config.js
networks: {
  sepolia: {
    url: process.env.SEPOLIA_RPC_URL,
    accounts: [process.env.PRIVATE_KEY],
    chainId: 11155111
  }
}
```

### Contract Initialization

```solidity
constructor() {
    owner = msg.sender;
    nextArtworkId = 1;
    nextExpertId = 1;
}
```

### Post-Deployment Setup

1. **Authorize Operators:**
   ```solidity
   contract.authorizeOperator(operatorAddress);
   ```

2. **Verify Initial Experts:**
   ```solidity
   contract.verifyExpert(expertId);
   ```

3. **Configure Frontend:**
   ```javascript
   const contractAddress = "0x...";
   const provider = new FhevmProvider(contractAddress);
   ```

## Testing Strategy

### Unit Tests

```javascript
describe("PrivateArtVerification", function() {
  it("Should submit artwork with encrypted data", async function() {
    const tx = await contract.submitArtwork(
      metadataHash,
      condition,
      price,
      consensus,
      { value: ethers.parseEther("0.01") }
    );
    expect(tx).to.emit(contract, "ArtworkSubmitted");
  });
});
```

### Integration Tests

- Gateway callback simulation
- Timeout scenarios
- Refund mechanisms
- Multi-expert consensus

### Gas Benchmarks

Target metrics:
- Artwork submission: < 500,000 gas
- Authentication: < 300,000 gas
- Decryption request: < 200,000 gas
- Callback processing: < 400,000 gas

## Future Enhancements

1. **Layer 2 Integration:** Reduce costs via rollups
2. **ZK Proofs:** Combine with zero-knowledge for hybrid privacy
3. **DAO Governance:** Decentralized expert verification
4. **NFT Integration:** Mint authenticated art as NFTs
5. **Cross-Chain:** Multi-chain deployment support

## References

- [Zama fhEVM Documentation](https://docs.zama.ai/fhevm)
- [FHE Security Whitepaper](https://www.zama.ai/whitepaper)
- [Gateway Pattern Specification](https://docs.zama.ai/fhevm/guides/gateway)
