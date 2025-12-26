import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { withAuth } from "@/lib/auth";

/**
 * POST /api/generate/save
 *
 * Protected route - requires Quick Auth
 *
 * Saves the result of a client-side generation to the database
 * Uses authenticated userId from JWT for security
 */
export const POST = withAuth(async (request, auth) => {
  try {
    const body = await request.json();
    const { imageUrl, prompt, friendCount, friendFids, paymentTxHash } = body;

    // Use authenticated userId - ignore any userId in body
    const userId = auth.userId;

    if (!imageUrl || !prompt) {
      return NextResponse.json(
        { error: "Missing required fields: imageUrl, prompt" },
        { status: 400 }
      );
    }

    // Save generation to database
    const generation = await prisma.generation.create({
      data: {
        userId,
        imageUrl,
        friendCount: friendCount || 0,
        friendFids: friendFids || [],
        prompt,
        model: "fal-ai/nano-banana-pro/edit",
        paymentTxHash: paymentTxHash || null,
        paymentAmount: paymentTxHash ? 1.0 : null,
      },
    });

    // Award points to user
    await prisma.user.update({
      where: { id: userId },
      data: { points: { increment: 100 } },
    });

    return NextResponse.json({
      success: true,
      generationId: generation.id,
    });
  } catch (error) {
    console.error("Error saving generation:", error);
    return NextResponse.json(
      {
        error: "Failed to save generation",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
});
