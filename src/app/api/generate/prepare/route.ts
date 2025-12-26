import { NextResponse } from "next/server";
import { getFriendsForFOF, getProfilePictureUrls } from "@/lib/neynar";
import { buildFOFPrompt } from "@/lib/prompts";
import { prisma } from "@/lib/db";
import { withAuth } from "@/lib/auth";

/**
 * POST /api/generate/prepare
 *
 * Protected route - requires Quick Auth
 *
 * 1. Uses authenticated FID from JWT
 * 2. Fetches friends from Neynar
 * 3. Upserts user in DB
 * 4. Builds prompt
 * 5. Returns data needed for client-side generation
 */
export const POST = withAuth(async (request, auth) => {
  try {
    // Use authenticated FID from JWT - ignore any FID in body
    const fid = auth.fid;

    // 1. Fetch user's friends via Neynar
    const { user, friends } = await getFriendsForFOF(fid);

    if (friends.length === 0) {
      return NextResponse.json(
        { error: "No friends found. Follow some people who follow you back!" },
        { status: 400 }
      );
    }

    // 2. Upsert user in database (update profile if changed)
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

    // Filter to max 9 friends (user request: fetch top 9 friends)
    const usedFriends = friends.slice(0, 9);

    return NextResponse.json({
      userId: dbUser.id,
      username: user.username,
      friendCount: usedFriends.length,
      friendFids: usedFriends.map((f) => f.fid),
      prompt,
      imageUrls: profilePictureUrls.slice(0, 9), // user + 8 friends
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
});
