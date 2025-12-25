import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

// =============================================================================
// PREMIUM OG SHARE CARD
// Conversion-optimized design for Farcaster shares
// =============================================================================

/**
 * Dynamic OG Image Generator for Farcaster Frame Embeds
 * 
 * Creates a premium share card with:
 * - Large hero image (the FOF portrait)
 * - Social proof (username + friend count)
 * - Clear CTA driving viewers to create their own
 * - Luxurious dark gradient with gold accents
 * 
 * Usage: /api/og?imageUrl=...&username=...&friendCount=...
 */
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);

    const imageUrl = searchParams.get("imageUrl");
    const username = searchParams.get("username") || "friend";
    const friendCount = searchParams.get("friendCount") || "0";

    // Default to sample image if none provided
    const displayImage = imageUrl || `${process.env.NEXT_PUBLIC_APP_URL}/assets/sample-fof.png`;

    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    // Premium dark gradient
                    background: "linear-gradient(165deg, #0A0A12 0%, #12121F 40%, #1A1A2E 100%)",
                    fontFamily: "Inter, system-ui, sans-serif",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                {/* Ambient glow effects */}
                <div
                    style={{
                        position: "absolute",
                        top: "-100px",
                        right: "-100px",
                        width: "400px",
                        height: "400px",
                        background: "radial-gradient(circle, rgba(255,215,0,0.15) 0%, transparent 70%)",
                        borderRadius: "50%",
                    }}
                />
                <div
                    style={{
                        position: "absolute",
                        bottom: "-50px",
                        left: "-50px",
                        width: "300px",
                        height: "300px",
                        background: "radial-gradient(circle, rgba(233,69,96,0.1) 0%, transparent 70%)",
                        borderRadius: "50%",
                    }}
                />

                {/* Subtle particle/snowflake decorations */}
                <div
                    style={{
                        position: "absolute",
                        top: "40px",
                        left: "60px",
                        fontSize: "24px",
                        opacity: 0.3,
                    }}
                >
                    ✨
                </div>
                <div
                    style={{
                        position: "absolute",
                        top: "80px",
                        right: "100px",
                        fontSize: "18px",
                        opacity: 0.25,
                    }}
                >
                    ❄️
                </div>
                <div
                    style={{
                        position: "absolute",
                        bottom: "100px",
                        left: "100px",
                        fontSize: "16px",
                        opacity: 0.2,
                    }}
                >
                    ✨
                </div>
                <div
                    style={{
                        position: "absolute",
                        bottom: "60px",
                        right: "80px",
                        fontSize: "20px",
                        opacity: 0.25,
                    }}
                >
                    ❄️
                </div>

                {/* Main content container */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "20px",
                        padding: "40px",
                    }}
                >
                    {/* Logo/Brand */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            marginBottom: "8px",
                        }}
                    >
                        <span style={{ fontSize: "28px" }}>🎄</span>
                        <span
                            style={{
                                fontSize: "22px",
                                fontWeight: 700,
                                letterSpacing: "-0.5px",
                                background: "linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)",
                                backgroundClip: "text",
                                color: "transparent",
                            }}
                        >
                            Friends of Farcaster
                        </span>
                        <span style={{ fontSize: "28px" }}>🎄</span>
                    </div>

                    {/* Hero Image with premium frame */}
                    <div
                        style={{
                            display: "flex",
                            position: "relative",
                        }}
                    >
                        {/* Outer glow */}
                        <div
                            style={{
                                position: "absolute",
                                top: "-8px",
                                left: "-8px",
                                right: "-8px",
                                bottom: "-8px",
                                background: "linear-gradient(135deg, rgba(255,215,0,0.6), rgba(255,165,0,0.4), rgba(255,215,0,0.6))",
                                borderRadius: "28px",
                                filter: "blur(12px)",
                            }}
                        />
                        {/* Gold frame */}
                        <div
                            style={{
                                display: "flex",
                                borderRadius: "20px",
                                border: "3px solid",
                                borderColor: "#FFD700",
                                overflow: "hidden",
                                boxShadow: "0 20px 60px rgba(0,0,0,0.5), inset 0 0 40px rgba(255,215,0,0.1)",
                                position: "relative",
                                zIndex: 1,
                            }}
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={displayImage}
                                alt="FOF Portrait"
                                width={380}
                                height={380}
                                style={{
                                    objectFit: "cover",
                                }}
                            />
                        </div>
                    </div>

                    {/* User info with social proof */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            marginTop: "8px",
                        }}
                    >
                        <span
                            style={{
                                fontSize: "24px",
                                fontWeight: 700,
                                color: "#FFFFFF",
                                letterSpacing: "-0.5px",
                            }}
                        >
                            @{username}
                        </span>
                        <span
                            style={{
                                width: "4px",
                                height: "4px",
                                borderRadius: "50%",
                                background: "#4A4A5A",
                            }}
                        />
                        <span
                            style={{
                                fontSize: "20px",
                                fontWeight: 500,
                                color: "#A0A0B8",
                            }}
                        >
                            + {friendCount} friends
                        </span>
                    </div>

                    {/* CTA Button */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            background: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
                            padding: "12px 28px",
                            borderRadius: "30px",
                            marginTop: "8px",
                            boxShadow: "0 8px 24px rgba(255,215,0,0.3)",
                        }}
                    >
                        <span
                            style={{
                                fontSize: "18px",
                                fontWeight: 700,
                                color: "#1A1A2E",
                                letterSpacing: "0.5px",
                            }}
                        >
                            Create Yours →
                        </span>
                    </div>

                    {/* Edition badge */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            marginTop: "4px",
                        }}
                    >
                        <span
                            style={{
                                fontSize: "13px",
                                fontWeight: 500,
                                color: "#6A6A7A",
                                letterSpacing: "1px",
                            }}
                        >
                            ✨ CHRISTMAS EDITION 2025 ✨
                        </span>
                    </div>
                </div>
            </div>
        ),
        {
            width: 1200,
            height: 630,
        }
    );
}
