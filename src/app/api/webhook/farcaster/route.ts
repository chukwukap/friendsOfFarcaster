import { NextRequest, NextResponse } from "next/server";
import {
  parseWebhookEvent,
  verifyAppKeyWithNeynar,
} from "@farcaster/miniapp-node";
import {
  setUserNotificationDetails,
  deleteUserNotificationDetails,
  sendNotificationToUser,
} from "@/lib/notifications";
import { env } from "@/lib/env";

/**
 * Farcaster/Base MiniApp Webhook Handler
 *
 * Receives server events from Farcaster clients including:
 * - miniapp_added: User adds your Mini App
 * - miniapp_removed: User removes your Mini App
 * - notifications_enabled: User enables notifications
 * - notifications_disabled: User disables notifications
 *
 * @see https://docs.base.org/mini-apps/core-concepts/notifications
 */
export async function POST(request: NextRequest) {
  const requestJson = await request.json();

  // Parse and verify the webhook event using Neynar
  let data: Awaited<ReturnType<typeof parseWebhookEvent>>;
  try {
    data = await parseWebhookEvent(requestJson, verifyAppKeyWithNeynar);
    console.log("[WEBHOOK] Event verified successfully");
  } catch (e: unknown) {
    console.error("[WEBHOOK] Verification failed:", e);
    return NextResponse.json(
      { error: "Invalid webhook signature" },
      { status: 401 }
    );
  }

  const fid = data.fid;
  const appFid = data.appFid;
  const event = data.event;
  const eventType = event.event;

  console.log(
    `[WEBHOOK] Event: ${event.event}, FID: ${fid}, AppFID: ${appFid}`
  );

  try {
    switch (event.event) {
      case "miniapp_added":
        console.log(`[WEBHOOK] Processing miniapp_added for FID ${fid}`);
        if (event.notificationDetails) {
          console.log(`[WEBHOOK] Saving notification details for FID ${fid}`);
          await setUserNotificationDetails(
            fid,
            appFid,
            event.notificationDetails
          );

          // Send welcome notification
          console.log(`[WEBHOOK] Sending welcome notification to FID ${fid}`);
          await sendNotificationToUser({
            fid,
            title: "Welcome to FOF! 🎄",
            body: "Thanks for adding the app. Create your Christmas portrait now!",
            targetUrl: `${env.rootUrl}${env.homeUrlPath}`,
          });
          console.log(`[WEBHOOK] Welcome notification sent to FID ${fid}`);
        } else {
          console.log(
            `[WEBHOOK] No notification details provided for FID ${fid}`
          );
        }
        break;

      case "miniapp_removed":
        console.log(`[WEBHOOK] Processing miniapp_removed for FID ${fid}`);
        await deleteUserNotificationDetails(fid, appFid);
        console.log(`[WEBHOOK] Notification details deleted for FID ${fid}`);
        break;

      case "notifications_enabled":
        console.log(
          `[WEBHOOK] Processing notifications_enabled for FID ${fid}`
        );
        await setUserNotificationDetails(
          fid,
          appFid,
          event.notificationDetails
        );
        console.log(`[WEBHOOK] Notification details saved for FID ${fid}`);

        // Send confirmation notification
        await sendNotificationToUser({
          fid,
          title: "Notifications Enabled ✨",
          body: "You'll now receive updates about your FOF generations!",
          targetUrl: `${env.rootUrl}${env.homeUrlPath}`,
        });
        console.log(
          `[WEBHOOK] Notification enabled message sent to FID ${fid}`
        );
        break;

      case "notifications_disabled":
        console.log(
          `[WEBHOOK] Processing notifications_disabled for FID ${fid}`
        );
        await deleteUserNotificationDetails(fid, appFid);
        console.log(`[WEBHOOK] Notification details deleted for FID ${fid}`);
        break;

      default:
        console.log(`[WEBHOOK] Unknown event type: ${eventType}`);
    }

    console.log(`[WEBHOOK] Successfully processed ${eventType} for FID ${fid}`);
  } catch (error) {
    console.error(
      `[WEBHOOK] Error processing ${eventType} for FID ${fid}:`,
      error
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
