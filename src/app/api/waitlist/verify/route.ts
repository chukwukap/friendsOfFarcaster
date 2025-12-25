import { NextRequest, NextResponse } from "next/server";

const WAFFLES_API =
  process.env.NEXT_PUBLIC_WAFFLES_URL || "https://miniapp.playwaffles.fun";

/**
 * GET /api/waitlist/verify?fid=123
 * Proxies the Waffles waitlist verification to avoid CORS issues
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const fid = searchParams.get("fid");

  if (!fid) {
    return NextResponse.json({ onWaitlist: false, points: 0 });
  }

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Add API key if configured
    const apiKey = process.env.WAFFLES_API_KEY;
    if (apiKey) {
      headers["X-API-Key"] = apiKey;
    }

    const response = await fetch(
      `${WAFFLES_API}/api/v1/external/verify-waitlist?fid=${fid}`,
      {
        method: "GET",
        headers,
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return NextResponse.json({ onWaitlist: false, points: 0 });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Waitlist verification error:", error);
    return NextResponse.json({ onWaitlist: false, points: 0 });
  }
}
