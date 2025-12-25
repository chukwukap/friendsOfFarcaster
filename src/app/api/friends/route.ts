import { NextRequest, NextResponse } from "next/server";
import { getFriendsForFOF, getProfilePictureUrls } from "@/lib/neynar";

/**
 * GET /api/friends?fid=123
 * Fetches user's friends for FOF generation
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const fidParam = searchParams.get("fid");

  if (!fidParam) {
    return NextResponse.json(
      { error: "Missing fid parameter" },
      { status: 400 }
    );
  }

  const fid = parseInt(fidParam, 10);
  if (isNaN(fid)) {
    return NextResponse.json(
      { error: "Invalid fid parameter" },
      { status: 400 }
    );
  }

  try {
    const { user, friends } = await getFriendsForFOF(fid);
    const profilePictureUrls = getProfilePictureUrls(user, friends);

    return NextResponse.json({
      user,
      friends,
      profilePictureUrls,
      friendCount: friends.length,
    });
  } catch (error) {
    console.error("Error fetching friends:", error);
    return NextResponse.json(
      { error: "Failed to fetch friends data" },
      { status: 500 }
    );
  }
}
