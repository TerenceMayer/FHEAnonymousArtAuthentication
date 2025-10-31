// Contract Configuration
export const CONTRACT_ADDRESS = '0x4D874585f820437656554590C812b672305fbb72'; // Sepolia testnet

export const CONTRACT_ABI = [
  "function owner() view returns (address)",
  "function nextArtworkId() view returns (uint256)",
  "function nextExpertId() view returns (uint256)",
  "function submitArtwork(uint32 _metadataHash, uint8 _condition, uint256 _requiredConsensus) returns (uint256)",
  "function registerExpert(uint8 _credentials) returns (uint256)",
  "function submitAuthentication(uint256 _artworkId, uint8 _authenticity, uint8 _confidence)",
  "function verifyExpert(uint256 _expertId)",
  "function getArtwork(uint256 _artworkId) view returns (tuple(uint256 id, address owner, bytes encryptedMetadata, bytes encryptedCondition, bool isSubmitted, bool isAuthenticated, uint256 submissionTime, uint256 authenticationCount, uint256 expertConsensus))",
  "function getExpert(uint256 _expertId) view returns (tuple(uint256 id, address expertAddress, bytes encryptedCredentials, bool isVerified, uint256 authenticationsCompleted, uint256 successRate))",
  "function artworks(uint256) view returns (uint256 id, address owner, bool isSubmitted, bool isAuthenticated, uint256 submissionTime, uint256 authenticationCount, uint256 expertConsensus)",
  "function experts(uint256) view returns (uint256 id, address expertAddress, bool isVerified, uint256 authenticationsCompleted, uint256 successRate)",
  "event ArtworkSubmitted(uint256 indexed artworkId, address indexed owner)",
  "event ExpertRegistered(uint256 indexed expertId, address indexed expert)",
  "event AuthenticationSubmitted(uint256 indexed artworkId, uint256 indexed expertId)",
  "event ArtworkAuthenticated(uint256 indexed artworkId, bool isAuthentic, uint256 finalScore)",
  "event ExpertVerified(uint256 indexed expertId, address indexed expert)"
];

export const SEPOLIA_CHAIN_ID = 11155111;

export const NETWORK_CONFIG = {
  chainId: `0x${SEPOLIA_CHAIN_ID.toString(16)}`,
  chainName: 'Sepolia Test Network',
  nativeCurrency: {
    name: 'Sepolia ETH',
    symbol: 'ETH',
    decimals: 18
  },
  rpcUrls: ['https://sepolia.infura.io/v3/'],
  blockExplorerUrls: ['https://sepolia.etherscan.io']
};
