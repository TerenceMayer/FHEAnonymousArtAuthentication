export interface Artwork {
  id: number;
  owner: string;
  encryptedMetadata: string;
  encryptedCondition: string;
  isSubmitted: boolean;
  isAuthenticated: boolean;
  submissionTime: number;
  authenticationCount: number;
  expertConsensus: number;
}

export interface Expert {
  id: number;
  expertAddress: string;
  encryptedCredentials: string;
  isVerified: boolean;
  authenticationsCompleted: number;
  successRate: number;
}

export interface Authentication {
  artworkId: number;
  expertId: number;
  encryptedAuthenticity: string;
  encryptedConfidence: string;
  isSubmitted: boolean;
  timestamp: number;
}

export interface WalletState {
  address: string | null;
  chainId: number | null;
  isConnected: boolean;
}

export interface FormState {
  isSubmitting: boolean;
  error: string | null;
  success: string | null;
}
