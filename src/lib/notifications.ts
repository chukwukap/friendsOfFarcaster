import { prisma } from "@/lib/db";
import { env } from "@/lib/env";
import {
  SendNotificationRequest,
  sendNotificationResponseSchema,
} from "@farcaster/miniapp-node";

// ============================================================================
// TYPES
// ============================================================================

type SendNotificationResult =
  | { state: "success" }
  | { state: "no_token" }
  | { state: "rate_limit" }
  | { state: "error"; error: unknown };

// ============================================================================
// TOKEN MANAGEMENT
// ============================================================================

/**
 * Save or update user notification details
 * Called when user adds the app or enables notifications
 */
export async function setUserNotificationDetails(
  fid: number,
  appFid: number,
  notificationDetails: { url: string; token: string }
): Promise<boolean> {
  try {
    // Find user by FID
    const user = await prisma.user.findUnique({
      where: { fid },
    });

    if (!user) {
      console.warn(
        `[Notification] User with FID ${fid} not found, cannot save token`
      );
      return false;
    }

    // Upsert notification token
    await prisma.notificationToken.upsert({
      where: {
        userId_appFid: {
          userId: user.id,
          appFid,
        },
      },
      update: {
        token: notificationDetails.token,
        url: notificationDetails.url,
      },
      create: {
        userId: user.id,
        appFid,
        token: notificationDetails.token,
        url: notificationDetails.url,
      },
    });

    console.log(`[Notification] Saved token for fid ${fid}, appFid ${appFid}`);
    return true;
  } catch (error) {
    console.error("[Notification] Failed to save notification details:", {
      fid,
      appFid,
      error: error instanceof Error ? error.message : error,
    });
    return false;
  }
}

/**
 * Delete user notification details
 * Called when user removes the app or disables notifications
 */
export async function deleteUserNotificationDetails(
  fid: number,
  appFid: number
): Promise<boolean> {
  try {
    const user = await prisma.user.findUnique({
      where: { fid },
    });

    if (!user) return false;

    await prisma.notificationToken.deleteMany({
      where: {
        userId: user.id,
        appFid,
      },
    });

    console.log(
      `[Notification] Deleted token for fid ${fid}, appFid ${appFid}`
    );
    return true;
  } catch (error) {
    console.error("[Notification] Failed to delete notification details:", {
      fid,
      appFid,
      error: error instanceof Error ? error.message : error,
    });
    return false;
  }
}

/**
 * Get all notification tokens for a user (across all Farcaster clients)
 */
export async function getAllUserNotificationTokens(fid: number) {
  try {
    const user = await prisma.user.findUnique({
      where: { fid },
      include: {
        notificationTokens: true,
      },
    });

    if (!user) return [];

    return user.notificationTokens;
  } catch (error) {
    console.error("[Notification] Failed to get user tokens:", {
      fid,
      error: error instanceof Error ? error.message : error,
    });
    return [];
  }
}

// ============================================================================
// SEND NOTIFICATION
// ============================================================================

/**
 * Send a notification to a user
 * Tries all registered tokens until one succeeds
 */
export async function sendNotificationToUser({
  fid,
  title,
  body,
  targetUrl,
}: {
  fid: number;
  title: string;
  body: string;
  targetUrl?: string;
}): Promise<SendNotificationResult> {
  // Validate inputs
  if (!fid || !title || !body) {
    console.error("[Notification] Invalid input:", { fid, title, body });
    return { state: "error", error: "Invalid notification parameters" };
  }

  const tokens = await getAllUserNotificationTokens(fid);

  if (tokens.length === 0) {
    console.log(`[Notification] No tokens for fid ${fid}`);
    return { state: "no_token" };
  }

  console.log(
    `[Notification] Sending to fid ${fid} (${tokens.length} token(s))`
  );

  // Default target URL is the app home
  const url = targetUrl || `${env.rootUrl}${env.homeUrlPath}`;

  // Try each token until one succeeds
  for (const token of tokens) {
    try {
      const response = await fetch(token.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          notificationId: crypto.randomUUID(),
          title,
          body,
          targetUrl: url,
          tokens: [token.token],
        } satisfies SendNotificationRequest),
      });

      if (response.status === 200) {
        const responseJson = await response.json();
        const parsed = sendNotificationResponseSchema.safeParse(responseJson);

        if (parsed.success) {
          // Check for rate limiting
          if (parsed.data.result.rateLimitedTokens.length) {
            console.warn(`[Notification] Rate limited for fid ${fid}`);
            continue; // Try next token
          }

          // Handle invalid tokens
          if (parsed.data.result.invalidTokens.length) {
            console.log(`[Notification] Removing invalid token for fid ${fid}`);
            await deleteUserNotificationDetails(fid, token.appFid);
            continue;
          }

          console.log(`[Notification] Sent successfully to fid ${fid}`);
          return { state: "success" };
        }

        console.error("[Notification] Malformed response:", parsed.error);
      } else {
        console.error("[Notification] API error:", response.status);
      }
    } catch (error) {
      console.error("[Notification] Send failed:", {
        fid,
        error: error instanceof Error ? error.message : error,
      });
    }
  }

  return { state: "error", error: "All tokens failed" };
}
