import React from 'react';
import { FHEProvider } from './context/FHEContext';
import { WalletConnect } from './components/WalletConnect';
import { ArtworkSubmission } from './components/ArtworkSubmission';
import { ExpertAuthentication } from './components/ExpertAuthentication';
import { AdminPanel } from './components/AdminPanel';
import './App.css';

function App() {
  return (
    <FHEProvider>
      <div className="container">
        {/* Header */}
        <div className="header">
          <h1>🎨 Anonymous Artwork Authentication Platform</h1>
          <p>Bias-Free Art Authentication Using Fully Homomorphic Encryption</p>
          <p style={{ fontSize: '0.9em', opacity: 0.8, marginTop: '10px' }}>
            React Edition - Powered by fhEVM & Zama
          </p>
        </div>

        {/* Wallet Connection */}
        <WalletConnect />

        {/* Main Content */}
        <div className="main-content">
          <ArtworkSubmission />
          <ExpertAuthentication />
        </div>

        {/* Admin Section */}
        <div className="admin-section">
          <AdminPanel />
        </div>

        {/* Footer */}
        <footer className="footer">
          <div className="footer-content">
            <div className="footer-section">
              <h3>🔒 Privacy Features</h3>
              <ul>
                <li>✅ Encrypted artwork metadata</li>
                <li>✅ Anonymous expert authentication</li>
                <li>✅ Zero-knowledge consensus</li>
                <li>✅ Bias-free evaluation</li>
              </ul>
            </div>
            <div className="footer-section">
              <h3>🌐 Network Info</h3>
              <ul>
                <li><strong>Network:</strong> Sepolia Testnet</li>
                <li><strong>FHE:</strong> Zama fhEVM v0.6.0+</li>
                <li><strong>Framework:</strong> React 18 + TypeScript</li>
                <li><strong>SDK:</strong> @anonymous-art/fhevm-sdk</li>
              </ul>
            </div>
            <div className="footer-section">
              <h3>📚 Resources</h3>
              <ul>
                <li><a href="https://docs.zama.ai/fhevm" target="_blank" rel="noopener noreferrer">fhEVM Documentation</a></li>
                <li><a href="https://github.com/zama-ai" target="_blank" rel="noopener noreferrer">Zama GitHub</a></li>
                <li><a href="https://sepolia.etherscan.io" target="_blank" rel="noopener noreferrer">Sepolia Explorer</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>Built with ❤️ using Fully Homomorphic Encryption</p>
            <p style={{ fontSize: '0.9em', opacity: 0.8 }}>
              Making art authentication fair and transparent
            </p>
          </div>
        </footer>
      </div>
    </FHEProvider>
  );
}

export default App;
