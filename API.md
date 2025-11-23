# Private Art Verification - API Documentation

## Contract Overview

**Contract Name:** `PrivateArtVerification`
**Solidity Version:** `^0.8.24`
**License:** BSD-3-Clause-Clear
**Network:** Sepolia Testnet (fhEVM)

## Constants

| Constant | Value | Description |
|----------|-------|-------------|
| `MIN_VERIFICATION_FEE` | 0.01 ether | Minimum fee for artwork submission |
| `MIN_EXPERT_STAKE` | 0.005 ether | Minimum stake for expert registration |
| `DECRYPTION_TIMEOUT` | 1 hour | Timeout for Gateway decryption |
| `MAX_EXPERTS_PER_ARTWORK` | 10 | Maximum experts per artwork |
| `MIN_EXPERTS_FOR_CONSENSUS` | 3 | Minimum experts for consensus |
| `PLATFORM_FEE_PERCENT` | 2% | Platform fee percentage |
| `PRIVACY_MULTIPLIER_RANGE` | 1000 | Range for price obfuscation |

---

## Write Functions

### submitArtwork

Submit artwork for anonymous authentication with encrypted metadata.

```solidity
function submitArtwork(
    uint32 _metadataHash,
    uint8 _condition,
    uint64 _price,
    uint256 _requiredConsensus
) external payable returns (uint256 artworkId)
```

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| `_metadataHash` | uint32 | Hash of artwork metadata (age, style, materials) |
| `_condition` | uint8 | Condition score (0-100) |
| `_price` | uint64 | Artwork price (will be obfuscated) |
| `_requiredConsensus` | uint256 | Required expert consensus percentage (51-100) |

**Requirements:**
- `msg.value >= MIN_VERIFICATION_FEE` (0.01 ether)
- `_condition <= 100`
- `_requiredConsensus >= 51 && _requiredConsensus <= 100`
- `_price > 0`

**Returns:** `artworkId` - Unique identifier for the submitted artwork

**Events:**
```solidity
event ArtworkSubmitted(uint256 indexed artworkId, address indexed owner, uint256 verificationFee);
event AccessGranted(uint256 indexed artworkId, address indexed user);
```

**Example:**
```javascript
const tx = await contract.submitArtwork(
    0x12345678,  // metadataHash
    85,          // condition (85%)
    1000000,     // price
    75,          // requiredConsensus (75%)
    { value: ethers.parseEther("0.02") }
);
const receipt = await tx.wait();
const artworkId = receipt.events[0].args.artworkId;
```

---

### registerExpert

Register as an authentication expert with encrypted credentials.

```solidity
function registerExpert(
    uint8 _credentialsHash,
    uint32 _initialReputation
) external payable returns (uint256 expertId)
```

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| `_credentialsHash` | uint8 | Hash representing expertise level (0-100) |
| `_initialReputation` | uint32 | Initial reputation score (0-10000) |

**Requirements:**
- `msg.value >= MIN_EXPERT_STAKE` (0.005 ether)
- `_credentialsHash <= 100`
- `_initialReputation <= 10000`

**Returns:** `expertId` - Unique identifier for the registered expert

**Events:**
```solidity
event ExpertRegistered(uint256 indexed expertId, address indexed expert, uint256 stakedAmount);
```

**Example:**
```javascript
const tx = await contract.registerExpert(
    90,     // credentialsHash (expertise level)
    5000,   // initialReputation
    { value: ethers.parseEther("0.01") }
);
```

---

### verifyExpert

Verify expert credentials (admin/operator only).

```solidity
function verifyExpert(uint256 expertId) external
```

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| `expertId` | uint256 | The expert ID to verify |

**Requirements:**
- Caller must be `owner` or authorized operator
- Expert must exist
- Expert must not already be verified

**Events:**
```solidity
event ExpertVerified(uint256 indexed expertId, address indexed expert);
```

---

### submitAuthentication

Expert submits anonymous authentication for artwork.

```solidity
function submitAuthentication(
    uint256 artworkId,
    uint256 expertId,
    uint8 _authenticity,
    uint8 _confidence,
    uint32 _analysisHash
) external
```

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| `artworkId` | uint256 | The artwork to authenticate |
| `expertId` | uint256 | The expert's ID |
| `_authenticity` | uint8 | Authenticity score (0-100) |
| `_confidence` | uint8 | Confidence level (0-100) |
| `_analysisHash` | uint32 | Hash of detailed analysis |

**Requirements:**
- Caller must be the registered expert
- Expert must be verified and active
- Artwork must exist and not be authenticated
- Expert must not have already submitted
- Max experts not reached

**Events:**
```solidity
event AuthenticationSubmitted(uint256 indexed artworkId, uint256 indexed expertId);
```

**Example:**
```javascript
const tx = await contract.submitAuthentication(
    1,          // artworkId
    1,          // expertId
    92,         // authenticity score
    88,         // confidence level
    0xABCDEF12  // analysisHash
);
```

---

### requestConsensusDecryption

Request Gateway decryption for consensus calculation.

```solidity
function requestConsensusDecryption(uint256 artworkId) external
```

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| `artworkId` | uint256 | The artwork to finalize |

**Requirements:**
- Caller must be artwork owner, contract owner, or authorized operator
- Artwork must not be already authenticated
- At least `MIN_EXPERTS_FOR_CONSENSUS` (3) authentications required
- No pending decryption request (or previous failed)

**Events:**
```solidity
event DecryptionRequested(uint256 indexed artworkId, uint256 requestId, uint256 timestamp);
```

**Gateway Callback:**
After decryption completes, the Gateway will call:
```solidity
function consensusDecryptionCallback(
    uint256 requestId,
    bytes memory cleartexts,
    bytes memory decryptionProof
) external
```

**Example:**
```javascript
const tx = await contract.requestConsensusDecryption(artworkId);
const receipt = await tx.wait();
const requestId = receipt.events[0].args.requestId;

// Wait for callback event
contract.on("ArtworkAuthenticated", (artworkId, isAuthentic, finalScore) => {
    console.log(`Artwork ${artworkId}: ${isAuthentic ? 'Authentic' : 'Not Authentic'} (Score: ${finalScore})`);
});
```

---

### handleDecryptionTimeout

Handle decryption timeout and enable refunds.

```solidity
function handleDecryptionTimeout(uint256 artworkId) external
```

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| `artworkId` | uint256 | The artwork with timeout |

**Requirements:**
- Decryption must have been requested
- Callback must not have been completed
- `DECRYPTION_TIMEOUT` (1 hour) must have passed

**Events:**
```solidity
event TimeoutTriggered(uint256 indexed artworkId, uint256 requestId);
event DecryptionFailed(uint256 indexed artworkId, uint256 requestId);
```

**Example:**
```javascript
// Check if timeout reached
const status = await contract.getDecryptionStatus(artworkId);
if (status.timeoutReached && !status.completed) {
    await contract.handleDecryptionTimeout(artworkId);
}
```

---

### claimDecryptionRefund

Claim refund for failed decryption.

```solidity
function claimDecryptionRefund(uint256 artworkId) external
```

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| `artworkId` | uint256 | The artwork to claim refund for |

**Requirements:**
- Caller must be artwork owner
- Decryption must have failed
- Refund must not have been already claimed
- Artwork must not be authenticated

**Events:**
```solidity
event RefundIssued(uint256 indexed artworkId, address indexed recipient, uint256 amount);
```

**Example:**
```javascript
// After timeout has been triggered
const tx = await contract.claimDecryptionRefund(artworkId);
const receipt = await tx.wait();
const refundAmount = receipt.events[0].args.amount;
```

---

### claimAuthenticationReward

Expert claims authentication reward after artwork finalization.

```solidity
function claimAuthenticationReward(uint256 artworkId, uint256 expertId) external
```

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| `artworkId` | uint256 | The artwork ID |
| `expertId` | uint256 | The expert ID |

**Requirements:**
- Authentication must have been submitted
- Caller must be the expert
- Reward must not have been claimed
- Reward amount must be > 0
- Artwork must be authenticated

**Events:**
```solidity
event RewardDistributed(uint256 indexed artworkId, uint256 indexed expertId, uint256 amount);
```

---

### grantArtworkAccess

Grant access to encrypted artwork data.

```solidity
function grantArtworkAccess(uint256 artworkId, address user) external
```

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| `artworkId` | uint256 | The artwork ID |
| `user` | address | Address to grant access |

**Requirements:**
- Caller must be artwork owner or contract owner
- Artwork must exist

**Events:**
```solidity
event AccessGranted(uint256 indexed artworkId, address indexed user);
```

---

## Admin Functions

### authorizeOperator

Authorize operator for multi-signature control.

```solidity
function authorizeOperator(address operator) external
```

**Requirements:** Owner only

**Events:**
```solidity
event OperatorAuthorized(address indexed operator);
```

---

### revokeOperator

Revoke operator authorization.

```solidity
function revokeOperator(address operator) external
```

**Requirements:** Owner only

**Events:**
```solidity
event OperatorRevoked(address indexed operator);
```

---

### deactivateExpert

Deactivate expert (security measure).

```solidity
function deactivateExpert(uint256 expertId) external
```

**Requirements:** Owner only

**Events:**
```solidity
event ExpertDeactivated(uint256 indexed expertId, address indexed expert);
```

---

### withdrawPlatformFees

Withdraw accumulated platform fees.

```solidity
function withdrawPlatformFees(address to) external
```

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| `to` | address | Recipient address |

**Requirements:**
- Owner only
- `to != address(0)`
- `platformFees > 0`

**Events:**
```solidity
event PlatformFeesWithdrawn(address indexed to, uint256 amount);
```

---

## Read Functions

### getArtworkInfo

Get artwork public information.

```solidity
function getArtworkInfo(uint256 artworkId) external view returns (
    address artworkOwner,
    bool isSubmitted,
    bool isAuthenticated,
    uint256 submissionTime,
    uint256 authenticationCount,
    uint256 expertConsensus,
    uint256 verificationFee,
    bool decryptionFailed
)
```

**Example:**
```javascript
const info = await contract.getArtworkInfo(artworkId);
console.log({
    owner: info.artworkOwner,
    submitted: info.isSubmitted,
    authenticated: info.isAuthenticated,
    expertCount: info.authenticationCount.toString(),
    consensus: info.expertConsensus.toString()
});
```

---

### getExpertInfo

Get expert public information.

```solidity
function getExpertInfo(uint256 expertId) external view returns (
    address expertAddress,
    bool isVerified,
    bool isActive,
    uint256 authenticationsCompleted,
    uint256 successRate,
    uint256 stakedAmount
)
```

---

### getDecryptionStatus

Get decryption request status.

```solidity
function getDecryptionStatus(uint256 artworkId) external view returns (
    uint256 requestId,
    uint256 requestTime,
    bool completed,
    bool failed,
    bool timeoutReached
)
```

**Example:**
```javascript
const status = await contract.getDecryptionStatus(artworkId);
if (status.timeoutReached && !status.completed) {
    console.log("Decryption timed out - refund available");
}
```

---

### getArtworkExperts

Get experts assigned to artwork.

```solidity
function getArtworkExperts(uint256 artworkId) external view returns (uint256[] memory)
```

---

### checkArtworkAccess

Check if user has access to artwork.

```solidity
function checkArtworkAccess(uint256 artworkId, address user) external view returns (bool)
```

---

### getRewardStatus

Get authentication reward status.

```solidity
function getRewardStatus(uint256 artworkId, uint256 expertId) external view returns (
    uint256 rewardAmount,
    bool claimed
)
```

---

## Events Reference

### Core Events

```solidity
event ArtworkSubmitted(uint256 indexed artworkId, address indexed owner, uint256 verificationFee);
event ExpertRegistered(uint256 indexed expertId, address indexed expert, uint256 stakedAmount);
event ExpertVerified(uint256 indexed expertId, address indexed expert);
event ExpertDeactivated(uint256 indexed expertId, address indexed expert);
event AuthenticationSubmitted(uint256 indexed artworkId, uint256 indexed expertId);
event ArtworkAuthenticated(uint256 indexed artworkId, bool isAuthentic, uint256 finalScore);
```

### Gateway Events

```solidity
event DecryptionRequested(uint256 indexed artworkId, uint256 requestId, uint256 timestamp);
event DecryptionFailed(uint256 indexed artworkId, uint256 requestId);
event TimeoutTriggered(uint256 indexed artworkId, uint256 requestId);
```

### Financial Events

```solidity
event RefundIssued(uint256 indexed artworkId, address indexed recipient, uint256 amount);
event RewardDistributed(uint256 indexed artworkId, uint256 indexed expertId, uint256 amount);
event PlatformFeesWithdrawn(address indexed to, uint256 amount);
```

### Access Control Events

```solidity
event AccessGranted(uint256 indexed artworkId, address indexed user);
event OperatorAuthorized(address indexed operator);
event OperatorRevoked(address indexed operator);
```

---

## Error Messages

| Error | Condition |
|-------|-----------|
| "Not authorized: owner only" | Function requires owner |
| "Not authorized" | Function requires owner or operator |
| "Not the registered expert" | Caller is not the expert |
| "Expert not verified" | Expert verification required |
| "Expert is inactive" | Expert has been deactivated |
| "Artwork does not exist" | Invalid artwork ID |
| "Value must be 0-100" | Percentage out of range |
| "Overflow protection" | Arithmetic overflow detected |
| "Insufficient verification fee" | Fee below minimum |
| "Consensus must be 51-100%" | Invalid consensus percentage |
| "Price must be greater than 0" | Zero price not allowed |
| "Insufficient stake amount" | Stake below minimum |
| "Expert already verified" | Duplicate verification attempt |
| "Artwork already authenticated" | Already finalized |
| "Max experts reached" | Expert limit exceeded |
| "Authentication already submitted" | Duplicate submission |
| "Decryption in progress" | Concurrent decryption blocked |
| "Insufficient authentications" | Not enough experts |
| "Decryption already requested" | Duplicate request |
| "Invalid request ID" | Unknown decryption request |
| "Callback already processed" | Duplicate callback |
| "Timeout not reached" | Premature timeout claim |
| "No decryption requested" | No pending request |
| "Decryption not failed" | Refund not available |
| "Refund already claimed" | Duplicate refund claim |
| "Not artwork owner" | Owner permission required |
| "No refund available" | Zero refund amount |
| "Authentication not submitted" | Invalid authentication |
| "Reward already claimed" | Duplicate reward claim |
| "No reward available" | Zero reward amount |
| "Artwork not authenticated yet" | Pending authentication |
| "Invalid operator address" | Zero address operator |
| "Invalid recipient" | Zero address recipient |
| "No fees to withdraw" | Zero platform fees |

---

## Integration Examples

### Complete Workflow

```javascript
const { ethers } = require("ethers");

// 1. Connect to contract
const contract = new ethers.Contract(contractAddress, abi, signer);

// 2. Submit artwork
const submitTx = await contract.submitArtwork(
    0x12345678,  // metadataHash
    85,          // condition
    1000000,     // price
    75,          // consensus
    { value: ethers.parseEther("0.02") }
);
const submitReceipt = await submitTx.wait();
const artworkId = submitReceipt.events[0].args.artworkId;

// 3. Register expert
const registerTx = await contract.registerExpert(
    90,    // credentialsHash
    5000,  // initialReputation
    { value: ethers.parseEther("0.01") }
);
const registerReceipt = await registerTx.wait();
const expertId = registerReceipt.events[0].args.expertId;

// 4. Verify expert (admin)
await contract.connect(owner).verifyExpert(expertId);

// 5. Submit authentication
await contract.submitAuthentication(artworkId, expertId, 92, 88, 0xABCDEF12);

// 6. Request decryption (after 3+ authentications)
const decryptTx = await contract.requestConsensusDecryption(artworkId);

// 7. Listen for result
contract.on("ArtworkAuthenticated", (id, isAuthentic, score) => {
    console.log(`Artwork ${id}: ${isAuthentic} (Score: ${score})`);
});

// 8. Claim reward
await contract.claimAuthenticationReward(artworkId, expertId);
```

### Timeout Handling

```javascript
// Monitor for timeout
const status = await contract.getDecryptionStatus(artworkId);

if (status.timeoutReached && !status.completed && !status.failed) {
    // Trigger timeout
    await contract.handleDecryptionTimeout(artworkId);

    // Claim refund (as artwork owner)
    await contract.connect(artworkOwner).claimDecryptionRefund(artworkId);
}
```

### Event Monitoring

```javascript
// Setup event listeners
contract.on("ArtworkSubmitted", (artworkId, owner, fee) => {
    console.log(`New artwork #${artworkId} from ${owner}`);
});

contract.on("DecryptionRequested", (artworkId, requestId, timestamp) => {
    console.log(`Decryption requested for artwork #${artworkId}`);
    // Set timer for timeout monitoring
    setTimeout(async () => {
        const status = await contract.getDecryptionStatus(artworkId);
        if (!status.completed) {
            console.log(`Artwork #${artworkId} decryption may have timed out`);
        }
    }, 3600000); // 1 hour
});

contract.on("ArtworkAuthenticated", (artworkId, isAuthentic, finalScore) => {
    console.log(`Artwork #${artworkId}: ${isAuthentic ? 'AUTHENTIC' : 'NOT AUTHENTIC'}`);
    console.log(`Final Score: ${finalScore}`);
});
```

---

## Gas Estimates

| Function | Estimated Gas |
|----------|---------------|
| `submitArtwork` | ~450,000 |
| `registerExpert` | ~300,000 |
| `verifyExpert` | ~50,000 |
| `submitAuthentication` | ~350,000 |
| `requestConsensusDecryption` | ~200,000 |
| `consensusDecryptionCallback` | ~400,000 |
| `handleDecryptionTimeout` | ~80,000 |
| `claimDecryptionRefund` | ~60,000 |
| `claimAuthenticationReward` | ~70,000 |
| `grantArtworkAccess` | ~100,000 |

**Note:** Actual gas costs may vary based on network conditions and contract state.
