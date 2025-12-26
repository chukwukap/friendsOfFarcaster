import { NextRequest, NextResponse } from "next/server";
import { env } from "@/lib/env";
import {
  setUserNotificationDetails,
  deleteUserNotificationDetails,
} from "@/lib/notifications";

/**
 * POST /api/notifications/token
 *
 * Stores Farcaster notification token for a user.
 * Called when user enables notifications in the miniapp.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fid, token, url } = body;

    // Validate required fields
    if (!fid || !token || !url) {
      return NextResponse.json(
        { error: "Missing required fields: fid, token, url" },
        { status: 400 }
      );
    }

    // App FID from env
    const appFid = env.appFid;

    // Save notification token using the notifications library
    const success = await setUserNotificationDetails(
      parseInt(fid, 10),
      appFid,
      { token, url }
    );

    if (!success) {
      return NextResponse.json(
        { error: "User not found or failed to save token" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Error storing notification token:", error);
    return NextResponse.json(
      {
        error: "Failed to store notification token",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/notifications/token
 *
 * Removes notification token when user disables notifications.
 */
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { fid } = body;

    if (!fid) {
      return NextResponse.json({ error: "Missing fid" }, { status: 400 });
    }

    const appFid = env.appFid;

    // Delete notification token using the notifications library
    await deleteUserNotificationDetails(parseInt(fid, 10), appFid);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Error deleting notification token:", error);
    return NextResponse.json(
      { error: "Failed to delete notification token" },
      { status: 500 }
    );
  }
}
