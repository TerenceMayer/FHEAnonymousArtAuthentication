# Hardhat Development Framework Guide

This document provides comprehensive documentation for the Hardhat-based development framework used in the Anonymous Art Authentication project.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Hardhat Configuration](#hardhat-configuration)
- [Project Structure](#project-structure)
- [Development Workflows](#development-workflows)
- [Custom Hardhat Tasks](#custom-hardhat-tasks)
- [Testing Framework](#testing-framework)
- [Deployment Pipeline](#deployment-pipeline)
- [Best Practices](#best-practices)

---

## Overview

### What is Hardhat?

Hardhat is a professional Ethereum development environment that provides:
- **Smart contract compilation** with Solidity compiler
- **Automated testing** with Mocha and Chai
- **Local blockchain** for development and testing
- **Deployment scripts** for multiple networks
- **Contract verification** on Etherscan
- **Gas optimization** reporting and analysis
- **Debugging tools** with console.log in Solidity

### Why Hardhat?

✅ **Type-safe**: Full TypeScript support and type checking
✅ **Fast**: Optimized compilation and testing
✅ **Extensible**: Rich plugin ecosystem
✅ **Professional**: Industry-standard tooling
✅ **Well-documented**: Comprehensive documentation and community support

---

## Hardhat Configuration

### hardhat.config.js Structure

```javascript
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
        details: { yul: true }
      },
      evmVersion: "cancun"
    }
  },
  networks: {
    hardhat: { /* local development */ },
    sepolia: { /* testnet */ },
    localhost: { /* local node */ }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  etherscan: {
    apiKey: { sepolia: process.env.ETHERSCAN_API_KEY }
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS === "true",
    currency: "USD",
    outputFile: "gas-report.txt"
  },
  mocha: {
    timeout: 200000
  }
};
```

### Compiler Settings

| Setting | Value | Purpose |
|---------|-------|---------|
| Solidity Version | 0.8.24 | Latest stable version with Cancun support |
| Optimizer | Enabled | Reduce gas costs and contract size |
| Runs | 200 | Balance between deployment and execution cost |
| EVM Version | Cancun | Latest Ethereum EVM features |
| Yul Optimizer | Enabled | Advanced optimization |

### Network Configuration

#### Hardhat Network (Default)
- **Purpose**: Local development and testing
- **Chain ID**: 31337
- **Features**: Fast mining, console.log support, snapshot/revert
- **Accounts**: 10 pre-funded accounts with 10,000 ETH each

#### Sepolia Testnet
- **Purpose**: Public testnet deployment
- **Chain ID**: 11155111
- **RPC**: Configurable via environment variable
- **Faucet**: [https://sepoliafaucet.com/](https://sepoliafaucet.com/)

#### Localhost
- **Purpose**: Connect to local Hardhat node
- **URL**: http://127.0.0.1:8545
- **Chain ID**: 31337

---

## Project Structure

```
FHEAnonymousArtAuthentication/
├── contracts/                  # Smart contract source files
│   └── AnonymousArtAuthentication.sol
├── scripts/                    # Deployment and utility scripts
│   ├── deploy.js              # Main deployment script
│   ├── verify.js              # Etherscan verification
│   ├── interact.js            # Contract interaction utilities
│   └── simulate.js            # Workflow simulation
├── test/                       # Test files
│   └── AnonymousArtAuthentication.test.js
├── artifacts/                  # Compiled contracts (generated)
├── cache/                      # Hardhat cache (generated)
├── hardhat.config.js          # Hardhat configuration
├── package.json               # Dependencies and scripts
├── .env                       # Environment variables (not committed)
├── env.example               # Environment template
├── README.md                  # Project documentation
├── DEPLOYMENT.md              # Deployment guide
└── FRAMEWORK.md               # This file
```

---

## Development Workflows

### 1. Compilation Workflow

```bash
# Clean previous builds
npm run clean

# Compile contracts
npm run compile
```

**What happens:**
1. Hardhat reads `contracts/*.sol`
2. Solidity compiler compiles with optimization
3. Generates ABI and bytecode in `artifacts/`
4. Creates contract types (if using TypeScript)

### 2. Testing Workflow

```bash
# Run all tests
npm test

# Run with gas reporting
npm run test:gas

# Run with coverage
npm run test:coverage
```

**Test structure:**
```javascript
describe("AnonymousArtAuthentication", function () {
  // Setup
  beforeEach(async function () {
    // Deploy contract, get signers, etc.
  });

  // Test cases
  it("should deploy successfully", async function () {
    // Assertions
  });
});
```

### 3. Deployment Workflow

```bash
# Deploy to Sepolia
npm run deploy

# Verify on Etherscan
npm run verify

# Interact with deployed contract
npm run interact
```

### 4. Local Development Workflow

```bash
# Terminal 1: Start local Hardhat node
npm run node

# Terminal 2: Deploy to local network
npm run deploy:local

# Terminal 3: Run tests or interact
npm test
```

---

## Custom Hardhat Tasks

### Built-in Tasks

```bash
# List all available tasks
npx hardhat help

# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Clean artifacts
npx hardhat clean

# Start local node
npx hardhat node

# Run console
npx hardhat console --network sepolia
```

### Custom Tasks

#### 1. List Accounts

```bash
npx hardhat accounts
```

Prints all available accounts and their addresses.

**Implementation:**
```javascript
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();
  for (const account of accounts) {
    console.log(account.address);
  }
});
```

#### 2. Check Balance

```bash
npx hardhat balance --account 0xYourAddress
```

Displays the ETH balance for a specific account.

**Implementation:**
```javascript
task("balance", "Prints an account's balance")
  .addParam("account", "The account's address")
  .setAction(async (taskArgs, hre) => {
    const balance = await hre.ethers.provider.getBalance(taskArgs.account);
    console.log(hre.ethers.formatEther(balance), "ETH");
  });
```

#### 3. Contract Size

```bash
npx hardhat contract-size
```

Shows deployed contract size and remaining space (max 24KB).

**Implementation:**
```javascript
task("contract-size", "Prints the deployed contract size", async (taskArgs, hre) => {
  const contractAddress = process.env.CONTRACT_ADDRESS;
  const code = await hre.ethers.provider.getCode(contractAddress);
  const sizeInBytes = (code.length - 2) / 2;
  console.log(`Contract size: ${sizeInBytes} bytes`);
  console.log(`Max: 24576 bytes (24 KB)`);
});
```

### Creating Custom Tasks

Add to `hardhat.config.js`:

```javascript
task("task-name", "Task description")
  .addParam("param1", "Parameter description")
  .addOptionalParam("param2", "Optional parameter", "default")
  .setAction(async (taskArgs, hre) => {
    // Task implementation
    const { param1, param2 } = taskArgs;
    // Use hre.ethers, hre.network, etc.
  });
```

---

## Testing Framework

### Test Structure

```javascript
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ContractName", function () {
  let contract;
  let owner, addr1, addr2;

  beforeEach(async function () {
    // Get signers
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy contract
    const Contract = await ethers.getContractFactory("ContractName");
    contract = await Contract.deploy();
    await contract.waitForDeployment();
  });

  describe("Deployment", function () {
    it("should set the right owner", async function () {
      expect(await contract.owner()).to.equal(owner.address);
    });
  });

  describe("Functionality", function () {
    it("should perform action correctly", async function () {
      await contract.someFunction();
      expect(await contract.someValue()).to.equal(expectedValue);
    });
  });
});
```

### Assertion Library (Chai)

```javascript
// Equality
expect(value).to.equal(expected);
expect(value).to.not.equal(unexpected);

// Boolean
expect(value).to.be.true;
expect(value).to.be.false;

// Revert testing
await expect(contract.function())
  .to.be.revertedWith("Error message");

// Event testing
await expect(contract.function())
  .to.emit(contract, "EventName")
  .withArgs(arg1, arg2);

// Balance changes
await expect(() => contract.transfer(addr, amount))
  .to.changeEtherBalance(addr, amount);
```

### Gas Reporting

Enable in `.env`:
```bash
REPORT_GAS=true
```

Run tests with gas reporting:
```bash
npm run test:gas
```

Output:
```
·---------------------------------|---------------------------|
|  Solc version: 0.8.24           ·  Optimizer enabled: true  |
·---------------------------------|---------------------------|
|  Methods                        ·                           |
·················|················|·············|··············|
|  Contract      ·  Method        ·  Min        ·  Max         |
·················|················|·············|··············|
|  Contract      ·  submitArtwork ·  125,000    ·  150,000     |
·················|················|·············|··············|
```

### Coverage Analysis

```bash
npm run test:coverage
```

Generates `coverage/` directory with HTML report showing:
- Line coverage
- Branch coverage
- Function coverage
- Statement coverage

---

## Deployment Pipeline

### 1. Pre-deployment Checklist

```bash
# Run all tests
npm test

# Check code quality
npm run lint

# Verify coverage
npm run test:coverage

# Clean and recompile
npm run clean && npm run compile
```

### 2. Environment Setup

Create `.env` file:
```bash
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
PRIVATE_KEY=your_private_key_without_0x
ETHERSCAN_API_KEY=your_etherscan_key
```

### 3. Deployment Script (scripts/deploy.js)

```javascript
const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying contract...");

  // Get contract factory
  const Contract = await ethers.getContractFactory("ContractName");

  // Deploy
  const contract = await Contract.deploy(constructorArgs);
  await contract.waitForDeployment();

  // Get address
  const address = await contract.getAddress();
  console.log("Contract deployed to:", address);

  // Verify initial state
  console.log("Owner:", await contract.owner());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

### 4. Verification Script (scripts/verify.js)

```javascript
const { run } = require("hardhat");

async function main() {
  const contractAddress = process.env.CONTRACT_ADDRESS;

  await run("verify:verify", {
    address: contractAddress,
    constructorArguments: [],
  });

  console.log("Contract verified!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

### 5. Interaction Script (scripts/interact.js)

```javascript
const { ethers } = require("hardhat");

async function main() {
  const contractAddress = process.env.CONTRACT_ADDRESS;

  // Attach to deployed contract
  const Contract = await ethers.getContractFactory("ContractName");
  const contract = Contract.attach(contractAddress);

  // Interact with contract
  const value = await contract.someFunction();
  console.log("Value:", value);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

---

## Best Practices

### 1. Code Organization

✅ **DO:**
- Keep contracts in `contracts/` directory
- Use clear, descriptive contract names
- Separate interfaces and implementations
- Group related functions together

❌ **DON'T:**
- Mix test and production code
- Use generic names like `Contract.sol`
- Create deeply nested directory structures

### 2. Testing

✅ **DO:**
- Write tests for all functions
- Test edge cases and failure scenarios
- Use descriptive test names
- Aim for >80% code coverage
- Test events and state changes

❌ **DON'T:**
- Skip error case testing
- Use magic numbers in tests
- Depend on test execution order
- Ignore gas optimization

### 3. Deployment

✅ **DO:**
- Test on local network first
- Deploy to testnet before mainnet
- Verify contracts on Etherscan
- Document deployment addresses
- Use environment variables for secrets

❌ **DON'T:**
- Commit `.env` files
- Use hardcoded private keys
- Skip verification step
- Deploy without testing

### 4. Security

✅ **DO:**
- Run Solhint for static analysis
- Use OpenZeppelin contracts
- Implement access control
- Add input validation
- Handle errors gracefully

❌ **DON'T:**
- Ignore compiler warnings
- Use deprecated functions
- Skip security audits
- Expose sensitive data

### 5. Gas Optimization

✅ **DO:**
- Enable optimizer in config
- Use appropriate data types
- Batch operations when possible
- Cache storage variables
- Monitor gas usage

❌ **DON'T:**
- Over-optimize prematurely
- Sacrifice security for gas savings
- Ignore contract size limits
- Use expensive operations in loops

---

## NPM Scripts Reference

### Core Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `compile` | `npx hardhat compile` | Compile smart contracts |
| `test` | `npx hardhat test` | Run all tests |
| `test:gas` | `REPORT_GAS=true npx hardhat test` | Run tests with gas reporting |
| `test:coverage` | `npx hardhat coverage` | Generate test coverage report |
| `clean` | `npx hardhat clean` | Clean artifacts and cache |
| `node` | `npx hardhat node` | Start local Hardhat node |

### Deployment Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `deploy` | `npx hardhat run scripts/deploy.js --network sepolia` | Deploy to Sepolia |
| `deploy:local` | `npx hardhat run scripts/deploy.js --network hardhat` | Deploy locally |
| `verify` | `npx hardhat run scripts/verify.js --network sepolia` | Verify on Etherscan |
| `interact` | `npx hardhat run scripts/interact.js --network sepolia` | Interact with contract |
| `simulate` | `npx hardhat run scripts/simulate.js --network sepolia` | Run simulation |

### Code Quality Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `lint` | `npx solhint 'contracts/**/*.sol'` | Lint Solidity files |
| `lint:fix` | `npx solhint 'contracts/**/*.sol' --fix` | Auto-fix linting issues |
| `format` | `npx prettier --write 'contracts/**/*.sol'` | Format code |

---

## Debugging Tips

### 1. Use console.log in Solidity

```solidity
import "hardhat/console.sol";

contract MyContract {
  function someFunction(uint256 value) public {
    console.log("Value:", value);
  }
}
```

### 2. Hardhat Console

```bash
npx hardhat console --network sepolia
```

Interactive REPL for contract interaction:
```javascript
const Contract = await ethers.getContractFactory("ContractName");
const contract = await Contract.attach("0xAddress");
await contract.someFunction();
```

### 3. Fork Mainnet for Testing

```javascript
// hardhat.config.js
networks: {
  hardhat: {
    forking: {
      url: "https://eth-mainnet.alchemyapi.io/v2/YOUR_KEY",
      blockNumber: 14390000
    }
  }
}
```

### 4. Verbose Error Messages

```bash
npx hardhat test --verbose
```

---

## Additional Resources

- **Hardhat Documentation**: [https://hardhat.org/docs](https://hardhat.org/docs)
- **Ethers.js Documentation**: [https://docs.ethers.org/v6/](https://docs.ethers.org/v6/)
- **Chai Assertion Library**: [https://www.chaijs.com/](https://www.chaijs.com/)
- **Solidity Documentation**: [https://docs.soliditylang.org/](https://docs.soliditylang.org/)
- **OpenZeppelin Contracts**: [https://docs.openzeppelin.com/contracts](https://docs.openzeppelin.com/contracts)

---

## Troubleshooting

### Common Issues

**Issue**: `Error HH8: There's one or more errors in your config file`
**Solution**: Check `hardhat.config.js` syntax and required imports

**Issue**: `Error: cannot estimate gas`
**Solution**: Transaction will revert, check require statements and contract state

**Issue**: `Error: invalid BigNumber value`
**Solution**: Ensure numeric values are properly formatted (use ethers.parseEther, etc.)

**Issue**: `Error: nonce has already been used`
**Solution**: Reset network with `npx hardhat clean` or use different account

---

**Last Updated**: December 2024
**Hardhat Version**: 2.19.0
**Ethers.js Version**: 6.14.0
