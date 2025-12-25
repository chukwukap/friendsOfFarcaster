import { NextRequest, NextResponse } from "next/server";
import { prepareNFTForMinting } from "@/lib/ipfs";
import { prisma } from "@/lib/db";
import { getNFTContractAddress, getNFTChain } from "@/constants/nft";

/**
 * POST /api/collect
 *
 * Prepares an NFT for minting by:
 * 1. Uploading the generated image to IPFS
 * 2. Creating and uploading NFT metadata to IPFS
 * 3. Creating Collection record in database
 * 4. Returning the token URI for minting
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageUrl, username, fid, friendCount, generationId } = body;

    // Validate required fields
    if (!imageUrl || !username || !fid || !generationId) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: imageUrl, username, fid, generationId",
        },
        { status: 400 }
      );
    }

    // Check PINATA_JWT is configured
    if (!process.env.PINATA_JWT) {
      console.error("PINATA_JWT not configured");
      return NextResponse.json(
        { error: "IPFS service not configured" },
        { status: 500 }
      );
    }

    console.log(`Preparing NFT for @${username} (FID: ${fid})`);

    // 1. Get user from database
    const user = await prisma.user.findUnique({
      where: { fid: parseInt(fid, 10) },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 2. Get generation from database
    const generation = await prisma.generation.findUnique({
      where: { id: parseInt(generationId, 10) },
    });

    if (!generation) {
      return NextResponse.json(
        { error: "Generation not found" },
        { status: 404 }
      );
    }

    // 3. Check if already collected
    const existingCollection = await prisma.collection.findUnique({
      where: { generationId: generation.id },
    });

    if (existingCollection) {
      return NextResponse.json(
        { error: "Already collected as NFT" },
        { status: 409 }
      );
    }

    // 4. Upload to IPFS and prepare metadata
    const { tokenUri, imageUri } = await prepareNFTForMinting({
      imageUrl,
      username,
      fid,
      friendCount: friendCount || 0,
      generationId: generationId.toString(),
    });

    console.log(`NFT prepared: ${tokenUri}`);

    // 5. Create Collection record (status: PENDING until tx confirmed)
    const collection = await prisma.collection.create({
      data: {
        userId: user.id,
        generationId: generation.id,
        chainId: getNFTChain().id,
        contractAddress: getNFTContractAddress(),
        tokenUri,
        status: "PENDING",
        points: 50,
      },
    });

    // 6. Award points to user
    await prisma.user.update({
      where: { id: user.id },
      data: {
        points: { increment: 50 },
      },
    });

    return NextResponse.json({
      success: true,
      collectionId: collection.id,
      tokenUri,
      imageUri,
      message: "NFT metadata ready for minting",
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
 *
 * Updates collection status after minting transaction
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { collectionId, txHash, tokenId, status } = body;

    if (!collectionId) {
      return NextResponse.json(
        { error: "Missing collectionId" },
        { status: 400 }
      );
    }

    const updateData: Record<string, unknown> = {};

    if (txHash) updateData.txHash = txHash;
    if (tokenId) updateData.tokenId = BigInt(tokenId);
    if (status) updateData.status = status;
    if (status === "COMPLETED") updateData.mintedAt = new Date();

    const collection = await prisma.collection.update({
      where: { id: parseInt(collectionId, 10) },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      collection,
    });
  } catch (error) {
    console.error("Error updating collection:", error);
    return NextResponse.json(
      { error: "Failed to update collection" },
      { status: 500 }
    );
  }
}
