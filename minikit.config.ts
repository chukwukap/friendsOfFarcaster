import { MiniAppManifest } from "@coinbase/onchainkit/minikit";
import { env } from "@/lib/env";

/**
 * FOF MiniApp Configuration
 *
 * This manifest follows the Farcaster MiniApp specification.
 * @see https://docs.farcaster.xyz/developers/frames/v2/spec#manifest
 * @see https://miniapps.farcaster.xyz/docs/guides/publishing
 *
 * For Base MiniApp compatibility:
 * - Uses @coinbase/onchainkit for validation
 * - Includes chains and builder configuration
 */
export const minikitConfig: MiniAppManifest = {
  // Account Association - Verifies domain ownership to Farcaster account
  // Generate at: https://farcaster.xyz/~/developers/mini-apps/manifest
  ...(env.accountAssociation.header &&
    env.accountAssociation.payload &&
    env.accountAssociation.signature && {
      accountAssociation: {
        header: env.accountAssociation.header,
        payload: env.accountAssociation.payload,
        signature: env.accountAssociation.signature,
      },
    }),

  // MiniApp Manifest (Farcaster spec)
  miniapp: {
    // Required: Version must be "1"
    version: "1",

    // Required: App name displayed in Warpcast
    name: "FOF: Friends of Farcaster",

    // Optional: Short description shown in app listing
    subtitle: "Christmas Edition 2024",

    // Optional: Full description for app store
    description:
      "Transform your Farcaster network into stunning AI-generated art. Create personalized Christmas portraits featuring you and your closest friends.",

    // Required: App icon (1:1 aspect ratio, min 200x200px)
    iconUrl: `${env.rootUrl}/assets/fof-logo.png`,

    // Required: Home URL where the app loads
    homeUrl: `${env.rootUrl}${env.homeUrlPath}`,

    // Optional: Splash screen image (1:1 aspect ratio)
    splashImageUrl: `${env.rootUrl}/assets/logo.png`,

    // Optional: Splash screen background color (hex)
    splashBackgroundColor: "#0A0A0F",

    // Optional: Webhook URL for server events (notifications, etc.)
    webhookUrl: `${env.rootUrl}/api/webhook/farcaster`,

    // Optional: Primary category for app store
    primaryCategory: "art-creativity",

    // Optional: Tags for discoverability (max 5)
    tags: ["ai", "art", "christmas", "social", "farcaster"],

    // Optional: Screenshot URLs for app store listing
    screenshotUrls: [
      `${env.rootUrl}/assets/screenshots/landing.png`,
      `${env.rootUrl}/assets/screenshots/generating.png`,
      `${env.rootUrl}/assets/screenshots/success.png`,
    ],

    // Optional: Hero image for featured listings (1200x630)
    heroImageUrl: `${env.rootUrl}/assets/og-image.png`,

    // Optional: Tagline shown in listings (max 30 chars)
    tagline: "Transform your network to art",

    // Optional: Open Graph metadata (max 30 chars for title)
    ogTitle: "FOF: Christmas Edition",
    ogDescription:
      "Create stunning AI-generated art featuring you and your Farcaster friends. Get yours free!",
    ogImageUrl: `${env.rootUrl}/assets/og-image.png`,

    // Optional: Whether to hide from search indexing
    // noindex: false,
  },

  // Base Builder Configuration (for Base MiniApp compatibility)
  // @ts-expect-error - baseBuilder is not in the MiniAppManifest type yet
  baseBuilder: {
    // Allowed addresses for builder actions (if applicable)
    allowedAddresses: ["0xd584f8079192e078f0f3237622345e19360384a2"],
  },
};
