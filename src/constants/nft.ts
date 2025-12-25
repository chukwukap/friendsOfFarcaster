/**
 * NFT Contract Configuration
 *
 * ERC-1155 contract deployed via thirdweb dashboard.
 * Update NFT_CONTRACT_ADDRESS after deploying.
 */

import { parseAbi } from "viem";
import { base, baseSepolia } from "viem/chains";

// Contract addresses - update after deploying
export const NFT_CONTRACT_ADDRESS = {
  // Testnet (Base Sepolia)
  testnet: process.env.NEXT_PUBLIC_NFT_CONTRACT_TESTNET as `0x${string}`,
  // Mainnet (Base)
  mainnet: process.env.NEXT_PUBLIC_NFT_CONTRACT_MAINNET as `0x${string}`,
};

// Get contract address based on environment
export function getNFTContractAddress(): `0x${string}` {
  const isMainnet = process.env.NEXT_PUBLIC_NETWORK === "mainnet";
  return isMainnet
    ? NFT_CONTRACT_ADDRESS.mainnet
    : NFT_CONTRACT_ADDRESS.testnet;
}

// Get chain based on environment
export function getNFTChain() {
  const isMainnet = process.env.NEXT_PUBLIC_NETWORK === "mainnet";
  return isMainnet ? base : baseSepolia;
}

// ABI for thirdweb Edition Drop (ERC-1155)
// This is a minimal ABI with the functions we need
export const NFT_CONTRACT_ABI = parseAbi([
  // Claim/mint function for thirdweb Edition Drop
  "function claim(address receiver, uint256 tokenId, uint256 quantity, address currency, uint256 pricePerToken, (bytes32[] proof, uint256 quantityLimitPerWallet, uint256 pricePerToken, address currency) allowlistProof, bytes memory data) external payable",

  // Simple mint function (if using custom contract)
  "function mint(address to, string calldata tokenURI) external returns (uint256)",

  // View functions
  "function uri(uint256 tokenId) external view returns (string memory)",
  "function balanceOf(address account, uint256 id) external view returns (uint256)",
  "function totalSupply(uint256 id) external view returns (uint256)",

  // Events
  "event TokensMinted(address indexed mintedTo, uint256 indexed tokenId, uint256 quantity)",
]);

// Simplified ABI for just minting
export const MINT_ABI = parseAbi([
  "function mint(address to, string calldata tokenURI) external returns (uint256)",
]);
