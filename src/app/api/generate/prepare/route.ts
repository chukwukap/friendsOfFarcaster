import { NextRequest, NextResponse } from "next/server";
import { getFriendsForFOF, getProfilePictureUrls } from "@/lib/neynar";
import { buildFOFPrompt } from "@/lib/prompts";
import { prisma } from "@/lib/db";

/**
 * POST /api/generate/prepare
 *
 * 1. Fetches friends from Neynar
 * 2. Upserts user in DB
 * 3. Builds prompt
 * 4. Returns data needed for client-side generation
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fid } = body;

    if (!fid) {
      return NextResponse.json({ error: "Missing fid" }, { status: 400 });
    }

    // 1. Fetch user's friends via Neynar
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

    // 3. Get profile picture URLs
    const profilePictureUrls = getProfilePictureUrls(user, friends);

    // 4. Build prompt
    const prompt = buildFOFPrompt(user, friends);

    return NextResponse.json({
      userId: dbUser.id,
      username: user.username,
      friendCount: friends.length,
      friendFids: friends.map((f) => f.fid),
      prompt,
      imageUrls: profilePictureUrls.slice(0, 9), // Use top 9 friends max
    });
  } catch (error) {
    console.error("Error preparing generation:", error);
    return NextResponse.json(
      {
        error: "Failed to prepare generation",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
