import React from 'react';
import { useFHE } from '../context/FHEContext';
import { SEPOLIA_CHAIN_ID } from '../utils/contract';

export const WalletConnect: React.FC = () => {
  const { wallet, isLoading, error, connectWallet, disconnectWallet } = useFHE();

  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const isCorrectNetwork = wallet.chainId === SEPOLIA_CHAIN_ID;

  return (
    <div className="connection-status">
      {!wallet.isConnected ? (
        <div>
          <p style={{ marginBottom: '15px' }}>
            Connect your wallet to access the Anonymous Art Authentication Platform
          </p>
          <button
            className="btn"
            onClick={connectWallet}
            disabled={isLoading}
          >
            {isLoading ? 'Connecting...' : '🔗 Connect Wallet'}
          </button>
          {error && (
            <div className="error-message" style={{ marginTop: '10px', color: '#ff6b6b' }}>
              ⚠️ {error}
            </div>
          )}
        </div>
      ) : (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', flexWrap: 'wrap' }}>
            <div>
              <strong>Connected:</strong> {formatAddress(wallet.address!)}
            </div>
            <div>
              <strong>Network:</strong> {isCorrectNetwork ? '✅ Sepolia' : '❌ Wrong Network'}
            </div>
            <button
              className="btn btn-secondary"
              onClick={disconnectWallet}
              style={{ padding: '8px 20px', fontSize: '14px' }}
            >
              Disconnect
            </button>
          </div>
          {!isCorrectNetwork && (
            <div className="error-message" style={{ marginTop: '10px', color: '#ff6b6b' }}>
              ⚠️ Please switch to Sepolia testnet to use this application
            </div>
          )}
        </div>
      )}
    </div>
  );
};
