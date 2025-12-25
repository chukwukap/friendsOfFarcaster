import { NextRequest, NextResponse } from "next/server";

/**
 * Farcaster Webhook Handler
 *
 * Receives server events from Farcaster including:
 * - frame_added: User adds your Mini App
 * - frame_removed: User removes your Mini App
 * - notifications_enabled: User enables notifications
 * - notifications_disabled: User disables notifications
 *
 * @see https://docs.farcaster.xyz/developers/frames/v2/spec#server-events
 */

interface FarcasterWebhookEvent {
  event:
    | "frame_added"
    | "frame_removed"
    | "notifications_enabled"
    | "notifications_disabled";
  notificationDetails?: {
    url: string;
    token: string;
  };
  fid?: number;
}

export async function POST(req: NextRequest) {
  try {
    const body: FarcasterWebhookEvent = await req.json();

    console.log("Farcaster webhook received:", body.event);

    switch (body.event) {
      case "frame_added":
        // User added the Mini App to their client
        console.log(`User FID ${body.fid} added FOF Mini App`);
        // Store notification details for sending notifications later
        if (body.notificationDetails) {
          // TODO: Store in database
          console.log("Notification URL:", body.notificationDetails.url);
        }
        break;

      case "frame_removed":
        // User removed the Mini App
        console.log(`User FID ${body.fid} removed FOF Mini App`);
        // TODO: Remove notification details from database
        break;

      case "notifications_enabled":
        // User enabled notifications
        console.log(`User FID ${body.fid} enabled notifications`);
        if (body.notificationDetails) {
          // TODO: Store/update notification details
        }
        break;

      case "notifications_disabled":
        // User disabled notifications
        console.log(`User FID ${body.fid} disabled notifications`);
        // TODO: Mark notifications as disabled
        break;

      default:
        console.log("Unknown webhook event:", body);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

// Health check for webhook endpoint
export async function GET() {
  return NextResponse.json({
    status: "ok",
    endpoint: "farcaster-webhook",
  });
}
