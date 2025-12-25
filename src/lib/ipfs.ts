/**
 * IPFS Utilities using Pinata SDK v2
 *
 * Handles uploading images and metadata to IPFS for NFT minting.
 */

import { PinataSDK } from "pinata";

// Initialize Pinata client
const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT!,
  pinataGateway: process.env.PINATA_GATEWAY || "gateway.pinata.cloud",
});

export interface NFTMetadata {
  name: string;
  description: string;
  image: string; // IPFS URI
  external_url?: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
}

/**
 * Upload an image to IPFS from a URL
 */
export async function uploadImageToIPFS(imageUrl: string): Promise<string> {
  // Fetch image from URL
  const response = await fetch(imageUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.statusText}`);
  }

  const blob = await response.blob();
  const file = new File([blob], `fof-${Date.now()}.png`, { type: "image/png" });

  // Upload to IPFS via Pinata (SDK v2 uses upload.public.file)
  const upload = await pinata.upload.public.file(file);

  return `ipfs://${upload.cid}`;
}

/**
 * Upload NFT metadata to IPFS
 */
export async function uploadMetadataToIPFS(
  metadata: NFTMetadata
): Promise<string> {
  // SDK v2 uses upload.public.json
  const upload = await pinata.upload.public.json(metadata);
  return `ipfs://${upload.cid}`;
}

/**
 * Build NFT metadata for a FOF generation
 */
export function buildNFTMetadata({
  username,
  fid,
  friendCount,
  imageIpfsUri,
  generationId,
}: {
  username: string;
  fid: number;
  friendCount: number;
  imageIpfsUri: string;
  generationId?: string;
}): NFTMetadata {
  return {
    name: `FOF - @${username}`,
    description: `Friends of Farcaster - A unique portrait featuring @${username} and ${friendCount} of their closest Farcaster friends. Generated with AI for the Christmas 2025 edition.`,
    image: imageIpfsUri,
    external_url: generationId
      ? `https://fof.app/share/${generationId}`
      : "https://fof.app",
    attributes: [
      { trait_type: "Edition", value: "Christmas 2025" },
      { trait_type: "Username", value: username },
      { trait_type: "FID", value: fid },
      { trait_type: "Friend Count", value: friendCount },
      {
        trait_type: "Generated Date",
        value: new Date().toISOString().split("T")[0],
      },
    ],
  };
}

/**
 * Full flow: Upload image and metadata, return token URI
 */
export async function prepareNFTForMinting({
  imageUrl,
  username,
  fid,
  friendCount,
  generationId,
}: {
  imageUrl: string;
  username: string;
  fid: number;
  friendCount: number;
  generationId?: string;
}): Promise<{
  tokenUri: string;
  imageUri: string;
}> {
  // 1. Upload image to IPFS
  const imageUri = await uploadImageToIPFS(imageUrl);

  // 2. Build metadata with IPFS image URI
  const metadata = buildNFTMetadata({
    username,
    fid,
    friendCount,
    imageIpfsUri: imageUri,
    generationId,
  });

  // 3. Upload metadata to IPFS
  const tokenUri = await uploadMetadataToIPFS(metadata);

  return { tokenUri, imageUri };
}
