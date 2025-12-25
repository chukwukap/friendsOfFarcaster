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
  // Skip if no valid FID
  if (!fid || fid <= 0) {
    return { onWaitlist: false, points: 0 };
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

    // Use AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const response = await fetch(
      `${WAFFLES_API}/api/v1/external/verify-waitlist?fid=${fid}`,
      {
        method: "GET",
        headers,
        cache: "no-store",
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn("Waffles API returned non-OK status:", response.status);
      return { onWaitlist: false, points: 0 };
    }

    return response.json();
  } catch (error) {
    // Silently handle network errors - this is a non-critical feature
    if (error instanceof Error && error.name === "AbortError") {
      console.warn("Waffles API request timed out");
    } else {
      console.warn("Waffles API unavailable:", error);
    }
    return { onWaitlist: false, points: 0 };
  }
}

/**
 * Get the full URL to open Waffles waitlist page
 */
export function getWafflesWaitlistUrl(): string {
  return `${WAFFLES_MINIAPP_URL}${WAFFLES_WAITLIST_PATH}`;
}
