import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { FhevmClient } from '@anonymous-art/fhevm-sdk';
import { ethers } from 'ethers';
import { WalletState } from '../types';

interface FHEContextType {
  client: FhevmClient | null;
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
  wallet: WalletState;
  provider: ethers.BrowserProvider | null;
  signer: ethers.Signer | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

const FHEContext = createContext<FHEContextType | undefined>(undefined);

export const useFHE = () => {
  const context = useContext(FHEContext);
  if (!context) {
    throw new Error('useFHE must be used within FHEProvider');
  }
  return context;
};

interface FHEProviderProps {
  children: ReactNode;
}

export const FHEProvider: React.FC<FHEProviderProps> = ({ children }) => {
  const [client, setClient] = useState<FhevmClient | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [wallet, setWallet] = useState<WalletState>({
    address: null,
    chainId: null,
    isConnected: false
  });

  const connectWallet = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!window.ethereum) {
        throw new Error('MetaMask is not installed. Please install MetaMask to use this application.');
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found. Please unlock MetaMask.');
      }

      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      const network = await browserProvider.getNetwork();
      const walletSigner = await browserProvider.getSigner();

      setProvider(browserProvider);
      setSigner(walletSigner);
      setWallet({
        address: accounts[0],
        chainId: Number(network.chainId),
        isConnected: true
      });

      // Initialize FHEVM client
      const fhevmClient = await FhevmClient.fromWeb3Provider(window.ethereum);
      await fhevmClient.initialize();

      setClient(fhevmClient);
      setIsInitialized(true);

      console.log('✅ Wallet connected and FHE initialized');
    } catch (err: any) {
      console.error('Connection error:', err);
      setError(err.message || 'Failed to connect wallet');
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = () => {
    setWallet({
      address: null,
      chainId: null,
      isConnected: false
    });
    setProvider(null);
    setSigner(null);
    setClient(null);
    setIsInitialized(false);
  };

  // Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else if (accounts[0] !== wallet.address) {
          connectWallet();
        }
      };

      const handleChainChanged = () => {
        window.location.reload();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [wallet.address]);

  const value: FHEContextType = {
    client,
    isInitialized,
    isLoading,
    error,
    wallet,
    provider,
    signer,
    connectWallet,
    disconnectWallet
  };

  return <FHEContext.Provider value={value}>{children}</FHEContext.Provider>;
};
