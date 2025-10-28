# Deployment Guide

This document provides comprehensive instructions for deploying the Anonymous Art Authentication smart contract to Ethereum networks.

---

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Deployment to Sepolia Testnet](#deployment-to-sepolia-testnet)
- [Contract Verification](#contract-verification)
- [Post-Deployment](#post-deployment)
- [Current Deployment](#current-deployment)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Tools
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Git**: Latest version
- **MetaMask**: Browser wallet extension

### Required Accounts & Keys
1. **Ethereum Wallet**:
   - Private key with testnet ETH
   - Get Sepolia ETH from [Sepolia Faucet](https://sepoliafaucet.com/)
   - Minimum ~0.1 ETH recommended for deployment

2. **Infura or Alchemy Account**:
   - Sign up at [Infura](https://infura.io/) or [Alchemy](https://www.alchemy.com/)
   - Create a new project
   - Copy your API endpoint URL

3. **Etherscan Account**:
   - Register at [Etherscan](https://etherscan.io/)
   - Get API key from [My API Keys](https://etherscan.io/myapikey)

---

## Environment Setup

### 1. Clone and Install

```bash
git clone https://github.com/TerenceMayer/FHEAnonymousArtAuthentication.git
cd FHEAnonymousArtAuthentication
npm install
```

### 2. Configure Environment Variables

Copy the example environment file:

```bash
cp env.example .env
```

Edit `.env` file with your configuration:

```bash
# Network Configuration
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID

# Private Key (WITHOUT 0x prefix)
# ⚠️ WARNING: NEVER commit your actual private key!
PRIVATE_KEY=your_private_key_without_0x_prefix

# Etherscan API Key for Verification
ETHERSCAN_API_KEY=your_etherscan_api_key_here

# Gas Reporter (optional)
REPORT_GAS=false
COINMARKETCAP_API_KEY=your_coinmarketcap_api_key
```

### 3. Security Checklist

- ✅ Ensure `.env` is in `.gitignore`
- ✅ Never commit `.env` to version control
- ✅ Use a dedicated testnet wallet (not your main wallet)
- ✅ Keep private keys secure and never share them
- ✅ Rotate API keys regularly

---

## Deployment to Sepolia Testnet

### Step 1: Compile Contracts

```bash
npm run compile
```

Expected output:
```
Compiled 1 Solidity file successfully
```

### Step 2: Run Tests (Optional but Recommended)

```bash
npm test
```

Run with gas reporting:
```bash
npm run test:gas
```

Run with coverage:
```bash
npm run test:coverage
```

### Step 3: Deploy Contract

Deploy to Sepolia testnet:

```bash
npm run deploy
```

Expected output:
```
Deploying Anonymous Art Authentication contract...
AnonymousArtAuthentication deployed to: 0x...

Contract verification:
Owner: 0x...
Next Artwork ID: 1
Next Expert ID: 1

=== Deployment Summary ===
Contract Address: 0x...
Network: sepolia
Deployer: 0x...
```

**Important**: Save the contract address from the deployment output!

### Step 4: Update Contract Address

Update the `CONTRACT_ADDRESS` in your `.env` file:

```bash
CONTRACT_ADDRESS=0xYourDeployedContractAddress
```

---

## Contract Verification

### Automatic Verification

Run the verification script:

```bash
npm run verify
```

Expected output:
```
Verifying contract on Etherscan...
Contract Address: 0x...
✅ Contract verified successfully!
```

### Manual Verification

If automatic verification fails, verify manually on Etherscan:

1. Go to [Sepolia Etherscan](https://sepolia.etherscan.io/)
2. Enter your contract address
3. Click "Contract" → "Verify and Publish"
4. Fill in the details:
   - **Compiler Type**: Solidity (Single file)
   - **Compiler Version**: v0.8.24+commit.e11b9ed9
   - **License**: MIT
   - **Optimization**: Yes (200 runs)
5. Paste your contract code
6. Submit for verification

---

## Post-Deployment

### 1. Test Contract Interaction

Run the interaction script:

```bash
npm run interact
```

This will:
- Display contract information
- Show current artwork and expert counts
- List registered artworks and experts

### 2. Run Complete Simulation

Test the full workflow on local network:

```bash
# Start local Hardhat node in one terminal
npm run node

# In another terminal, run simulation
npm run simulate
```

This simulates:
- Artwork submission
- Expert registration
- Expert verification
- Authentication submission
- Finalization

### 3. Update Frontend Configuration

If using the web interface, update `index.html` with your contract address:

```javascript
const CONTRACT_ADDRESS = "0xYourDeployedContractAddress";
```

---

## Current Deployment

### Production Deployment (Sepolia)

```
Network:              Ethereum Sepolia Testnet
Chain ID:             11155111
Contract Address:     0x4D874585f820437656554590C812b672305fbb72
Deployer:             0x95D116B6183B54Df922fE07865fE2A1CA99eDD52
Deployment Date:      October 12, 2025
Block Number:         [View on Etherscan]
Transaction Hash:     [View on Etherscan]

Compiler:             Solidity 0.8.24
Optimization:         Enabled (200 runs)
EVM Version:          Cancun
License:              MIT

Etherscan:            https://sepolia.etherscan.io/address/0x4D874585f820437656554590C812b672305fbb72
Verification Status:  ✅ Verified
```

### Deployment Costs

Typical deployment costs on Sepolia (testnet):
- **Contract Deployment**: ~0.02-0.05 ETH (varies with gas prices)
- **Verification**: Free
- **Total Time**: ~2-5 minutes

---

## Deployment Scripts Documentation

### scripts/deploy.js

Main deployment script that:
- Deploys the AnonymousArtAuthentication contract
- Waits for deployment confirmation
- Verifies initial contract state
- Displays deployment summary

Usage:
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

### scripts/verify.js

Etherscan verification script that:
- Submits contract source code to Etherscan
- Handles already-verified contracts gracefully
- Confirms successful verification

Usage:
```bash
npx hardhat run scripts/verify.js --network sepolia
```

### scripts/interact.js

Contract interaction utility that:
- Connects to deployed contract
- Displays contract state
- Lists all artworks and experts
- Shows authentication details

Usage:
```bash
npx hardhat run scripts/interact.js --network sepolia
```

### scripts/simulate.js

Complete workflow simulation that:
- Deploys contract locally
- Simulates artwork submission
- Registers and verifies experts
- Demonstrates authentication flow
- Shows final results

Usage:
```bash
npx hardhat run scripts/simulate.js --network hardhat
```

---

## Troubleshooting

### Common Issues

#### 1. Insufficient Funds

**Error**: `insufficient funds for gas * price + value`

**Solution**:
- Get more Sepolia ETH from [faucet](https://sepoliafaucet.com/)
- Ensure wallet has at least 0.1 ETH

#### 2. Nonce Too High/Low

**Error**: `nonce has already been used`

**Solution**:
```bash
# Reset Hardhat accounts
npx hardhat clean
```

#### 3. Network Connection Issues

**Error**: `could not detect network`

**Solution**:
- Check your RPC URL in `.env`
- Try alternative RPC providers:
  - Infura: `https://sepolia.infura.io/v3/YOUR_KEY`
  - Alchemy: `https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY`

#### 4. Verification Failed

**Error**: `Error in plugin @nomicfoundation/hardhat-verify`

**Solution**:
- Wait a few minutes after deployment
- Check Etherscan API key is correct
- Try manual verification on Etherscan

#### 5. Contract Already Deployed

**Error**: `contract already deployed at address`

**Solution**:
- Update `CONTRACT_ADDRESS` in `.env`
- Use `scripts/interact.js` to interact with existing contract

---

## Advanced Deployment Options

### Deploy to Local Hardhat Network

```bash
# Terminal 1: Start local node
npm run node

# Terminal 2: Deploy
npm run deploy:local
```

### Deploy with Custom Gas Settings

Edit `hardhat.config.js`:

```javascript
networks: {
  sepolia: {
    url: process.env.SEPOLIA_RPC_URL,
    accounts: [process.env.PRIVATE_KEY],
    gasPrice: 50000000000, // 50 gwei
    gas: 5000000
  }
}
```

### Deploy to Other Networks

Add network configuration to `hardhat.config.js`:

```javascript
mainnet: {
  url: process.env.MAINNET_RPC_URL,
  accounts: [process.env.PRIVATE_KEY],
  chainId: 1
},
goerli: {
  url: process.env.GOERLI_RPC_URL,
  accounts: [process.env.PRIVATE_KEY],
  chainId: 5
}
```

---

## Security Best Practices

### Before Deployment
- ✅ Run comprehensive tests (`npm test`)
- ✅ Review code with Solhint (`npm run lint`)
- ✅ Check test coverage (`npm run test:coverage`)
- ✅ Perform security audit
- ✅ Use testnet first (Sepolia)

### After Deployment
- ✅ Verify contract on Etherscan
- ✅ Test all functions via `interact.js`
- ✅ Document contract address securely
- ✅ Set up monitoring alerts
- ✅ Create backup of deployment details

### Production Checklist
- [ ] All tests passing
- [ ] Code linted and formatted
- [ ] Security audit completed
- [ ] Testnet deployment successful
- [ ] Contract verified on Etherscan
- [ ] Documentation updated
- [ ] Frontend integration tested
- [ ] Monitoring configured
- [ ] Emergency procedures documented

---

## Additional Resources

- **Hardhat Documentation**: [https://hardhat.org/docs](https://hardhat.org/docs)
- **Etherscan API**: [https://docs.etherscan.io/](https://docs.etherscan.io/)
- **Sepolia Faucet**: [https://sepoliafaucet.com/](https://sepoliafaucet.com/)
- **fhEVM Documentation**: [https://docs.zama.ai/fhevm](https://docs.zama.ai/fhevm)
- **Project README**: [README.md](./README.md)

---

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review Hardhat logs for detailed error messages
3. Verify your environment variables are correct
4. Open an issue on GitHub with:
   - Error message
   - Steps to reproduce
   - Environment details (Node version, OS, etc.)

---

**Last Updated**: December 2024
**Contract Version**: 2.0.0
**fhEVM Version**: 0.8.0
