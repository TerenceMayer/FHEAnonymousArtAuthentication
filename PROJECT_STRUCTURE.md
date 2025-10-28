# Project Structure

This document provides a comprehensive overview of the Anonymous Art Authentication project structure and organization.

---

## 📁 Directory Structure

```
FHEAnonymousArtAuthentication/
├── contracts/                          # Smart contract source files
│   └── AnonymousArtAuthentication.sol  # Main contract with FHE encryption
│
├── scripts/                            # Hardhat deployment and utility scripts
│   ├── deploy.js                       # Main deployment script with detailed logging
│   ├── verify.js                       # Etherscan contract verification script
│   ├── interact.js                     # Contract interaction and state inspection
│   └── simulate.js                     # Complete workflow simulation
│
├── test/                               # Test suite
│   └── AnonymousArtAuthentication.test.js  # Comprehensive contract tests
│
├── artifacts/                          # Compiled contract artifacts (generated)
│   ├── contracts/                      # Contract ABIs and bytecode
│   └── build-info/                     # Build metadata
│
├── cache/                              # Hardhat compilation cache (generated)
│
├── coverage/                           # Test coverage reports (generated)
│
├── github/                             # GitHub workflows and templates
│   └── workflows/                      # CI/CD pipeline configurations
│
├── node_modules/                       # NPM dependencies (not committed)
│
├── hardhat.config.js                   # Hardhat configuration with custom tasks
├── package.json                        # Project dependencies and npm scripts
├── package-lock.json                   # Locked dependency versions
│
├── .env                                # Environment variables (not committed)
├── env.example                         # Environment variable template
├── .gitignore                          # Git ignore patterns
│
├── README.md                           # Main project documentation
├── DEPLOYMENT.md                       # Deployment guide and instructions
├── FRAMEWORK.md                        # Hardhat framework documentation
├── PROJECT_STRUCTURE.md                # This file
├── TESTING.md                          # Testing documentation
├── COMPETITION_READY.md                # Competition submission checklist
│
├── index.html                          # Frontend web interface
├── demo.mp4                            # Video demonstration
│
└── deployment-info.json                # Auto-generated deployment metadata
```

---

## 📄 Key Files Description

### Smart Contracts

#### `contracts/AnonymousArtAuthentication.sol`
Main smart contract implementing the anonymous art authentication system using Fully Homomorphic Encryption (FHE).

**Key Features:**
- fhEVM v0.8.0 integration
- Encrypted artwork metadata storage
- Expert registration and verification
- Anonymous authentication submissions
- Consensus-based finalization
- Access control and permissions

**Dependencies:**
- `@fhevm/solidity` - FHE encryption library
- `@zama-fhe/oracle-solidity` - Zama oracle integration

---

### Scripts

#### `scripts/deploy.js`
Comprehensive deployment script with:
- Pre-deployment validation (balance check)
- Detailed deployment logging
- Post-deployment verification
- Automatic deployment info export
- Next steps guidance

**Usage:**
```bash
npm run deploy          # Deploy to Sepolia
npm run deploy:local    # Deploy to local network
```

#### `scripts/verify.js`
Etherscan verification script with:
- Automatic contract address detection
- Multiple fallback strategies
- Detailed error handling
- API key validation

**Usage:**
```bash
npm run verify
```

#### `scripts/interact.js`
Contract interaction utility with:
- Contract state inspection
- Artwork and expert listing
- Owner verification
- Detailed status reporting

**Usage:**
```bash
npm run interact
```

#### `scripts/simulate.js`
Complete workflow simulation demonstrating:
- Contract deployment
- Artwork submission
- Expert registration and verification
- Anonymous authentication
- Consensus and finalization

**Usage:**
```bash
npm run simulate
```

---

### Configuration Files

#### `hardhat.config.js`
Hardhat configuration including:

**Compiler Settings:**
- Solidity 0.8.24
- Optimizer enabled (200 runs)
- Cancun EVM version
- Yul optimizer

**Networks:**
- Hardhat (local development)
- Sepolia (public testnet)
- Localhost (local node)

**Plugins:**
- Hardhat Toolbox
- Hardhat Verify
- Gas Reporter
- Solidity Coverage

**Custom Tasks:**
- `accounts` - List all accounts
- `balance` - Check account balance
- `contract-size` - Display contract size

#### `package.json`
NPM package configuration with:

**Dependencies:**
- `@fhevm/solidity` - FHE encryption
- `@zama-fhe/oracle-solidity` - Oracle support
- `ethers` - Ethereum library

**Dev Dependencies:**
- `hardhat` - Development framework
- `@nomicfoundation/hardhat-toolbox` - Testing tools
- `@nomicfoundation/hardhat-verify` - Verification
- `solhint` - Solidity linter
- `prettier` - Code formatter

**Scripts:**
See [NPM Scripts](#npm-scripts) section below.

---

### Environment Configuration

#### `.env` (Not Committed)
Contains sensitive configuration:
```bash
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
PRIVATE_KEY=your_private_key_without_0x
CONTRACT_ADDRESS=0xYourContractAddress
ETHERSCAN_API_KEY=your_etherscan_key
REPORT_GAS=false
```

#### `env.example`
Template for environment variables with:
- Configuration instructions
- Security warnings
- Required variables documentation
- Example values

---

### Documentation

#### `README.md`
Main project documentation covering:
- Project overview and concept
- Technology stack
- Features and use cases
- Installation and setup
- Usage guide
- Deployment information
- Contributing guidelines

#### `DEPLOYMENT.md`
Comprehensive deployment guide with:
- Prerequisites and requirements
- Step-by-step deployment instructions
- Network configuration
- Verification process
- Troubleshooting guide
- Security best practices

#### `FRAMEWORK.md`
Hardhat framework documentation including:
- Framework overview
- Configuration details
- Development workflows
- Custom tasks documentation
- Testing guidelines
- Best practices

#### `TESTING.md`
Testing documentation covering:
- Test structure
- Coverage requirements
- Testing strategies
- Gas optimization
- Security testing

---

### Frontend

#### `index.html`
Pure HTML/CSS/JavaScript web interface with:
- MetaMask wallet integration
- Artwork submission form
- Expert registration
- Authentication interface
- Admin panel
- Real-time blockchain interaction

**No build tools required** - can be served directly or with any HTTP server.

---

## 🔧 NPM Scripts

### Compilation & Building

| Script | Command | Description |
|--------|---------|-------------|
| `compile` | `npx hardhat compile` | Compile smart contracts |
| `clean` | `npx hardhat clean` | Clean artifacts and cache |

### Testing

| Script | Command | Description |
|--------|---------|-------------|
| `test` | `npx hardhat test` | Run all tests |
| `test:gas` | `REPORT_GAS=true npx hardhat test` | Run with gas reporting |
| `test:coverage` | `npx hardhat coverage` | Generate coverage report |

### Deployment

| Script | Command | Description |
|--------|---------|-------------|
| `deploy` | `npx hardhat run scripts/deploy.js --network sepolia` | Deploy to Sepolia |
| `deploy:local` | `npx hardhat run scripts/deploy.js --network hardhat` | Deploy locally |
| `verify` | `npx hardhat run scripts/verify.js --network sepolia` | Verify on Etherscan |

### Interaction

| Script | Command | Description |
|--------|---------|-------------|
| `interact` | `npx hardhat run scripts/interact.js --network sepolia` | Interact with contract |
| `simulate` | `npx hardhat run scripts/simulate.js --network sepolia` | Run simulation |

### Development

| Script | Command | Description |
|--------|---------|-------------|
| `node` | `npx hardhat node` | Start local Hardhat node |
| `lint` | `npx solhint 'contracts/**/*.sol'` | Lint Solidity files |
| `lint:fix` | `npx solhint 'contracts/**/*.sol' --fix` | Auto-fix linting |
| `format` | `npx prettier --write '**/*.sol' '**/*.js'` | Format code |

### Frontend

| Script | Command | Description |
|--------|---------|-------------|
| `serve` | `npx http-server . -p 8080 --cors -c-1` | Serve frontend locally |

---

## 🔄 Development Workflow

### 1. Initial Setup

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
```

### 2. Local Development

```bash
# Terminal 1: Start local Hardhat node
npm run node

# Terminal 2: Run tests
npm test

# Deploy to local network
npm run deploy:local

# Run simulation
npm run simulate
```

### 3. Testnet Deployment

```bash
# Compile contracts
npm run compile

# Run tests
npm test

# Deploy to Sepolia
npm run deploy

# Verify on Etherscan
npm run verify

# Interact with contract
npm run interact
```

### 4. Code Quality

```bash
# Lint Solidity code
npm run lint

# Auto-fix linting issues
npm run lint:fix

# Format code
npm run format

# Check test coverage
npm run test:coverage
```

---

## 📦 Generated Files & Directories

These files/directories are auto-generated and should not be committed:

### `artifacts/`
- Contains compiled contract ABIs and bytecode
- Generated by `npx hardhat compile`
- Used by deployment and testing scripts
- **Ignored in git**

### `cache/`
- Hardhat compilation cache
- Speeds up subsequent compilations
- **Ignored in git**

### `coverage/`
- Test coverage reports (HTML and JSON)
- Generated by `npx hardhat coverage`
- **Ignored in git**

### `deployment-info.json`
- Auto-generated during deployment
- Contains:
  - Network information
  - Contract address
  - Deployer address
  - Deployment timestamp
  - Block number
- **Should be committed** for deployment tracking

### `gas-report.txt`
- Gas usage report
- Generated when `REPORT_GAS=true`
- **Ignored in git**

---

## 🔐 Security Considerations

### Files to Never Commit

❌ **NEVER commit:**
- `.env` - Contains private keys and API keys
- `node_modules/` - Dependencies (large, auto-installable)
- `artifacts/` - Generated files
- `cache/` - Build cache
- Private keys in any form
- API keys

✅ **Always commit:**
- `env.example` - Environment template
- `.gitignore` - Ignore patterns
- Source code files
- Documentation
- Test files
- Public configuration

### File Permissions

Ensure these files have restricted permissions:
```bash
chmod 600 .env              # Owner read/write only
chmod 644 hardhat.config.js # Public read, owner write
chmod 755 scripts/*.js      # Executable scripts
```

---

## 📊 File Size Guidelines

| Type | Max Size | Purpose |
|------|----------|---------|
| Smart Contracts | 24 KB | EVM contract size limit |
| Documentation | - | Comprehensive guides |
| Scripts | 10 KB | Keep focused and modular |
| Tests | - | Comprehensive coverage |

---

## 🔍 Finding Files

### By Function

**Smart Contracts:**
```bash
find . -name "*.sol" -not -path "./node_modules/*"
```

**Scripts:**
```bash
find ./scripts -name "*.js"
```

**Tests:**
```bash
find ./test -name "*.test.js"
```

**Documentation:**
```bash
find . -name "*.md" -not -path "./node_modules/*"
```

### By Content

**Find contracts using FHE:**
```bash
grep -r "TFHE" contracts/
```

**Find deployment scripts:**
```bash
grep -r "deploy()" scripts/
```

**Find test cases:**
```bash
grep -r "describe(" test/
```

---

## 📚 Additional Resources

- **Project README**: [README.md](./README.md)
- **Deployment Guide**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Framework Docs**: [FRAMEWORK.md](./FRAMEWORK.md)
- **Testing Guide**: [TESTING.md](./TESTING.md)

- **Hardhat Documentation**: [https://hardhat.org/docs](https://hardhat.org/docs)
- **fhEVM Documentation**: [https://docs.zama.ai/fhevm](https://docs.zama.ai/fhevm)
- **Ethers.js Documentation**: [https://docs.ethers.org/v6/](https://docs.ethers.org/v6/)

---

**Last Updated**: December 2024
**Project Version**: 2.0.0
**Structure Version**: 1.0
