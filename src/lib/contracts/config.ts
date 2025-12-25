import { base, baseSepolia } from "viem/chains";

// ============================================================================
// NETWORK CONFIGURATION
// ============================================================================
// Set NEXT_PUBLIC_CHAIN_NETWORK in your .env file:
//   - "testnet" for Base Sepolia (development)
//   - "mainnet" for Base (production)
// ============================================================================

type NetworkConfig = {
  chain: typeof base | typeof baseSepolia;
  chainId: number;
  name: string;
  explorerUrl: string;
  usdc: `0x${string}`;
  treasury: `0x${string}`;
};

// Default treasury wallet (can be overridden in env)
const DEFAULT_TREASURY = "0xEa99418E4f419108619f2D4FF262e43231f05d11" as const;

const TESTNET_CONFIG: NetworkConfig = {
  chain: baseSepolia,
  chainId: baseSepolia.id,
  name: "Base Sepolia",
  explorerUrl: "https://sepolia.basescan.org",
  // TestUSDC with faucet function (same as Waffles)
  usdc: "0x8aAa7ECea87244Ca4062eBce6DA61820f3830233",
  treasury:
    (process.env.NEXT_PUBLIC_TREASURY_WALLET as `0x${string}`) ||
    DEFAULT_TREASURY,
};

const MAINNET_CONFIG: NetworkConfig = {
  chain: base,
  chainId: base.id,
  name: "Base",
  explorerUrl: "https://basescan.org",
  // Official USDC on Base mainnet
  usdc: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  treasury:
    (process.env.NEXT_PUBLIC_TREASURY_WALLET as `0x${string}`) ||
    DEFAULT_TREASURY,
};

// Read network from environment variable (default to testnet for safety)
const network = process.env.NEXT_PUBLIC_CHAIN_NETWORK || "testnet";
const isMainnet = network === "mainnet";

// Select the appropriate config based on environment
const NETWORK_CONFIG: NetworkConfig = isMainnet
  ? MAINNET_CONFIG
  : TESTNET_CONFIG;

// ============================================================================
// EXPORTS
// ============================================================================

export const CHAIN_CONFIG = {
  chain: NETWORK_CONFIG.chain,
  chainId: NETWORK_CONFIG.chainId,
  name: NETWORK_CONFIG.name,
  explorerUrl: NETWORK_CONFIG.explorerUrl,
  isMainnet,
  isTestnet: !isMainnet,
} as const;

export const TOKEN_CONFIG = {
  address: NETWORK_CONFIG.usdc,
  chainId: NETWORK_CONFIG.chainId,
  decimals: 6,
  symbol: "USDC",
} as const;

export const TREASURY_CONFIG = {
  address: NETWORK_CONFIG.treasury,
} as const;

// Helper to get explorer URLs
export const getExplorerUrl = {
  address: (addr: string) => `${CHAIN_CONFIG.explorerUrl}/address/${addr}`,
  tx: (hash: string) => `${CHAIN_CONFIG.explorerUrl}/tx/${hash}`,
};

// Price in USDC
export const GENERATION_PRICE = 1; // $1 USDC
