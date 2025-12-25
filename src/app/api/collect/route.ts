import { NextRequest, NextResponse } from "next/server";
import { prepareNFTForMinting } from "@/lib/ipfs";
import { prisma } from "@/lib/db";

console.log("[API] /api/collect route module loaded");

/**
 * POST /api/collect
 * Prepares NFT for minting (IPFS upload) and stores tokenUri on generation.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageUrl, username, fid, friendCount, generationId } = body;

    if (!imageUrl || !username || !fid || !generationId) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: imageUrl, username, fid, generationId",
        },
        { status: 400 }
      );
    }

    if (!process.env.PINATA_JWT) {
      console.error("PINATA_JWT not configured");
      return NextResponse.json(
        { error: "IPFS service not configured" },
        { status: 500 }
      );
    }

    console.log(`Preparing NFT for @${username} (FID: ${fid})`);

    // Upload to IPFS
    const { tokenUri, imageUri } = await prepareNFTForMinting({
      imageUrl,
      username,
      fid,
      friendCount: friendCount || 0,
      generationId: generationId.toString(),
    });

    // Store tokenUri on generation
    await prisma.generation.update({
      where: { id: parseInt(generationId, 10) },
      data: { nftTokenUri: tokenUri },
    });

    console.log(`NFT prepared: ${tokenUri}`);

    return NextResponse.json({
      success: true,
      tokenUri,
      imageUri,
    });
  } catch (error) {
    console.error("Error preparing NFT:", error);
    return NextResponse.json(
      {
        error: "Failed to prepare NFT",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/collect
 * Updates generation with NFT minting tx details after on-chain mint.
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { generationId, txHash, tokenId } = body;

    if (!generationId || !txHash) {
      return NextResponse.json(
        { error: "Missing generationId or txHash" },
        { status: 400 }
      );
    }

    // Update generation with NFT details and award points
    const generation = await prisma.generation.update({
      where: { id: parseInt(generationId, 10) },
      data: {
        nftTxHash: txHash,
        nftTokenId: tokenId?.toString() || null,
      },
      include: { user: true },
    });

    // Award 50 points for collecting
    await prisma.user.update({
      where: { id: generation.userId },
      data: { points: { increment: 50 } },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating NFT:", error);
    return NextResponse.json(
      { error: "Failed to update NFT" },
      { status: 500 }
    );
  }
}
