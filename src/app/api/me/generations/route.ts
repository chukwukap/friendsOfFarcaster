import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { withAuth } from "@/lib/auth";

/**
 * GET /api/me/generations
 *
 * Protected route - requires Quick Auth
 *
 * Returns the authenticated user's generations and total points
 * Uses FID for lookup to handle cases where user might not exist in DB yet
 */
export const GET = withAuth(async (request, auth) => {
  try {
    // Find user by FID first
    const user = await prisma.user.findUnique({
      where: { fid: auth.fid },
      select: {
        id: true,
        points: true,
      },
    });

    // If user doesn't exist, return empty gallery
    if (!user) {
      return NextResponse.json({
        generations: [],
        totalPoints: 0,
      });
    }

    // Fetch user's generations ordered by newest first
    const generations = await prisma.generation.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        imageUrl: true,
        friendCount: true,
        sharedOnFarcaster: true,
        shareCount: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      generations,
      totalPoints: user.points ?? 0,
    });
  } catch (error) {
    console.error("Error fetching generations:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch generations",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
});
