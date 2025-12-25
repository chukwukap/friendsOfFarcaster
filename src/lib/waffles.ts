/**
 * Waffles Integration Utilities
 *
 * For verifying waitlist membership and opening Waffles miniapp.
 */

// Waffles miniapp URL
export const WAFFLES_MINIAPP_URL = "https://miniapp.playwaffles.fun";
export const WAFFLES_WAITLIST_PATH = "/waitlist";

// API base URL (same as miniapp URL)
const WAFFLES_API = process.env.NEXT_PUBLIC_WAFFLES_URL || WAFFLES_MINIAPP_URL;

export interface WaitlistStatus {
  onWaitlist: boolean;
  points: number;
}

/**
 * Verify if a user (by FID) is on the Waffles waitlist
 */
export async function verifyWaitlist(fid: number): Promise<WaitlistStatus> {
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
        // Don't cache this - we want fresh data
        cache: "no-store",
      }
    );

    if (!response.ok) {
      console.error("Failed to verify waitlist:", response.status);
      return { onWaitlist: false, points: 0 };
    }

    return response.json();
  } catch (error) {
    console.error("Error verifying waitlist:", error);
    return { onWaitlist: false, points: 0 };
  }
}

/**
 * Get the full URL to open Waffles waitlist page
 */
export function getWafflesWaitlistUrl(): string {
  return `${WAFFLES_MINIAPP_URL}${WAFFLES_WAITLIST_PATH}`;
}
