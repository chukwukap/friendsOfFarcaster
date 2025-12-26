import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { env } from "@/lib/env";

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

    // Ignore health checks and malformed requests silently
    if (!body || !body.event) {
      return NextResponse.json({ ok: true });
    }

    console.log("Farcaster webhook received:", body.event);

    const appFid = env.appFid;

    if (!body.fid) {
      console.warn("Webhook event missing FID:", body.event);
      return NextResponse.json({ error: "Missing FID" }, { status: 400 });
    }

    switch (body.event) {
      case "frame_added":
        // User added the Mini App to their client
        console.log(`User FID ${body.fid} added FOF Mini App`);
        // Store notification details for sending notifications later
        if (body.notificationDetails) {
          await prisma.notificationToken.upsert({
            where: {
              fid_appFid: {
                fid: body.fid,
                appFid,
              },
            },
            update: {
              token: body.notificationDetails.token,
              url: body.notificationDetails.url,
            },
            create: {
              fid: body.fid,
              appFid,
              token: body.notificationDetails.token,
              url: body.notificationDetails.url,
            },
          });
          console.log(`Stored notification token for FID ${body.fid}`);
        }
        break;

      case "frame_removed":
        // User removed the Mini App
        console.log(`User FID ${body.fid} removed FOF Mini App`);
        // Remove notification details from database
        await prisma.notificationToken.deleteMany({
          where: {
            fid: body.fid,
            appFid,
          },
        });
        console.log(`Removed notification token for FID ${body.fid}`);
        break;

      case "notifications_enabled":
        // User enabled notifications
        console.log(`User FID ${body.fid} enabled notifications`);
        if (body.notificationDetails) {
          await prisma.notificationToken.upsert({
            where: {
              fid_appFid: {
                fid: body.fid,
                appFid,
              },
            },
            update: {
              token: body.notificationDetails.token,
              url: body.notificationDetails.url,
            },
            create: {
              fid: body.fid,
              appFid,
              token: body.notificationDetails.token,
              url: body.notificationDetails.url,
            },
          });
          console.log(`Updated notification token for FID ${body.fid}`);
        }
        break;

      case "notifications_disabled":
        // User disabled notifications
        console.log(`User FID ${body.fid} disabled notifications`);
        // Delete token as we can no longer send notifications
        await prisma.notificationToken.deleteMany({
          where: {
            fid: body.fid,
            appFid,
          },
        });
        console.log(
          `Disabled (deleted) notification token for FID ${body.fid}`
        );
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
