import { NeynarAPIClient, Configuration } from "@neynar/nodejs-sdk";

// =============================================================================
// NEYNAR API CLIENT - Using Official SDK with fetchUserReciprocalFollowers
// =============================================================================

// Validate API key at module load
const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY;
if (!NEYNAR_API_KEY) {
  console.warn(
    "⚠️ NEYNAR_API_KEY not configured - Farcaster features will fail"
  );
}

const config = new Configuration({
  apiKey: NEYNAR_API_KEY || "",
});

export const neynarClient = new NeynarAPIClient(config);

// =============================================================================
// TYPES
// =============================================================================

export interface FriendData {
  fid: number;
  username: string;
  displayName: string;
  pfpUrl: string;
}

export interface UserWithFriends {
  user: {
    fid: number;
    username: string;
    displayName: string;
    pfpUrl: string;
    followerCount: number;
    followingCount: number;
  };
  friends: FriendData[];
}

// =============================================================================
// CONSTANTS
// =============================================================================

const DEFAULT_AVATAR = "/assets/default-avatar.png";
const MAX_FRIENDS_FOR_IMAGE = 12;

// =============================================================================
// MAIN FUNCTION: Get Friends for FOF
// =============================================================================

/**
 * Fetches user's mutual connections (friends) for FOF image generation.
 * Uses Neynar's fetchUserReciprocalFollowers API - the perfect endpoint
 * for getting users who both follow and are followed by a given FID.
 *
 * @param fid - Farcaster ID of the user
 * @returns User profile and their mutual friends
 */
export async function getFriendsForFOF(fid: number): Promise<UserWithFriends> {
  // Validate input
  if (!fid || fid <= 0) {
    throw new Error("Invalid FID: must be a positive integer");
  }

  // Validate API key
  if (!NEYNAR_API_KEY) {
    throw new Error("NEYNAR_API_KEY not configured");
  }

  try {
    // 1. Fetch user profile using fetchBulkUsers
    const userResponse = await neynarClient.fetchBulkUsers({ fids: [fid] });
    const userData = userResponse.users?.[0];

    if (!userData) {
      throw new Error(`User with FID ${fid} not found`);
    }

    const user: UserWithFriends["user"] = {
      fid: userData.fid,
      username: userData.username || `user-${fid}`,
      displayName: userData.display_name || userData.username || `User ${fid}`,
      pfpUrl: userData.pfp_url || DEFAULT_AVATAR,
      followerCount: userData.follower_count ?? 0,
      followingCount: userData.following_count ?? 0,
    };

    // 2. Fetch reciprocal followers (mutual connections) using the dedicated API
    // This returns users who the given FID follows AND who follow them back
    const reciprocalResponse = await neynarClient.fetchUserReciprocalFollowers({
      fid,
      limit: 100,
    });

    // 3. Extract friend data from response
    // ReciprocalFollower has structure: { object, user: User, timestamp }
    const mutuals: FriendData[] = [];
    if (reciprocalResponse.users) {
      for (const entry of reciprocalResponse.users) {
        const userData = entry.user;
        if (userData?.fid) {
          mutuals.push({
            fid: userData.fid,
            username: userData.username || `user-${userData.fid}`,
            displayName:
              userData.display_name ||
              userData.username ||
              `User ${userData.fid}`,
            pfpUrl: userData.pfp_url || DEFAULT_AVATAR,
          });
        }
      }
    }

    // 4. Filter to only those with valid HTTP profile pictures
    const friendsWithPictures = mutuals.filter(
      (f) => f.pfpUrl && f.pfpUrl.startsWith("http")
    );

    // 5. Take top N friends for the image
    const topFriends = friendsWithPictures.slice(0, MAX_FRIENDS_FOR_IMAGE);

    return {
      user,
      friends: topFriends,
    };
  } catch (error) {
    // Re-throw with more context
    if (error instanceof Error) {
      throw new Error(
        `Failed to fetch friends for FID ${fid}: ${error.message}`
      );
    }
    throw error;
  }
}

// =============================================================================
// PROFILE PICTURE EXTRACTION
// =============================================================================

/**
 * Get profile picture URLs for image-to-image generation.
 * Filters to only valid HTTP URLs and limits to 9 for FLUX.2 Pro.
 */
export function getProfilePictureUrls(
  user: UserWithFriends["user"],
  friends: FriendData[]
): string[] {
  const urls: string[] = [];

  // Add user's picture first (most important)
  if (user.pfpUrl && user.pfpUrl.startsWith("http")) {
    urls.push(user.pfpUrl);
  }

  // Add friends' pictures
  for (const friend of friends) {
    if (friend.pfpUrl && friend.pfpUrl.startsWith("http")) {
      urls.push(friend.pfpUrl);
    }
  }

  // Limit to 9 for FLUX.2 Pro (max reference images)
  return urls.slice(0, 9);
}
