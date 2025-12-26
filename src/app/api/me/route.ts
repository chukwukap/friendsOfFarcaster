import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { withAuth } from "@/lib/auth";
import { neynarClient } from "@/lib/neynar";

/**
 * GET /api/me
 *
 * Checks if the authenticated user exists in the database.
 * Used to determine if user has completed onboarding.
 */
export const GET = withAuth(async (request, auth) => {
  try {
    const fid = auth.fid;

    // Check if user exists in database
    const user = await prisma.user.findUnique({
      where: { fid },
      select: {
        id: true,
        fid: true,
        username: true,
        displayName: true,
        pfpUrl: true,
        points: true,
      },
    });

    if (!user) {
      return NextResponse.json({ exists: false }, { status: 200 });
    }

    return NextResponse.json({
      exists: true,
      user,
    });
  } catch (error) {
    console.error("Error checking user:", error);
    return NextResponse.json(
      { error: "Failed to check user" },
      { status: 500 }
    );
  }
});

/**
 * POST /api/me
 *
 * Creates or updates the authenticated user in the database.
 * Called during onboarding to ensure user exists before any other operations.
 */
export const POST = withAuth(async (request, auth) => {
  try {
    const fid = auth.fid;

    // Fetch user profile from Neynar
    const neynarUser = await neynarClient.fetchBulkUsers({
      fids: [fid],
    });

    const userData = neynarUser.users[0];
    if (!userData) {
      return NextResponse.json(
        { error: "User not found on Farcaster" },
        { status: 404 }
      );
    }

    // Upsert user in database
    const user = await prisma.user.upsert({
      where: { fid },
      update: {
        username: userData.username,
        displayName: userData.display_name,
        pfpUrl: userData.pfp_url,
      },
      create: {
        fid,
        username: userData.username,
        displayName: userData.display_name,
        pfpUrl: userData.pfp_url,
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        fid: user.fid,
        username: user.username,
        displayName: user.displayName,
        pfpUrl: user.pfpUrl,
      },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
});
