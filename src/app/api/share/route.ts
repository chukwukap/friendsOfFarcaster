import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { withAuth, type ApiError } from "@/lib/auth";

/**
 * POST /api/share
 *
 * Protected route - requires Quick Auth
 *
 * Records share on generation and awards points.
 * Verifies that the generation belongs to the authenticated user.
 */
export const POST = withAuth(async (request, auth) => {
  try {
    const body = await request.json();
    const { generationId, platform, castHash } = body;

    if (!generationId || !platform) {
      return NextResponse.json(
        { error: "Missing required fields: generationId, platform" },
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

    // Verify that the generation belongs to the authenticated user
    if (generation.userId !== auth.userId) {
      return NextResponse.json<ApiError>(
        { error: "Cannot share another user's generation", code: "FORBIDDEN" },
        { status: 403 }
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
      where: { id: auth.userId },
      data: { points: { increment: 25 } },
    });

    console.log(
      `Share recorded: FID ${auth.fid}, Generation ${generationId}, Platform ${platform}`
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
});
