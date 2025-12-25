import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * POST /api/share
 *
 * Records when a user shares their FOF generation on social platforms.
 * Awards points for sharing.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fid, generationId, platform, castHash } = body;

    // Validate required fields
    if (!fid || !generationId || !platform) {
      return NextResponse.json(
        { error: "Missing required fields: fid, generationId, platform" },
        { status: 400 }
      );
    }

    // Validate platform
    const validPlatforms = ["FARCASTER", "TWITTER", "DOWNLOAD"];
    if (!validPlatforms.includes(platform)) {
      return NextResponse.json(
        {
          error: `Invalid platform. Must be one of: ${validPlatforms.join(
            ", "
          )}`,
        },
        { status: 400 }
      );
    }

    // 1. Get user
    const user = await prisma.user.findUnique({
      where: { fid: parseInt(fid, 10) },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 2. Get generation
    const generation = await prisma.generation.findUnique({
      where: { id: parseInt(generationId, 10) },
    });

    if (!generation) {
      return NextResponse.json(
        { error: "Generation not found" },
        { status: 404 }
      );
    }

    // 3. Create share record
    const share = await prisma.share.create({
      data: {
        userId: user.id,
        generationId: generation.id,
        platform,
        castHash: castHash || null,
        points: 25,
      },
    });

    // 4. Award points to user
    await prisma.user.update({
      where: { id: user.id },
      data: {
        points: { increment: 25 },
      },
    });

    return NextResponse.json({
      success: true,
      shareId: share.id,
      pointsAwarded: 25,
    });
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
