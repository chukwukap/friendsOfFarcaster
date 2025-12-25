import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * POST /api/share
 * Records share on generation and awards points.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fid, generationId, platform, castHash } = body;

    if (!fid || !generationId || !platform) {
      return NextResponse.json(
        { error: "Missing required fields: fid, generationId, platform" },
        { status: 400 }
      );
    }

    // Get generation
    const generation = await prisma.generation.findUnique({
      where: { id: parseInt(generationId, 10) },
    });

    if (!generation) {
      return NextResponse.json(
        { error: "Generation not found" },
        { status: 404 }
      );
    }

    // Update generation with share info
    const updateData: Record<string, unknown> = {
      shareCount: { increment: 1 },
    };

    if (platform === "FARCASTER") {
      updateData.sharedOnFarcaster = true;
      if (castHash) updateData.farcasterCastHash = castHash;
    }

    await prisma.generation.update({
      where: { id: generation.id },
      data: updateData,
    });

    // Award 25 points for sharing
    await prisma.user.update({
      where: { id: generation.userId },
      data: { points: { increment: 25 } },
    });

    console.log(
      `Share recorded: FID ${fid}, Generation ${generationId}, Platform ${platform}`
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error recording share:", error);
    return NextResponse.json(
      {
        error: "Failed to record share",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
