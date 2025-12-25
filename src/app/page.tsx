import { Metadata } from "next";
import { HomeClient } from "./HomeClient";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://fof.app";

/**
 * Frame embed configuration for Farcaster MiniApp
 * This metadata enables the home page to be discovered and launched as a MiniApp
 */
const frameEmbed = {
  version: "1",
  imageUrl: `${APP_URL}/api/og`,
  button: {
    title: "🎄 Create My FOF",
    action: {
      type: "launch_frame",
      name: "FOF: Friends of Farcaster",
      url: APP_URL,
      splashImageUrl: `${APP_URL}/assets/splash.png`,
      splashBackgroundColor: "#0A0A0F",
    },
  },
};

/**
 * Page metadata with Farcaster Frame embed
 * The fc:miniapp and fc:frame meta tags enable MiniApp discovery and launching
 */
export const metadata: Metadata = {
  title: "FOF: Friends of Farcaster | Christmas Edition 2024",
  description:
    "Transform your Farcaster network into stunning AI art. Create your personalized Friends of Farcaster portrait this Christmas!",
  metadataBase: new URL(APP_URL),
  openGraph: {
    title: "FOF: Friends of Farcaster",
    description: "Your Farcaster network, transformed into art.",
    images: [`${APP_URL}/api/og`],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FOF: Friends of Farcaster",
    description: "Your Farcaster network, transformed into art.",
    images: [`${APP_URL}/api/og`],
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
