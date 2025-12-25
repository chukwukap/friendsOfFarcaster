import { NextRequest, NextResponse } from "next/server";
import { getFriendsForFOF, getProfilePictureUrls } from "@/lib/neynar";
import { generateFOFWithReferences } from "@/lib/fal";
import { buildFOFPrompt } from "@/lib/prompts";
import { prisma } from "@/lib/db";

export const maxDuration = 60; // Allow up to 60 seconds for generation

/**
 * POST /api/generate
 * Generates FOF image for a user with their friends
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const body = await request.json();
    const { fid } = body;

    if (!fid) {
      return NextResponse.json(
        { error: "Missing fid in request body" },
        { status: 400 }
      );
    }

    // 1. Fetch user's friends via Neynar
    console.log(`Fetching friends for FID: ${fid}`);
    const { user, friends } = await getFriendsForFOF(fid);

    if (friends.length === 0) {
      return NextResponse.json(
        { error: "No friends found. Follow some people who follow you back!" },
        { status: 400 }
      );
    }

    // 2. Upsert user in database
    const dbUser = await prisma.user.upsert({
      where: { fid },
      update: {
        username: user.username,
        displayName: user.displayName,
        pfpUrl: user.pfpUrl,
      },
      create: {
        fid,
        username: user.username,
        displayName: user.displayName,
        pfpUrl: user.pfpUrl,
      },
    });

    // 3. Get profile picture URLs for image-to-image
    const profilePictureUrls = getProfilePictureUrls(user, friends);
    console.log(
      `Found ${profilePictureUrls.length} profile pictures for generation`
    );

    // 4. Build personalized prompt
    const prompt = buildFOFPrompt(user, friends);
    console.log("Generated prompt:", prompt);

    // 5. Generate image with Fal.ai using friend references
    console.log("Starting image generation...");
    const result = await generateFOFWithReferences(prompt, profilePictureUrls);
    console.log("Image generated:", result.imageUrl);

    const duration = Date.now() - startTime;

    // 6. Save generation to database
    const generation = await prisma.generation.create({
      data: {
        userId: dbUser.id,
        imageUrl: result.imageUrl,
        prompt,
        friendCount: friends.length,
        friendFids: friends.map((f) => f.fid),
        model: "fal-ai/nano-banana-pro/edit",
        duration,
        points: 100,
        status: "COMPLETED",
      },
    });

    // 7. Award points to user
    await prisma.user.update({
      where: { id: dbUser.id },
      data: {
        points: { increment: 100 },
      },
    });

    return NextResponse.json({
      success: true,
      generationId: generation.id,
      imageUrl: result.imageUrl,
      user: {
        fid: user.fid,
        username: user.username,
        displayName: user.displayName,
        pfpUrl: user.pfpUrl,
      },
      friendCount: friends.length,
      seed: result.seed,
      pointsAwarded: 100,
    });
  } catch (error) {
    console.error("Error generating FOF image:", error);

    // Log failed generation attempt if we have context
    // (error handling for DB operations)

    return NextResponse.json(
      {
        error: "Failed to generate image",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
