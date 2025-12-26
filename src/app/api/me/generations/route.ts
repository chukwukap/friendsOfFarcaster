import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { withAuth } from "@/lib/auth";

/**
 * GET /api/me/generations
 *
 * Protected route - requires Quick Auth
 *
 * Returns the authenticated user's generations and total points
 */
export const GET = withAuth(async (request, auth) => {
  try {
    // Fetch user's generations ordered by newest first
    const generations = await prisma.generation.findMany({
      where: { userId: auth.userId },
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

    // Get user's total points
    const user = await prisma.user.findUnique({
      where: { id: auth.userId },
      select: { points: true },
    });

    return NextResponse.json({
      generations,
      totalPoints: user?.points ?? 0,
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
