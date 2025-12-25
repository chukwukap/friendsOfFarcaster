import { Metadata } from "next";
import { HomeClient } from "./HomeClient";
import { env } from "@/lib/env";


/**
 * Frame embed configuration for Farcaster MiniApp
 * This metadata enables the home page to be discovered and launched as a MiniApp
 */
const frameEmbed = {
  version: "1",
  imageUrl: `${env.rootUrl}/assets/og-image.png`,
  button: {
    title: "🎄 Create My FOF",
    action: {
      type: "launch_frame",
      name: "FOF: Friends of Farcaster",
      url: env.rootUrl,
      splashImageUrl: `${env.rootUrl}/assets/logo.png`,
      splashBackgroundColor: "#0A0A0F",
    },
  },
};

/**
 * Page metadata with Farcaster Frame embed
 * The fc:miniapp and fc:frame meta tags enable MiniApp discovery and launching
 */
export const metadata: Metadata = {
  title: "FOF: Friends of Farcaster | Christmas Edition 2025",
  description:
    "Transform your Farcaster network into stunning AI art. Create your personalized Friends of Farcaster portrait this Christmas!",
  metadataBase: new URL(env.rootUrl || "https://fof.app"),
  openGraph: {
    title: "FOF: Friends of Farcaster",
    description: "Your Farcaster network, transformed into art.",
    images: [`${env.rootUrl}/assets/og-image.png`],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FOF: Friends of Farcaster",
    description: "Your Farcaster network, transformed into art.",
    images: [`${env.rootUrl}/assets/og-image.png`],
  },
  other: {
    // Farcaster MiniApp embed - enables launching the app from casts
    "fc:miniapp": JSON.stringify(frameEmbed),
    // Legacy Frame format for backwards compatibility
    "fc:frame": JSON.stringify(frameEmbed),
  },
};

/**
 * Home page - Server component wrapper for metadata + client component
 */
export default function HomePage() {
  return <HomeClient />;
}

