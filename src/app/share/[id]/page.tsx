import { Metadata } from "next";
import { notFound } from "next/navigation";
import { env } from "@/lib/env";
import { minikitConfig } from "../../../../minikit.config";

interface SharePageProps {
    params: Promise<{
        id: string;
    }>;
    searchParams: Promise<{
        imageUrl?: string;
        username?: string;
        friendCount?: string;
    }>;
}

/**
 * Generate Frame embed metadata for Farcaster
 */
export async function generateMetadata({ params: paramsPromise, searchParams }: SharePageProps): Promise<Metadata> {
    const resolvedParams = await paramsPromise;
    const { id } = resolvedParams;
    const params = await searchParams;
    const { imageUrl, username, friendCount } = params;

    const appUrl = env.rootUrl;

    // Use the generated image directly for embed
    const embedImageUrl = imageUrl || `${appUrl}/assets/og-image.png`;

    // Frame embed JSON for fc:frame meta tag
    const frameEmbed = {
        version: "1",
        imageUrl: embedImageUrl,
        button: {
            title: "🎄 Create Your FOF",
            action: {
                type: "launch_frame",
                name: "Create FOF",
                url: appUrl,
                splashImageUrl: minikitConfig.miniapp?.splashImageUrl || `${appUrl}/assets/logo.png`,
                splashBackgroundColor: minikitConfig.miniapp?.splashBackgroundColor || "#0A0A0F",
            },
        },
    };

    return {
        title: `${username}'s FOF | Friends of Farcaster`,
        description: `Check out ${username}'s Friends of Farcaster portrait featuring ${friendCount} friends! Create yours now.`,
        metadataBase: new URL(appUrl || ""),
        openGraph: {
            title: `${username}'s FOF Portrait`,
            description: `A festive portrait featuring ${username} and ${friendCount} Farcaster friends.`,
            images: [embedImageUrl],
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: `${username}'s FOF Portrait`,
            description: `A festive portrait featuring ${username} and ${friendCount} Farcaster friends.`,
            images: [embedImageUrl],
        },
        other: {
            // Farcaster Frame embed - new format
            "fc:miniapp": JSON.stringify(frameEmbed),
            // Legacy Frame format for backwards compatibility
            "fc:frame": JSON.stringify(frameEmbed),
        },
    };
}

/**
 * Share page that displays the generated FOF and allows launching the app
 */
export default async function SharePage({ params, searchParams }: SharePageProps) {
    const resolvedParams = await params;
    const resolvedSearchParams = await searchParams;

    const { id } = resolvedParams;
    const { imageUrl, username, friendCount } = resolvedSearchParams;

    if (!id) {
        notFound();
    }

    const appUrl = env.rootUrl;

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "linear-gradient(180deg, #0A0A0F 0%, #1A1A2E 100%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "24px",
                color: "white",
                fontFamily: "Inter, sans-serif",
            }}
        >
            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: "24px" }}>
                <h1 style={{ fontSize: "28px", fontWeight: 700, margin: 0 }}>
                    🎄 {username}&apos;s FOF 🎄
                </h1>
                <p style={{ color: "#A0A0B0", marginTop: "8px" }}>
                    Christmas Edition 2025
                </p>
            </div>

            {/* Image Display */}
            {imageUrl && (
                <div
                    style={{
                        borderRadius: "24px",
                        border: "4px solid #FFD700",
                        boxShadow: "0 0 60px rgba(255, 215, 0, 0.4)",
                        overflow: "hidden",
                        marginBottom: "24px",
                    }}
                >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={imageUrl}
                        alt={`${username}'s FOF`}
                        style={{
                            width: "300px",
                            height: "300px",
                            objectFit: "cover",
                        }}
                    />
                </div>
            )}

            {/* Stats */}
            <p style={{ color: "#A0A0B0", marginBottom: "32px" }}>
                Featuring @{username} + {friendCount} friends
            </p>

            {/* CTA Button */}
            <a
                href={appUrl}
                style={{
                    background: "linear-gradient(90deg, #533483, #E94560)",
                    color: "white",
                    padding: "16px 32px",
                    borderRadius: "12px",
                    textDecoration: "none",
                    fontWeight: 600,
                    fontSize: "18px",
                    boxShadow: "0 4px 20px rgba(233, 69, 96, 0.4)",
                }}
            >
                🎁 Create My FOF
            </a>

            {/* Footer */}
            <p
                style={{
                    color: "#666",
                    fontSize: "14px",
                    marginTop: "40px",
                }}
            >
                Powered by Waffles 🧇
            </p>
        </div>
    );
}
