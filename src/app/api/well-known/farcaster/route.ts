import { withValidManifest } from "@coinbase/onchainkit/minikit";
import { minikitConfig } from "../../../../../minikit.config";
import { type NextRequest } from "next/server";

/**
 * Farcaster MiniApp Manifest API Route
 *
 * Serves the validated MiniApp manifest at /.well-known/farcaster.json
 * This route uses @coinbase/onchainkit to validate the manifest format.
 *
 * Compatible with:
 * - Farcaster MiniApps (Warpcast)
 * - Base MiniApps
 *
 * @see https://docs.farcaster.xyz/developers/frames/v2/spec#manifest
 * @see https://miniapps.farcaster.xyz/docs/guides/publishing
 */
export async function GET(req: NextRequest) {
  try {
    // Validate and return the manifest
    const validatedManifest = withValidManifest(minikitConfig);

    return Response.json(validatedManifest, {
      headers: {
        // Cache for 5 minutes, allow stale for 1 hour while revalidating
        "Cache-Control": "public, max-age=300, stale-while-revalidate=3600",
      },
    });
  } catch (error) {
    console.error("Error validating Farcaster manifest:", error);

    // If validation fails, return the raw config as fallback
    // This allows development without full account association setup
    return Response.json(
      {
        accountAssociation: minikitConfig.accountAssociation || {},
        frame: {
          version: "1",
          name: minikitConfig.miniapp?.name || "FOF",
          iconUrl: minikitConfig.miniapp?.iconUrl || "",
          homeUrl: minikitConfig.miniapp?.homeUrl || "",
          splashImageUrl: minikitConfig.miniapp?.splashImageUrl || "",
          splashBackgroundColor:
            minikitConfig.miniapp?.splashBackgroundColor || "#0A0A0F",
          webhookUrl: minikitConfig.miniapp?.webhookUrl || "",
        },
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, max-age=60",
        },
      }
    );
  }
}

// Force dynamic rendering since manifest may contain env-dependent values
export const dynamic = "force-dynamic";
