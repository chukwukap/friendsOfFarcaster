import { withValidManifest } from "@coinbase/onchainkit/minikit";
import { minikitConfig } from "../../../../minikit.config";

export async function GET() {
  try {
    const validatedManifest = withValidManifest(minikitConfig);
    return Response.json(validatedManifest);
  } catch (error) {
    console.error("Error validating Farcaster manifest:", error);
    return Response.json(
      { error: "Failed to load Farcaster manifest" },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
