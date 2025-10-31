# 🎨 Anonymous Art Authentication

> Privacy-preserving artwork authentication using Zama FHEVM - Eliminating bias in art verification through Fully Homomorphic Encryption

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![fhEVM](https://img.shields.io/badge/fhEVM-v0.8.0-blue)](https://docs.zama.ai/fhevm)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.24-green)](https://soliditylang.org/)
[![Tests](https://img.shields.io/badge/tests-67%20passing-brightgreen)](./TESTING.md)
[![Coverage](https://img.shields.io/badge/coverage-95%25-brightgreen)](./TESTING.md)
[![Hardhat](https://img.shields.io/badge/Hardhat-v2.19-orange)](https://hardhat.org/)

[![React](https://img.shields.io/badge/React-18.3-61dafb?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646cff?logo=vite)](https://vitejs.dev/)
[![FHEVM SDK](https://img.shields.io/badge/FHEVM%20SDK-1.0.0-blue)](./FHEAnonymousArtAuthentication-react)

---

## 🌐 Live Demo

**Try it now**: [https://terencemayer.github.io/FHEAnonymousArtAuthentication/](https://terencemayer.github.io/FHEAnonymousArtAuthentication/)

**Smart Contract**: [View on Sepolia Etherscan](https://sepolia.etherscan.io/address/0x4D874585f820437656554590C812b672305fbb72)

**Video Demo**: [demo.mp4]

---

## ✨ Features

### Core Features

- 🔐 **Privacy-Preserving Authentication** - Experts evaluate artworks without knowing artist identity or value
- 🎯 **Bias-Free Evaluation** - Encrypted metadata ensures objective, technical assessment
- 📝 **Immutable Records** - All authentication results permanently stored on blockchain
- ✅ **Expert Verification System** - Admin-approved experts with reputation tracking
- 🔒 **FHE Encryption** - Fully Homomorphic Encryption using Zama FHEVM v0.8.0
- 🌐 **Decentralized Platform** - No single point of failure or control
- 📊 **Consensus Mechanism** - Multiple expert agreement required for finalization
- 🏆 **Reputation System** - Track expert accuracy and success rates

### Frontend Options

#### 🎨 Vanilla JavaScript Version (Original)
- **Simple & Lightweight** - Pure HTML/CSS/JavaScript with no dependencies
- **No Build Process** - Works directly in browser, no compilation needed
- **Direct DOM Manipulation** - Traditional JavaScript approach
- **Quick to Understand** - Easy to learn and modify for beginners
- **Perfect for Demos** - Minimal setup, just open index.html
- **Use Case**: Learning FHE basics, quick prototyping, simple deployments

#### ⚛️ React + TypeScript Version (Modern) ⭐ NEW!
- **Component-Based Architecture** - Reusable, modular React components
  - `WalletConnect.tsx` - Wallet connection UI
  - `ArtworkSubmission.tsx` - Submit artworks with FHE
  - `ExpertAuthentication.tsx` - Expert registration & authentication
  - `AdminPanel.tsx` - Admin functions and expert verification
- **Full TypeScript Type Safety** - Strict type checking with interfaces
  - Type-safe contract interactions
  - Defined interfaces for artwork, expert, and authentication data
  - IntelliSense support throughout codebase
- **Hot Module Replacement (HMR)** - Instant feedback during development
  - Changes appear immediately without full page reload
  - State preservation during code updates
  - Lightning-fast development cycle
- **Custom FHEVM SDK Integration**
  - `@anonymous-art/fhevm-sdk` - Core FHE encryption functionality
  - `@anonymous-art/fhevm-react` - React hooks for FHE operations
  - Simplified encryption/decryption APIs
- **Modern State Management**
  - React Context API for global wallet state
  - `FHEContext.tsx` - Centralized FHE provider
  - Custom hooks: `useFHE()` for consuming FHE context
- **Production-Ready Build with Vite**
  - Optimized bundle size with tree-shaking
  - Code splitting for lazy loading
  - Fast build times (~5s vs traditional bundlers)
  - Built-in dev server with instant startup
- **Developer Experience**
  - Path aliases (`@/*`) for clean imports
  - ESLint + TypeScript integration
  - Browser polyfills for Node.js crypto libraries
  - Clear separation of concerns (components/context/utils)
- **Use Case**: Production applications, complex features, team development

---

## 🚀 Quick Start

### Which Version Should You Use?

Choose the version that best fits your needs:

| Feature | Vanilla JS | React + TypeScript |
|---------|------------|-------------------|
| **Setup Time** | ⚡ Instant (no build) | 🔧 ~2 minutes |
| **Learning Curve** | 📚 Beginner-friendly | 📚📚 Requires React knowledge |
| **Type Safety** | ❌ No types | ✅ Full TypeScript |
| **Hot Reload** | ❌ Manual refresh | ✅ Instant HMR |
| **Code Organization** | 📄 Single file | 📁 Component-based |
| **Production Ready** | ✅ Basic apps | ✅✅ Enterprise apps |
| **Maintainability** | ⭐⭐ Good | ⭐⭐⭐⭐⭐ Excellent |
| **Best For** | Learning, Demos | Production, Teams |

**Quick Decision:**
- 🎨 **Choose Vanilla** if: Learning FHE, quick demo, no build tools wanted
- ⚛️ **Choose React** if: Building production app, team development, need scalability

### Prerequisites

```bash
node >= 18.0.0
npm >= 9.0.0
MetaMask browser extension
```

### Installation

#### Option 1: Vanilla JavaScript Version (Original)

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

#### Option 2: React + TypeScript Version (Modern) ⭐ RECOMMENDED

```bash
# Navigate to React version
cd FHEAnonymousArtAuthentication-react

# Install dependencies
npm install

# Start development server with Hot Module Replacement
npm run dev

# Access at http://localhost:5173

# Build for production (optimized build)
npm run build

# Preview production build locally
npm run preview

# Run linting checks
npm run lint
```

**Development Features:**
- ⚡ **Instant HMR** - Changes reflect immediately without page reload
- 🔍 **TypeScript IntelliSense** - Full autocomplete and type checking
- 📦 **Optimized Builds** - Tree-shaking and code splitting
- 🎨 **Component Hot Reload** - Preserves state during development

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

### System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Frontend Layer (2 Options)                   │
│  ┌──────────────────────┐   ┌────────────────────────────────┐ │
│  │  Vanilla JS Version  │   │  React + TS Version (Modern)  │ │
│  │  - HTML/CSS/JS       │   │  - React 18.3 + Hooks          │ │
│  │  - Direct DOM        │   │  - TypeScript 5.5 (Strict)     │ │
│  │  - ethers.js         │   │  - Vite 5.4 (HMR)              │ │
│  └──────────────────────┘   │  - Context API (State Mgmt)    │ │
│                              │  - @anonymous-art/fhevm-sdk    │ │
│                              │  - @anonymous-art/fhevm-react  │ │
│                              │  - Component Architecture      │ │
│                              │  - TypeScript Types & Safety   │ │
│                              └────────────────────────────────┘ │
│                                                                 │
│  ├── MetaMask wallet integration (Provider Pattern)            │
│  ├── Web3 interaction via ethers.js 6.14                       │
│  ├── FHE Context Provider (Global State)                       │
│  └── Real-time encrypted data display with React rendering     │
└─────────────────────────────────────────────────────────────────┘
                                   ↓
┌─────────────────────────────────────────────────────────────────┐
│                    Smart Contract (Solidity)                    │
│  ├── Encrypted storage (euint32, euint8)                        │
│  ├── FHE operations (TFHE library from @fhevm/solidity)         │
│  ├── Access control (owner, experts, users)                     │
│  ├── Consensus mechanism (multi-expert voting)                  │
│  └── Event emissions for frontend state updates                 │
└─────────────────────────────────────────────────────────────────┘
                                   ↓
┌─────────────────────────────────────────────────────────────────┐
│                        Zama FHEVM Layer                         │
│  ├── Encrypted computation layer (zkSNARKs + FHE)               │
│  ├── Automatic re-randomization (sIND-CPAD security)            │
│  ├── TFHE operations (homomorphic arithmetic)                   │
│  └── Sepolia testnet deployment (Chain ID: 11155111)            │
└─────────────────────────────────────────────────────────────────┘
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

### React Project Structure

```
FHEAnonymousArtAuthentication-react/
├── src/
│   ├── components/              # React components (UI)
│   │   ├── WalletConnect.tsx           # Wallet connection & network status
│   │   ├── ArtworkSubmission.tsx       # Submit artwork form with FHE
│   │   ├── ExpertAuthentication.tsx    # Expert registration & auth
│   │   └── AdminPanel.tsx              # Admin verification panel
│   ├── context/                 # React Context (State Management)
│   │   └── FHEContext.tsx              # FHE provider, wallet state, hooks
│   ├── types/                   # TypeScript definitions
│   │   └── index.ts                    # Interfaces & types
│   ├── utils/                   # Utilities & configuration
│   │   └── contract.ts                 # Contract ABI, address, config
│   ├── App.tsx                  # Main application component
│   ├── App.css                  # Global styles & theming
│   └── main.tsx                 # Entry point, React DOM render
├── public/                      # Static assets
├── index.html                   # HTML template
├── package.json                 # Dependencies & scripts
├── tsconfig.json                # TypeScript configuration
├── tsconfig.node.json           # Node-specific TS config
├── vite.config.ts               # Vite build configuration
├── .eslintrc.json               # ESLint rules
└── README.md                    # React version documentation
```

**Key Files Explained:**

- **FHEContext.tsx**: Manages wallet connection, FHE instance, and global state
  - Provides `useFHE()` hook to all components
  - Handles MetaMask connection lifecycle
  - Initializes FHEVM SDK instance

- **components/**: Each component handles a specific feature
  - Self-contained with own state and logic
  - Consumes FHE context via hooks
  - Type-safe props and events

- **vite.config.ts**: Critical for crypto library compatibility
  - Node.js polyfills for browser environment
  - Path aliases configuration
  - Build optimization settings

---

## 🔧 Technical Implementation

### React vs Vanilla: Code Comparison

**Vanilla JavaScript Approach:**

```javascript
// Vanilla JS - Direct DOM manipulation
document.getElementById('connectBtn').onclick = async () => {
  if (typeof window.ethereum === 'undefined') {
    alert('Please install MetaMask!');
    return;
  }

  const accounts = await window.ethereum.request({
    method: 'eth_requestAccounts'
  });

  document.getElementById('walletAddress').textContent = accounts[0];
  document.getElementById('status').textContent = 'Connected';
};
```

**React + TypeScript Approach:**

```typescript
// React - Component-based with hooks and context
import React, { createContext, useContext, useState } from 'react';
import { ethers } from 'ethers';
import { initFhevm, createFhevmInstance } from '@anonymous-art/fhevm-sdk';

interface FHEContextType {
  account: string | null;
  isConnected: boolean;
  connectWallet: () => Promise<void>;
  fhevmInstance: any;
}

const FHEContext = createContext<FHEContextType | undefined>(undefined);

export const FHEProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [fhevmInstance, setFhevmInstance] = useState<any>(null);

  const connectWallet = async () => {
    if (!window.ethereum) {
      throw new Error('Please install MetaMask!');
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await provider.send('eth_requestAccounts', []);
    setAccount(accounts[0]);

    // Initialize FHE instance
    const instance = await createFhevmInstance();
    setFhevmInstance(instance);
  };

  return (
    <FHEContext.Provider value={{
      account,
      isConnected: !!account,
      connectWallet,
      fhevmInstance
    }}>
      {children}
    </FHEContext.Provider>
  );
};

// Custom hook for consuming context
export const useFHE = () => {
  const context = useContext(FHEContext);
  if (!context) {
    throw new Error('useFHE must be used within FHEProvider');
  }
  return context;
};

// WalletConnect Component
export const WalletConnect: React.FC = () => {
  const { account, isConnected, connectWallet } = useFHE();

  return (
    <div>
      {isConnected ? (
        <div>Connected: {account}</div>
      ) : (
        <button onClick={connectWallet}>Connect Wallet</button>
      )}
    </div>
  );
};
```

**Benefits of React Approach:**
- ✅ **Type Safety**: TypeScript catches errors at compile time
- ✅ **Reusability**: `useFHE()` hook used across all components
- ✅ **Testability**: Components can be tested in isolation
- ✅ **Maintainability**: Clear separation of state logic and UI
- ✅ **Scalability**: Easy to add new features without touching existing code

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

### Frontend Options

#### Vanilla Version (Original)
- **HTML/CSS/JavaScript** - Pure frontend (no build tools)
- **ethers.js** - Web3 integration
- **MetaMask** - Wallet connection
- **Direct DOM manipulation** - Simple and straightforward

#### React Version (Modern) ⭐ NEW
- **React** 18.3.0 - Modern UI library with hooks and component architecture
- **TypeScript** 5.5.0 - Type-safe development with strict mode enabled
- **Vite** 5.4.0 - Lightning-fast build tool with Hot Module Replacement (HMR)
- **@anonymous-art/fhevm-sdk** 1.0.0 - Custom FHEVM SDK for encryption
- **@anonymous-art/fhevm-react** 1.0.0 - React hooks for FHEVM integration
- **ethers.js** 6.14.0 - Ethereum library
- **React Context API** - Global state management for wallet and FHE state
- **ESNext Modules** - Modern JavaScript module system
- **Path Aliases** - Clean imports with `@/*` syntax
- **Node Polyfills** - Browser compatibility for crypto libraries

### Development Tools

- **Solhint** - Solidity linting and security checks
- **ESLint** 8.57.0 - JavaScript/TypeScript linting with strict rules
- **Prettier** - Automatic code formatting
- **Husky** - Git hooks for pre-commit checks
- **GitHub Actions** - CI/CD automation pipeline
- **TypeScript Compiler** - Type checking and transpilation
- **Vite Dev Server** - Fast development with instant HMR

### Testing

- **Mocha** - Test framework
- **Chai** - Assertion library
- **Hardhat Network** - Local blockchain for testing
- **Solidity Coverage** - Coverage reporting (~95% coverage)

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [README.md](./README.md) | **This file** - Complete project overview |
| [**React Version README** ⭐](./FHEAnonymousArtAuthentication-react/README.md) | **React + TypeScript version documentation** |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Deployment guide and instructions |
| [TESTING.md](./TESTING.md) | Testing guide (67 test cases, 95% coverage) |
| [SECURITY.md](./SECURITY.md) | Security audit and best practices |
| [PERFORMANCE.md](./PERFORMANCE.md) | Performance optimization guide |
| [CI_CD.md](./CI_CD.md) | CI/CD pipeline documentation |
| [FRAMEWORK.md](./FRAMEWORK.md) | Hardhat framework guide |
| [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) | Project organization |

### Technology-Specific Documentation

**React Version:**
- [React App README](./FHEAnonymousArtAuthentication-react/README.md) - Setup and usage
- [FHEVM SDK Documentation](./FHEAnonymousArtAuthentication-react/docs/fhevm-sdk.md) - SDK API reference
- [Component Documentation](./FHEAnonymousArtAuthentication-react/docs/components.md) - Component guide
- [TypeScript Types](./FHEAnonymousArtAuthentication-react/src/types/index.ts) - Type definitions

**Vanilla Version:**
- [Original Implementation](./index.html) - Vanilla JavaScript version
- [Script Source](./script.js) - Main application logic

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

**Compilation Errors (Smart Contract)**
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

### React Version Specific Issues

**Vite Build Errors with Crypto Libraries**
```bash
# Error: "Module not found: Can't resolve 'crypto'"
# Solution: Already configured in vite.config.ts with polyfills

# If issues persist:
npm install --save-dev buffer crypto-browserify stream-browserify
npm install --save-dev process os-browserify https-browserify
```

**TypeScript Errors**
```bash
# Error: "Cannot find module '@anonymous-art/fhevm-sdk'"
# Solution:
cd FHEAnonymousArtAuthentication-react
npm install

# Rebuild TypeScript
npm run build
```

**Hot Module Replacement Not Working**
```bash
# Solution:
# 1. Clear Vite cache
rm -rf node_modules/.vite

# 2. Restart dev server
npm run dev

# 3. Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
```

**FHE Context Provider Errors**
```typescript
// Error: "useFHE must be used within FHEProvider"
// Solution: Ensure your component is wrapped in FHEProvider

// ❌ Wrong:
<WalletConnect />

// ✅ Correct:
<FHEProvider>
  <WalletConnect />
</FHEProvider>
```

**Production Build Issues**
```bash
# Build fails with memory errors
# Solution: Increase Node.js memory limit
NODE_OPTIONS=--max-old-space-size=4096 npm run build

# Build succeeds but app doesn't work
# Solution: Check base path in vite.config.ts
export default defineConfig({
  base: './', // For relative paths
  // or
  base: '/your-repo-name/', // For GitHub Pages
})
```

**FHEVM SDK Initialization Fails**
```bash
# Error: "Failed to initialize FHEVM instance"
# Solution:
1. Ensure you're on Sepolia network
2. Check MetaMask is connected
3. Verify contract address in utils/contract.ts
4. Clear browser cache and try again
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
- ✅ **TypeScript code must pass strict type checking** (React version)
- ✅ **ESLint must pass with no warnings** (React version)

---

## 🔄 Migrating from Vanilla to React

If you're upgrading from the Vanilla JavaScript version to React, here's what you need to know:

### Key Differences

**1. Project Structure:**
```
Vanilla:                    React:
├── index.html              ├── src/
├── script.js               │   ├── components/
└── style.css               │   ├── context/
                            │   ├── types/
                            │   └── utils/
                            └── package.json
```

**2. State Management:**
```javascript
// Vanilla: Global variables
let walletAddress = null;
let contract = null;

// React: Context API
const { account, contract } = useFHE();
```

**3. Event Handling:**
```javascript
// Vanilla: Direct DOM
document.getElementById('btn').onclick = handler;

// React: JSX props
<button onClick={handler}>Click</button>
```

**4. Contract Interaction:**
```javascript
// Vanilla: Direct calls
const tx = await contract.submitArtwork(data);

// React: Same API, but with hooks
const { contract } = useFHE();
const tx = await contract.submitArtwork(data);
```

### Migration Steps

1. **Install React version:**
   ```bash
   cd FHEAnonymousArtAuthentication-react
   npm install
   ```

2. **Copy contract configuration:**
   - Your contract address stays the same
   - Update `CONTRACT_ADDRESS` in `src/utils/contract.ts`

3. **Migrate logic to components:**
   - Artwork submission → `ArtworkSubmission.tsx`
   - Expert features → `ExpertAuthentication.tsx`
   - Admin panel → `AdminPanel.tsx`

4. **Update state management:**
   - Use `useFHE()` hook instead of global variables
   - React will handle re-rendering automatically

5. **Test thoroughly:**
   ```bash
   npm run dev
   npm run build
   npm run preview
   ```

### Benefits After Migration

- ✅ **Type Safety**: Catch errors before runtime
- ✅ **Better DX**: Hot reload, IntelliSense, debugging
- ✅ **Maintainability**: Easier to add features and fix bugs
- ✅ **Performance**: Optimized re-renders, code splitting
- ✅ **Scalability**: Ready for complex features and team growth

---

## 🗺️ Roadmap

### Phase 1: Core Platform ✅ Completed
- [x] Smart contract with FHE encryption
- [x] Web interface for artwork submission
- [x] Expert registration and verification
- [x] Anonymous authentication workflow
- [x] Admin panel for expert verification
- [x] **React + TypeScript version** ⭐ NEW
- [x] **Custom FHEVM SDK packages** ⭐ NEW
- [x] **React hooks for FHE integration** ⭐ NEW
- [x] **Vite build system with HMR** ⭐ NEW
- [x] **Type-safe component architecture** ⭐ NEW

### Phase 2: Enhanced Features 🚧 In Progress
- [x] **Modern React frontend with TypeScript** - COMPLETED
- [x] **Component-based architecture** - COMPLETED
- [x] **Custom FHEVM SDK (`@anonymous-art/fhevm-sdk`)** - COMPLETED
- [x] **React hooks library (`@anonymous-art/fhevm-react`)** - COMPLETED
- [ ] Gateway integration for automated decryption
- [ ] IPFS integration for artwork images
- [ ] Expert payment distribution system
- [ ] Reputation algorithm refinement
- [ ] Multi-language support (i18n)

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
- ✅ Comprehensive documentation (100+ KB)
- ✅ Production-ready security features
- ✅ **Two complete frontend implementations** (Vanilla JS + React/TypeScript) ⭐ NEW
- ✅ **Custom FHEVM SDK packages** for reusable FHE integration ⭐ NEW
- ✅ **Modern React architecture** with TypeScript type safety ⭐ NEW
- ✅ **Lightning-fast development** with Vite and HMR ⭐ NEW
- ✅ **Production-ready builds** with optimized bundle sizes ⭐ NEW

**Technical Highlights:**
- 🎨 **Dual Frontend Options**: Choose between simplicity (Vanilla) or scalability (React)
- 📦 **Custom SDK**: `@anonymous-art/fhevm-sdk` and `@anonymous-art/fhevm-react`
- 🔒 **Type Safety**: Full TypeScript coverage with strict mode
- ⚡ **Developer Experience**: Hot Module Replacement, ESLint, Path aliases
- 🏗️ **Architecture**: Component-based design with React Context API

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
