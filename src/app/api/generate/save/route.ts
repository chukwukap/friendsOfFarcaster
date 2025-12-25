import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * POST /api/generate/save
 *
 * Saves the result of a client-side generation to the database
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, imageUrl, prompt, friendCount, friendFids, paymentTxHash } =
      body;

    if (!userId || !imageUrl || !prompt) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Save generation to database
    const generation = await prisma.generation.create({
      data: {
        userId: parseInt(userId.toString(), 10),
        imageUrl,
        friendCount: friendCount || 0,
        friendFids: friendFids || [],
        prompt,
        model: "fal-ai/flux-pro/v1.1",
        paymentTxHash: paymentTxHash || null,
        paymentAmount: paymentTxHash ? 1.0 : null,
      },
    });

    // Award points to user
    await prisma.user.update({
      where: { id: parseInt(userId.toString(), 10) },
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
}
