# Anonymous Art Authentication Platform - React Edition

A fully-featured React application for anonymous artwork authentication using Fully Homomorphic Encryption (FHE) powered by Zama's fhEVM.

## 🎨 Overview

This is the **React version** of the Anonymous Art Authentication Platform, converted from vanilla JavaScript to modern React with TypeScript. It demonstrates how to build production-ready dApps with FHE technology using the `@anonymous-art/fhevm-sdk`.

### Key Features

- ✅ **React 18 + TypeScript** - Modern, type-safe React application
- ✅ **FHEVM SDK Integration** - Full integration with `@anonymous-art/fhevm-sdk`
- ✅ **Wallet Connection** - MetaMask integration with network detection
- ✅ **Artwork Submission** - Submit artworks with encrypted metadata
- ✅ **Expert Authentication** - Register and authenticate artworks as an expert
- ✅ **Admin Panel** - Verify experts and manage platform operations
- ✅ **Fully Encrypted** - All sensitive data encrypted using FHE
- ✅ **Responsive Design** - Mobile-friendly UI with modern CSS

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- MetaMask browser extension
- Sepolia testnet ETH (get from [Sepolia faucet](https://sepoliafaucet.com/))

### Installation

```bash
# Navigate to the project directory
cd examples/FHEAnonymousArtAuthentication-react

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
# Build the application
npm run build

# Preview production build
npm run preview
```

## 📦 Project Structure

```
FHEAnonymousArtAuthentication-react/
├── src/
│   ├── components/          # React components
│   │   ├── WalletConnect.tsx       # Wallet connection UI
│   │   ├── ArtworkSubmission.tsx   # Submit artworks
│   │   ├── ExpertAuthentication.tsx # Expert features
│   │   └── AdminPanel.tsx          # Admin functions
│   ├── context/             # React context
│   │   └── FHEContext.tsx          # FHE provider & wallet state
│   ├── types/               # TypeScript types
│   │   └── index.ts               # Type definitions
│   ├── utils/               # Utilities
│   │   └── contract.ts            # Contract ABI & config
│   ├── App.tsx              # Main app component
│   ├── App.css              # Global styles
│   └── main.tsx             # Entry point
├── index.html               # HTML template
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript config
├── vite.config.ts           # Vite configuration
└── README.md                # This file
```

## 🔧 Technology Stack

- **React 18.3** - Modern React with hooks
- **TypeScript 5.5** - Type-safe development
- **Vite 5** - Fast build tool with HMR
- **ethers.js 6.14** - Ethereum library
- **@anonymous-art/fhevm-sdk** - FHEVM SDK for encryption
- **Zama fhEVM** - Fully Homomorphic Encryption on Ethereum

## 💡 Usage Guide

### 1. Connect Wallet

1. Click "Connect Wallet" button
2. Approve MetaMask connection
3. Ensure you're on Sepolia testnet
4. Wait for FHE initialization

### 2. Submit Artwork (Artwork Owner)

1. Fill in artwork details:
   - Title, Artist, Year
   - Art Style, Materials
   - Condition Score (0-100)
   - Required Consensus (51-100%)
2. Click "Submit Artwork"
3. Approve transaction in MetaMask
4. Note your Artwork ID

### 3. Register as Expert

1. Go to "Expert Authentication" tab
2. Click "Register as Expert"
3. Set your expertise level (0-100)
4. Submit registration
5. Wait for admin verification

### 4. Authenticate Artwork (Verified Expert)

1. Enter Artwork ID
2. Set Authenticity Score (0-100)
3. Set Confidence Level (0-100)
4. Submit authentication
5. Transaction confirmed on blockchain

### 5. Verify Experts (Admin Only)

1. Go to "Admin Panel"
2. Enter Expert ID to verify
3. Submit verification
4. Expert can now authenticate artworks

## 🔐 Privacy Features

This application demonstrates real-world FHE implementation:

- **Encrypted Metadata** - Artwork details remain encrypted on-chain
- **Anonymous Authentication** - Experts can't see sensitive artwork info
- **Zero-Knowledge Consensus** - Compute on encrypted data without decryption
- **Bias-Free Evaluation** - No artist name or value visible to experts

## 🌐 Smart Contract

- **Contract Address**: `0x4D874585f820437656554590C812b672305fbb72`
- **Network**: Sepolia Testnet
- **Explorer**: [View on Etherscan](https://sepolia.etherscan.io/address/0x4D874585f820437656554590C812b672305fbb72)

## 🎯 Key Differences from Vanilla Version

### Improvements in React Version

1. **Component Architecture** - Modular, reusable components
2. **State Management** - React Context API for global state
3. **Type Safety** - Full TypeScript support
4. **Developer Experience** - Hot Module Replacement (HMR)
5. **Code Organization** - Clear separation of concerns
6. **Maintainability** - Easier to extend and maintain

### Code Comparison

**Vanilla JS (Before):**
```javascript
// Direct DOM manipulation
document.getElementById('connectBtn').onclick = async () => {
  // Connect wallet logic
};
```

**React (After):**
```typescript
// Component-based with hooks
const WalletConnect: React.FC = () => {
  const { connectWallet } = useFHE();
  return <button onClick={connectWallet}>Connect Wallet</button>;
};
```

## 🧪 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Adding New Features

1. Create component in `src/components/`
2. Add types to `src/types/index.ts`
3. Update context if needed in `src/context/FHEContext.tsx`
4. Import and use in `src/App.tsx`

## 📚 Related Documentation

- [FHEVM SDK Documentation](../../packages/fhevm-sdk/README.md)
- [React Hooks Documentation](../../packages/fhevm-react/README.md)
- [Zama fhEVM Docs](https://docs.zama.ai/fhevm)
- [Original Vanilla Version](../FHEAnonymousArtAuthentication/)

## 🤝 Contributing

This is an example application demonstrating best practices for React + FHE development. Feel free to use it as a template for your own projects!

## 📄 License

MIT License - See root LICENSE file for details

---

**Built with ❤️ using React, TypeScript, and Fully Homomorphic Encryption**

*Making art authentication fair, transparent, and privacy-preserving*
