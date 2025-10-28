# 🎨 Anonymous Art Authentication

> Privacy-preserving artwork authentication using Zama FHEVM - Eliminating bias in art verification through Fully Homomorphic Encryption

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![fhEVM](https://img.shields.io/badge/fhEVM-v0.8.0-blue)](https://docs.zama.ai/fhevm)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.24-green)](https://soliditylang.org/)
[![Tests](https://img.shields.io/badge/tests-67%20passing-brightgreen)](./TESTING.md)
[![Coverage](https://img.shields.io/badge/coverage-95%25-brightgreen)](./TESTING.md)
[![Hardhat](https://img.shields.io/badge/Hardhat-v2.19-orange)](https://hardhat.org/)

---

## 🌐 Live Demo

**Try it now**: [https://terencemayer.github.io/FHEAnonymousArtAuthentication/](https://terencemayer.github.io/FHEAnonymousArtAuthentication/)

**Smart Contract**: [View on Sepolia Etherscan](https://sepolia.etherscan.io/address/0x4D874585f820437656554590C812b672305fbb72)

**Video Demo**: [Watch Full Demonstration](./demo.mp4)

---

## ✨ Features

- 🔐 **Privacy-Preserving Authentication** - Experts evaluate artworks without knowing artist identity or value
- 🎯 **Bias-Free Evaluation** - Encrypted metadata ensures objective, technical assessment
- 📝 **Immutable Records** - All authentication results permanently stored on blockchain
- ✅ **Expert Verification System** - Admin-approved experts with reputation tracking
- 🔒 **FHE Encryption** - Fully Homomorphic Encryption using Zama FHEVM v0.8.0
- 🌐 **Decentralized Platform** - No single point of failure or control
- 📊 **Consensus Mechanism** - Multiple expert agreement required for finalization
- 🏆 **Reputation System** - Track expert accuracy and success rates

---

## 🚀 Quick Start

### Prerequisites

```bash
node >= 18.0.0
npm >= 9.0.0
MetaMask browser extension
```

### Installation

```bash
# Clone repository
git clone https://github.com/TerenceMayer/FHEAnonymousArtAuthentication.git
cd FHEAnonymousArtAuthentication

# Install dependencies
npm install

# Configure environment
cp env.example .env
# Edit .env with your settings

# Compile contracts
npm run compile

# Run tests
npm test
```

### Deploy to Sepolia

```bash
# Get testnet ETH from faucet
# https://sepoliafaucet.com/

# Deploy contract
npm run deploy

# Verify on Etherscan
npm run verify
```

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (HTML/JS)                      │
│  ├── MetaMask wallet integration                            │
│  ├── Web3 interaction via ethers.js                         │
│  └── Real-time encrypted data display                       │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                  Smart Contract (Solidity)                  │
│  ├── Encrypted storage (euint32, euint8)                    │
│  ├── FHE operations (TFHE library)                          │
│  ├── Access control (owner, experts, users)                 │
│  └── Consensus mechanism                                    │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                      Zama FHEVM Layer                       │
│  ├── Encrypted computation layer                            │
│  ├── Automatic re-randomization (sIND-CPAD)                 │
│  └── Sepolia testnet deployment                             │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

```
Artwork Submission
      ↓
Encrypted Metadata (FHE)
      ↓
Expert Registration & Verification
      ↓
Anonymous Authentication
      ↓
Consensus Calculation
      ↓
Finalization & Results
```

---

## 🔧 Technical Implementation

### FHEVM Integration

Built with **Zama FHEVM v0.8.0** for privacy-preserving computation:

```solidity
import "@fhevm/solidity/contracts/FHE.sol";

// Encrypted data types
euint32 public encryptedMetadata;  // Artwork metadata hash
euint8 public encryptedCondition;  // Physical condition (0-100)
euint8 public encryptedAuthenticity;  // Authenticity score (0-100)

// Homomorphic operations
function submitArtwork(uint32 _metadataHash, uint8 _condition) external {
    // Encrypt sensitive data
    euint32 encMetadata = TFHE.asEuint32(_metadataHash);
    euint8 encCondition = TFHE.asEuint8(_condition);

    // Store encrypted
    artworks[artworkId].encryptedMetadata = encMetadata;
    artworks[artworkId].encryptedCondition = encCondition;

    // Set access permissions
    FHE.allowThis(encMetadata);
    FHE.allow(encMetadata, msg.sender);
}
```

### Smart Contract Architecture

**Core Functions:**

```solidity
// Artwork Management
function submitArtwork(uint32 _metadataHash, uint8 _condition, uint256 _requiredConsensus)
function getArtworkInfo(uint256 artworkId) view returns (ArtworkInfo)

// Expert Management
function registerExpert(uint8 _credentialsHash)
function verifyExpert(uint256 expertId) onlyOwner
function updateExpertSuccessRate(uint256 expertId, uint8 rate) onlyOwner

// Authentication Process
function submitAuthentication(uint256 artworkId, uint256 expertId, uint8 _authenticity, uint8 _confidence)
function finalizeAuthentication(uint256 artworkId, bool isAuthentic, uint256 finalScore) onlyOwner
```

**Access Control:**

```solidity
// Owner-only operations
modifier onlyOwner() {
    require(msg.sender == owner, "Not authorized");
    _;
}

// Expert verification check
require(experts[expertId].isVerified, "Expert not verified");
require(msg.sender == experts[expertId].expertAddress, "Not the expert");
```

---

## 🔐 Privacy Model

### What's Private

- ✅ **Artwork Metadata** - Artist name, title, provenance (encrypted as hash)
- ✅ **Physical Condition** - Encrypted condition scores
- ✅ **Authentication Scores** - Individual expert assessments (encrypted)
- ✅ **Confidence Levels** - Expert confidence ratings (encrypted)
- ✅ **Expert Credentials** - Professional qualifications (encrypted)

### What's Public

- 📊 **Transaction Existence** - Blockchain requirement, visible on-chain
- 📊 **Artwork Count** - Number of submissions
- 📊 **Expert Count** - Number of registered experts
- 📊 **Authentication Status** - Whether artwork is authenticated (yes/no)
- 📊 **Consensus Threshold** - Required expert agreement percentage

### Decryption Permissions

- **Artwork Owners**: Can decrypt their own artwork data
- **Experts**: Can decrypt artworks they're assigned to authenticate
- **Admin**: Can decrypt for finalization process
- **Contract**: Has permission to perform encrypted operations

---

## 📋 Usage Guide

### 1. Connect Wallet

```javascript
// Click "Connect Wallet" button
// Approve MetaMask connection
// Switch to Sepolia network if prompted
```

### 2. Submit Artwork (Owner)

```bash
# Fill in artwork details:
- Title (for your reference)
- Estimated age
- Art style
- Materials used
- Condition score (0-100)
- Required consensus (51-100%)

# Click "Submit for Authentication"
# Note the Artwork ID from transaction
```

### 3. Register as Expert

```bash
# Enter professional details:
- Full name
- Area of expertise
- Years of experience
- Professional credentials

# Click "Register as Expert"
# Wait for admin verification
```

### 4. Submit Authentication (Verified Expert)

```bash
# Enter Artwork ID and Expert ID
# Provide assessment:
  - Authenticity score (0-100)
  - Confidence level (0-100)
  - Optional private notes

# Click "Submit Authentication"
```

### 5. Finalize Authentication (Admin)

```bash
# Review all expert submissions
# Calculate consensus
# Click "Finalize Authentication"
# Provide final score and result
```

---

## 🌐 Deployment

### Network Information

| Parameter | Value |
|-----------|-------|
| **Network** | Ethereum Sepolia Testnet |
| **Chain ID** | 11155111 |
| **Contract** | `0x4D874585f820437656554590C812b672305fbb72` |
| **Deployer** | `0x95D116B6183B54Df922fE07865fE2A1CA99eDD52` |
| **Compiler** | Solidity 0.8.24 (200 runs) |
| **Verification** | ✅ [View on Etherscan](https://sepolia.etherscan.io/address/0x4D874585f820437656554590C812b672305fbb72) |

### Deployment Scripts

```bash
# Main deployment
npm run deploy

# Verify contract
npm run verify

# Interact with contract
npm run interact

# Run complete simulation
npm run simulate
```

**See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment guide.**

---

## 🧪 Testing

### Test Suite

**67 comprehensive test cases** covering:

- ✅ Contract deployment and initialization (5 tests)
- ✅ Artwork submission (10 tests)
- ✅ Expert registration (8 tests)
- ✅ Expert verification (6 tests)
- ✅ Authentication submission (13 tests)
- ✅ Authentication finalization (7 tests)
- ✅ Success rate updates (6 tests)
- ✅ View functions (5 tests)
- ✅ Complex scenarios (7 tests)

### Run Tests

```bash
# Run all tests
npm test

# Run with gas reporting
npm run test:gas

# Generate coverage report
npm run test:coverage
```

### Test Results

```bash
  AnonymousArtAuthentication
    ✓ Should set the right owner
    ✓ Should initialize nextArtworkId to 1
    ✓ Should allow artwork submission
    ✓ Should reject invalid inputs
    ... 63 more tests

  67 passing (15s)
```

**Coverage:** ~95% (statements, branches, functions, lines)

**See [TESTING.md](./TESTING.md) for detailed testing guide.**

---

## 🔄 CI/CD Pipeline

Automated testing and deployment using **GitHub Actions**:

- ✅ Multi-platform testing (Ubuntu & Windows)
- ✅ Multi-version Node.js (18.x & 20.x)
- ✅ Automated security audits
- ✅ Code quality checks (Solhint, ESLint, Prettier)
- ✅ Gas usage reporting
- ✅ Coverage reporting with Codecov

**See [CI_CD.md](./CI_CD.md) for pipeline documentation.**

---

## 🛡️ Security

### Security Features

- 🔒 **Access Control** - Owner-only admin functions
- 🔒 **Input Validation** - Range checks on all user inputs
- 🔒 **State Validation** - Existence and status checks
- 🔒 **DoS Protection** - Limited iterations, efficient operations
- 🔒 **Reentrancy Protection** - Checks-Effects-Interactions pattern
- 🔒 **FHE Encryption** - Automatic re-randomization (sIND-CPAD)

### Security Tools

```bash
# Run security audit
npm run security

# Run Solhint
npm run lint

# Check for vulnerabilities
npm audit
```

**See [SECURITY.md](./SECURITY.md) for security audit documentation.**

---

## ⚡ Performance

### Gas Optimization

| Operation | Gas Used |
|-----------|----------|
| Contract Deployment | ~1,500,000 |
| Submit Artwork | ~135,000 |
| Register Expert | ~90,000 |
| Verify Expert | ~50,000 |
| Submit Authentication | ~165,000 |
| Finalize Authentication | ~100,000 |

### Optimization Techniques

- ✅ Compiler optimization (200 runs + Yul)
- ✅ Storage packing (~15k gas saved)
- ✅ Efficient data types
- ✅ Event-based logging
- ✅ Memory vs storage optimization

**See [PERFORMANCE.md](./PERFORMANCE.md) for optimization guide.**

---

## 🛠️ Tech Stack

### Smart Contract

- **Solidity** 0.8.24 - Smart contract language
- **Hardhat** 2.19.0 - Development framework
- **fhEVM** 0.8.0 - Zama's Fully Homomorphic Encryption
- **OpenZeppelin** - Security patterns
- **Ethers.js** 6.14.0 - Ethereum library

### Frontend

- **HTML/CSS/JavaScript** - Pure frontend (no build tools)
- **ethers.js** - Web3 integration
- **MetaMask** - Wallet connection

### Development Tools

- **Solhint** - Solidity linting
- **ESLint** - JavaScript linting
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **GitHub Actions** - CI/CD automation

### Testing

- **Mocha** - Test framework
- **Chai** - Assertion library
- **Hardhat Network** - Local blockchain
- **Solidity Coverage** - Coverage reporting

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [README.md](./README.md) | This file - Project overview |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Deployment guide and instructions |
| [TESTING.md](./TESTING.md) | Testing guide (67 test cases) |
| [SECURITY.md](./SECURITY.md) | Security audit and best practices |
| [PERFORMANCE.md](./PERFORMANCE.md) | Performance optimization guide |
| [CI_CD.md](./CI_CD.md) | CI/CD pipeline documentation |
| [FRAMEWORK.md](./FRAMEWORK.md) | Hardhat framework guide |
| [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) | Project organization |

---

## 🔗 Links & Resources

### Official Links

- **Live Demo**: [https://terencemayer.github.io/FHEAnonymousArtAuthentication/](https://terencemayer.github.io/FHEAnonymousArtAuthentication/)
- **GitHub**: [https://github.com/TerenceMayer/FHEAnonymousArtAuthentication](https://github.com/TerenceMayer/FHEAnonymousArtAuthentication)
- **Contract**: [Sepolia Etherscan](https://sepolia.etherscan.io/address/0x4D874585f820437656554590C812b672305fbb72)

### Zama Resources

- **Zama Documentation**: [docs.zama.ai/fhevm](https://docs.zama.ai/fhevm)
- **fhEVM SDK**: [@fhevm/solidity](https://www.npmjs.com/package/@fhevm/solidity)
- **Zama GitHub**: [github.com/zama-ai](https://github.com/zama-ai)

### Network Resources

- **Sepolia Faucet**: [sepoliafaucet.com](https://sepoliafaucet.com/)
- **Sepolia Explorer**: [sepolia.etherscan.io](https://sepolia.etherscan.io/)
- **Infura**: [infura.io](https://infura.io/)

---

## 🎥 Video Demo

Watch our comprehensive video demonstration:

**Features Shown:**
- ✅ Complete workflow from artwork submission to authentication
- ✅ Expert registration and verification process
- ✅ Anonymous authentication submission
- ✅ Real blockchain transactions on Sepolia testnet
- ✅ Admin panel functionality
- ✅ Privacy-preserving features in action

**[Watch Demo Video](./demo.mp4)**

---

## 🚦 Troubleshooting

### Common Issues

**Wallet Connection Issues**
```bash
# Solution:
1. Ensure MetaMask is installed
2. Switch to Sepolia network
3. Get testnet ETH from faucet
4. Refresh the page
```

**Transaction Failures**
```bash
# Solution:
1. Check sufficient ETH balance
2. Verify network connection
3. Increase gas limit if needed
4. Check contract address is correct
```

**Compilation Errors**
```bash
# Solution:
npm run clean
npm install
npm run compile
```

**Test Failures**
```bash
# Solution:
# Check Node.js version
node --version  # Should be >= 18.0.0

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
npm test
```

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Ways to Contribute

- 🐛 **Report Bugs** - Open an issue with reproduction steps
- 💡 **Suggest Features** - Share your ideas for improvements
- 📝 **Improve Documentation** - Help make docs clearer
- 🔧 **Submit Code** - Fork, develop, and create pull requests
- 🧪 **Add Tests** - Improve test coverage
- 🌍 **Translate** - Help make the platform multilingual

### Development Setup

```bash
# Fork the repository
git clone https://github.com/YOUR_USERNAME/FHEAnonymousArtAuthentication.git

# Create feature branch
git checkout -b feature/amazing-feature

# Make changes and test
npm test
npm run lint

# Commit with conventional commits
git commit -m 'feat: add amazing feature'

# Push and create PR
git push origin feature/amazing-feature
```

### Code Quality Standards

- ✅ All tests must pass
- ✅ Maintain >90% code coverage
- ✅ Follow Solidity style guide
- ✅ Add comprehensive tests for new features
- ✅ Update documentation

---

## 🗺️ Roadmap

### Phase 1: Core Platform ✅ Completed
- [x] Smart contract with FHE encryption
- [x] Web interface for artwork submission
- [x] Expert registration and verification
- [x] Anonymous authentication workflow
- [x] Admin panel for expert verification

### Phase 2: Enhanced Features 🚧 In Progress
- [ ] Gateway integration for automated decryption
- [ ] IPFS integration for artwork images
- [ ] Expert payment distribution system
- [ ] Reputation algorithm refinement
- [ ] Multi-language support

### Phase 3: Advanced Capabilities 📋 Planned
- [ ] AI-assisted preliminary analysis
- [ ] Expert specialization matching
- [ ] Artwork ownership transfer
- [ ] Integration with major auction houses
- [ ] Mobile application (iOS/Android)

### Phase 4: Ecosystem Growth 🔮 Future
- [ ] Governance token for platform decisions
- [ ] Staking mechanism for experts
- [ ] Insurance integration for authenticated works
- [ ] Cross-chain compatibility
- [ ] NFT minting for authenticated artworks

---

## 🏆 Achievements

Built for the **Zama FHE Challenge** - demonstrating practical privacy-preserving applications using Fully Homomorphic Encryption.

**Key Achievements:**
- ✅ Fully functional FHE-based authentication platform
- ✅ 67 comprehensive test cases with 95% coverage
- ✅ Deployed and verified on Sepolia testnet
- ✅ Complete CI/CD pipeline
- ✅ Comprehensive documentation (80+ KB)
- ✅ Production-ready security features

---

## 📄 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2025 Anonymous Art Authentication Platform

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```

**See [LICENSE](./LICENSE) for full license text.**

---

## 🙏 Acknowledgments

- **[Zama](https://www.zama.ai/)** - For pioneering Fully Homomorphic Encryption technology and fhEVM
- **[Ethereum Foundation](https://ethereum.org/)** - For providing blockchain infrastructure
- **Art Authentication Community** - For inspiring this project with real-world challenges
- **Open Source Contributors** - For valuable feedback and contributions

---

## 📞 Contact & Support

### Get Help

- 📖 **Documentation**: Check our comprehensive docs above
- 🐛 **Bug Reports**: [Open an issue](https://github.com/TerenceMayer/FHEAnonymousArtAuthentication/issues)
- 💬 **Discussions**: [Join community](https://github.com/TerenceMayer/FHEAnonymousArtAuthentication/discussions)
- 🌐 **Live Demo**: [Try it now](https://terencemayer.github.io/FHEAnonymousArtAuthentication/)

### Stay Connected

- **GitHub**: [@TerenceMayer](https://github.com/TerenceMayer)
- **Project**: [FHEAnonymousArtAuthentication](https://github.com/TerenceMayer/FHEAnonymousArtAuthentication)

---

## 🌟 Star History

If you find this project useful, please consider giving it a ⭐ on GitHub!

[![Star History Chart](https://api.star-history.com/svg?repos=TerenceMayer/FHEAnonymousArtAuthentication&type=Date)](https://star-history.com/#TerenceMayer/FHEAnonymousArtAuthentication&Date)

---

**Built with ❤️ using Blockchain, FHE, and a passion for transparent art authentication**

*Revolutionizing artwork authentication through privacy-preserving blockchain technology powered by Zama FHEVM*

---

**Quick Navigation:**
[🚀 Quick Start](#-quick-start) | [🏗️ Architecture](#️-architecture) | [🔧 Technical](#-technical-implementation) | [🧪 Testing](#-testing) | [📚 Documentation](#-documentation) | [🤝 Contributing](#-contributing)
