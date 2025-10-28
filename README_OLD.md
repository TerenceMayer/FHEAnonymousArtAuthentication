# Anonymous Art Authentication Platform

**Blockchain-Based Artwork Authentication with Fully Homomorphic Encryption**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![fhEVM](https://img.shields.io/badge/fhEVM-v0.8.0-blue)](https://docs.zama.ai/fhevm)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.24-green)](https://soliditylang.org/)
[![Test Suite](https://img.shields.io/badge/tests-67%20passing-brightgreen)](./TESTING.md)
[![Coverage](https://img.shields.io/badge/coverage-95%25-brightgreen)](./TESTING.md)
[![Hardhat](https://img.shields.io/badge/Hardhat-v2.19-orange)](https://hardhat.org/)

---

## 🔗 Quick Links

- **🚀 Live Demo**: [https://terencemayer.github.io/FHEAnonymousArtAuthentication/](https://terencemayer.github.io/FHEAnonymousArtAuthentication/)
- **📋 GitHub Repository**: [https://github.com/TerenceMayer/FHEAnonymousArtAuthentication](https://github.com/TerenceMayer/FHEAnonymousArtAuthentication)
- **🎥 Video Demo**: Watch demonstration(demo.mp4)
- **📊 Smart Contract**: [View on Etherscan](https://sepolia.etherscan.io/address/0x4D874585f820437656554590C812b672305fbb72)
- **🔧 CI/CD Documentation**: [CI_CD.md](./CI_CD.md)

---

## 🎨 Core Concept

**Anonymous Art Authentication** is a revolutionary decentralized platform that enables expert artwork authentication without revealing identifying information about the artwork. This groundbreaking approach eliminates bias and price manipulation in the art verification process.

### The Problem We Solve

Traditional art authentication suffers from several critical issues:

- **Bias from Prior Knowledge**: When experts know the artist, provenance, or estimated value, their judgment can be influenced
- **Price Manipulation**: Knowledge of artwork value can lead to inflated or deflated authentication results
- **Lack of Transparency**: Authentication processes are often opaque with no verifiable record
- **Expert Conflicts of Interest**: Personal relationships or financial incentives can compromise objectivity

### Our Solution

By leveraging **Fully Homomorphic Encryption (FHE)** on blockchain, we ensure:

- ✅ **Blind Evaluation**: Experts authenticate artworks without knowing artist names, titles, or estimated values
- ✅ **Immutable Records**: All authentication results are permanently stored on the blockchain
- ✅ **Privacy-Preserving**: Sensitive artwork details remain encrypted throughout the evaluation process
- ✅ **Transparent Verification**: Anyone can verify authentication results while protecting confidential information
- ✅ **Bias-Free Assessment**: Removing identifying information ensures purely technical, objective analysis

---

## 🔧 How It Works

### 1. **Artwork Submission**
Owners submit their artworks with encrypted metadata including:
- Artwork age and physical condition
- Materials and techniques used
- Style characteristics
- **Hidden**: Artist name, title, provenance, estimated value

### 2. **Expert Registration**
Art authentication specialists register with:
- Encrypted professional credentials
- Area of expertise (paintings, sculptures, ceramics, etc.)
- Years of experience
- Professional certifications

### 3. **Admin Verification**
Platform administrators verify expert credentials to ensure:
- Legitimate professional background
- Relevant expertise and qualifications
- No conflicts of interest

### 4. **Anonymous Authentication**
Verified experts receive randomized authentication requests and provide:
- **Authenticity Score** (0-100): Assessment of whether the artwork is genuine
- **Confidence Level** (0-100): How certain they are about their evaluation
- **Private Analysis**: Technical observations (encrypted on-chain)

### 5. **Consensus & Results**
- Multiple experts evaluate each artwork
- Consensus threshold (e.g., 75% agreement) determines final authentication
- Results are permanently recorded on blockchain
- Expert reputation scores are updated based on accuracy

---

## 🌟 Key Features

### For Artwork Owners
- 🎯 **Unbiased Verification**: Get objective authentication without price influence
- 🔐 **Privacy Protection**: Control what information experts can see
- 📜 **Blockchain Certificate**: Permanent, tamper-proof authentication record
- 🌐 **Global Expert Access**: Connect with specialized authenticators worldwide

### For Art Experts
- 💼 **Professional Platform**: Build reputation through accurate assessments
- 🎭 **Anonymity During Review**: Evaluate without external pressure
- 💰 **Fair Compensation**: Earn rewards for quality authentication work
- 📊 **Reputation Tracking**: Performance-based credibility scoring

### For Galleries & Auction Houses
- ✅ **Certified Authentications**: Provide blockchain-verified artwork provenance
- 🛡️ **Fraud Prevention**: Reduce authentication disputes and forgeries
- 🤝 **Buyer Confidence**: Enhance trust with transparent verification
- 📈 **Market Value**: Authenticated artworks command premium prices

---

## 🔐 Privacy & Security Features

### Fully Homomorphic Encryption (FHE)
Powered by [Zama's fhEVM](https://docs.zama.ai/fhevm), our platform ensures:

- **Encrypted Computation**: Data remains encrypted during processing
- **Zero-Knowledge Proofs**: Experts verify authenticity without accessing sensitive information
- **Selective Disclosure**: Only necessary information is revealed at appropriate times
- **Blockchain Immutability**: All records are tamper-proof and permanent

### Smart Contract Security
- ✅ Owner-only administrative functions
- ✅ Expert verification requirements before authentication
- ✅ Access control lists (ACL) for encrypted data
- ✅ Input validation and range checks
- ✅ Reentrancy protection

---

## 🏛️ Use Cases

### Fine Art Galleries
*"We need to verify the authenticity of a painting attributed to a Renaissance master, but we don't want the expert's assessment to be influenced by the artist's fame or the painting's estimated million-dollar value."*

**Solution**: Submit the artwork anonymously. Experts evaluate based purely on technical characteristics: brushwork, materials, aging patterns, and style—without knowing it's potentially worth millions.

### Private Collectors
*"I purchased an artwork at auction, but I want independent verification without revealing the purchase price or seller information that might bias the expert."*

**Solution**: Get objective authentication from multiple experts who analyze the artwork blindly, ensuring their assessment is based solely on artistic and technical merits.

### Auction Houses
*"We need to provide buyers with certified authentication, but our in-house experts might be perceived as having conflicts of interest."*

**Solution**: Leverage decentralized expert network with blockchain-verified results that buyers can trust as independent and unbiased.

### Insurance Companies
*"We need to verify claimed artwork authenticity for insurance coverage, but traditional authentication is expensive and slow."*

**Solution**: Fast, cost-effective authentication with permanent blockchain records that satisfy underwriting requirements.

---

## 🌐 Technology Stack

### Blockchain & Smart Contracts
- **Network**: Ethereum Sepolia Testnet
- **Contract Address**: `0x4D874585f820437656554590C812b672305fbb72`
- **Solidity Version**: 0.8.24
- **Development Framework**: Hardhat v2.19.0
  - Hardhat Toolbox for comprehensive tooling
  - Hardhat Verify for Etherscan verification
  - Gas Reporter for optimization analysis
  - Solidity Coverage for test coverage
  - Complete test, deploy, and verification workflows

### Encryption & Privacy
- **fhEVM**: v0.8.0 (Zama's Fully Homomorphic Encryption)
- **Encrypted Types**: euint8, euint32 for sensitive data
- **Access Control**: FHE.allow() and FHE.allowThis() for permissions
- **Zama Oracle**: v0.2.0 for FHE operations

### Development Tools
- **Testing Framework**: Hardhat + Chai
- **Code Quality**: Solhint for linting, Prettier for formatting
- **Web3 Library**: ethers.js v6.14.0
- **Environment Management**: dotenv for configuration
- **Node.js**: >= 18.0.0 required

### Frontend
- **Pure HTML/CSS/JavaScript**: No build tools required
- **Web3 Integration**: ethers.js v6.14.0
- **Wallet Integration**: MetaMask compatible
- **Responsive Design**: Mobile and desktop optimized

---

## 📦 Smart Contract Functions

### Public Functions

#### For Artwork Owners
```solidity
submitArtwork(uint32 _metadataHash, uint8 _condition, uint256 _requiredConsensus)
```
Submit artwork for authentication with encrypted metadata and required consensus percentage (51-100%).

#### For Experts
```solidity
registerExpert(uint8 _credentialsHash)
```
Register as an expert with encrypted credentials.

```solidity
submitAuthentication(uint256 artworkId, uint256 expertId, uint8 _authenticity, uint8 _confidence)
```
Submit authentication assessment for an artwork (verified experts only).

#### For Administrators
```solidity
verifyExpert(uint256 expertId)
```
Verify an expert's credentials (contract owner only).

```solidity
finalizeAuthentication(uint256 artworkId, bool isAuthentic, uint256 finalScore)
```
Finalize artwork authentication result after consensus is reached (contract owner only).

### View Functions
```solidity
getArtworkInfo(uint256 artworkId)
getExpertInfo(uint256 expertId)
getArtworkExperts(uint256 artworkId)
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **MetaMask**: Browser wallet extension
- **Sepolia ETH**: Get testnet ETH from [Sepolia Faucet](https://sepoliafaucet.com/)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/TerenceMayer/FHEAnonymousArtAuthentication.git
cd FHEAnonymousArtAuthentication
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**
```bash
cp .env.example .env
# Edit .env with your settings
```

4. **Compile smart contracts**
```bash
npx hardhat compile
```

5. **Deploy to Sepolia**
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

### Local Development

**Open the application**
```bash
# Serve locally (any HTTP server)
npx http-server . -p 8080 -c-1 --cors

# Or simply open index.html in your browser
```

---

## 🎯 Usage Guide

### 1. Connect Your Wallet
- Click "Connect Wallet" button
- Approve MetaMask connection
- Switch to Sepolia network if prompted

### 2. Submit Artwork (Owner)
- Fill in artwork details:
  - Title (for your reference)
  - Estimated age
  - Art style
  - Materials used
  - Condition score (0-100)
  - Required consensus percentage
- Click "Submit for Authentication"
- Confirm transaction in MetaMask
- Note the Artwork ID from the success message

### 3. Register as Expert
- Enter your professional details:
  - Full name
  - Area of expertise
  - Years of experience
  - Professional credentials
- Click "Register as Expert"
- Note your Expert ID
- Wait for admin verification

### 4. Verify Expert (Admin Only)
- If you're the contract owner, you'll see "Admin Access" badge
- Click "Refresh Expert List"
- Find pending experts
- Click "✓ Verify Expert" button
- Confirm transaction

### 5. Submit Authentication (Verified Expert)
- Enter Artwork ID to authenticate
- Enter your Expert ID
- Provide your assessment:
  - Authenticity score (0-100)
  - Confidence level (0-100)
  - Optional private notes
- Click "Submit Authentication"

### 6. View Results
- Click "Refresh Gallery" to see all artworks
- Click "My Submitted Artworks" to see your submissions
- Check authentication status and expert evaluations

---

## 📊 Deployment Information

### Network Details
- **Network**: Ethereum Sepolia Testnet
- **Chain ID**: 11155111
- **Contract Address**: `0x4D874585f820437656554590C812b672305fbb72`
- **Deployer Address**: `0x95D116B6183B54Df922fE07865fE2A1CA99eDD52`
- **Deployment Date**: October 12, 2025
- **Compiler Version**: Solidity 0.8.24 (optimized with 200 runs)
- **EVM Version**: Cancun

### Verification
- **Etherscan Link**: [View Contract on Etherscan](https://sepolia.etherscan.io/address/0x4D874585f820437656554590C812b672305fbb72)
- **Contract Verified**: ✅ Yes
- **License**: MIT

### Deployment Scripts
All deployment scripts are located in the `scripts/` directory:
- `scripts/deploy.js` - Main deployment script
- `scripts/verify.js` - Etherscan verification script
- `scripts/interact.js` - Contract interaction utilities
- `scripts/simulate.js` - Complete workflow simulation

### Quick Deploy
```bash
# Deploy to Sepolia testnet
npm run deploy

# Verify contract on Etherscan
npm run verify

# Interact with deployed contract
npm run interact

# Run complete simulation (local network)
npm run simulate
```

---

## 🔄 fhEVM v0.8.0 Migration

This project has been fully migrated to **fhEVM v0.8.0** with the latest features:

### ✅ Implemented Features

1. **Automatic Transaction Re-randomization**
   - Provides sIND-CPAD security transparently
   - No manual intervention required

2. **Encrypted Data Types**
   - `euint32`: Encrypted artwork metadata hash
   - `euint8`: Encrypted condition, credentials, authenticity, confidence scores

3. **Access Control Lists (ACL)**
   - `FHE.allowThis()`: Contract access to encrypted data
   - `FHE.allow()`: User access permissions

4. **Simplified Decryption Flow**
   - Manual finalization by owner for demo purposes
   - Production-ready for Gateway integration

---

## 🎥 Video Demonstration

Watch our comprehensive video demo showcasing:

- ✅ Complete workflow from artwork submission to authentication
- ✅ Expert registration and verification process
- ✅ Anonymous authentication submission
- ✅ Real blockchain transactions on Sepolia testnet
- ✅ Admin panel functionality
- ✅ Privacy-preserving features in action

**Watch Demo Video(demo.mp4)** 

---

## 🛣️ Roadmap

### Phase 1: Core Platform (✅ Completed)
- [x] Smart contract development with FHE
- [x] Web interface for artwork submission
- [x] Expert registration and verification
- [x] Anonymous authentication workflow
- [x] Admin panel for expert verification

### Phase 2: Enhanced Features (🚧 In Progress)
- [ ] Gateway integration for automated decryption
- [ ] IPFS integration for artwork images
- [ ] Expert payment distribution system
- [ ] Reputation algorithm refinement
- [ ] Multi-language support

### Phase 3: Advanced Capabilities (📋 Planned)
- [ ] AI-assisted preliminary analysis
- [ ] Expert specialization matching
- [ ] Artwork ownership transfer
- [ ] Integration with major auction houses
- [ ] Mobile application (iOS/Android)

### Phase 4: Ecosystem Growth (🔮 Future)
- [ ] Governance token for platform decisions
- [ ] Staking mechanism for experts
- [ ] Insurance integration for authenticated works
- [ ] Cross-chain compatibility
- [ ] NFT minting for authenticated artworks

---

## 🔄 CI/CD Pipeline

The project features a comprehensive CI/CD pipeline using **GitHub Actions** for automated testing, code quality checks, and deployment.

### Workflows

#### 1. Test Suite (`test.yml`)
Runs automatically on every push and pull request:
- ✅ Multi-platform testing (Ubuntu & Windows)
- ✅ Multi-version Node.js (18.x & 20.x)
- ✅ 67 comprehensive test cases
- ✅ Code coverage reporting with Codecov
- ✅ Security vulnerability scanning

#### 2. Code Quality (`code-quality.yml`)
Ensures code quality standards:
- 🔍 Solhint linting for Solidity
- 📝 Prettier formatting checks
- 📊 Gas usage analysis
- 🔒 Dependency security audits
- 📈 Complexity analysis

#### 3. Deployment (`deploy.yml`)
Manual workflow for contract deployment:
- 🚀 Deploy to Sepolia or localhost
- ✅ Automatic Etherscan verification
- 📦 Deployment artifact storage
- 📋 Deployment summaries

### Code Quality Tools

**Solhint Configuration** (`.solhint.json`):
- Follows Solidity recommended rules
- Custom rules for gas optimization
- Complexity limits (max: 10)
- Line length limits (max: 120)

**Run Locally:**
```bash
npm run lint              # Run Solhint
npm run lint:fix          # Auto-fix issues
npm run format            # Format all code
npm run test:coverage     # Generate coverage
```

### Coverage Reporting

- **Target Coverage**: >90%
- **Current Coverage**: ~95%
- **Integration**: Codecov
- **Reports**: Automatic on every PR

For detailed CI/CD documentation, see [CI_CD.md](./CI_CD.md).

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Ways to Contribute
- 🐛 **Report Bugs**: Open an issue with detailed reproduction steps
- 💡 **Suggest Features**: Share your ideas for platform improvements
- 📝 **Improve Documentation**: Help us make docs clearer
- 🔧 **Submit Code**: Fork, improve, and create pull requests
- 🎨 **Design**: Enhance UI/UX with better designs
- 🌍 **Translate**: Help make the platform multilingual

### Development Setup
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

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
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🙏 Acknowledgments

- **[Zama](https://www.zama.ai/)**: For pioneering Fully Homomorphic Encryption technology and fhEVM
- **[Ethereum Foundation](https://ethereum.org/)**: For providing the blockchain infrastructure
- **Art Authentication Community**: For inspiring this project with real-world challenges
- **Open Source Contributors**: For their valuable feedback and contributions

---

## 📞 Contact & Support

- **GitHub Issues**: [Report bugs or request features](https://github.com/TerenceMayer/FHEAnonymousArtAuthentication/issues)
- **Discussions**: [Join community discussions](https://github.com/TerenceMayer/FHEAnonymousArtAuthentication/discussions)
- **Live Demo**: [https://terencemayer.github.io/FHEAnonymousArtAuthentication/](https://terencemayer.github.io/FHEAnonymousArtAuthentication/)

---

## 🌟 Star History

If you find this project useful, please consider giving it a ⭐ on GitHub!

---

**Built with ❤️ using Blockchain, FHE, and a passion for transparent art authentication**

*Revolutionizing artwork authentication through privacy-preserving blockchain technology*

