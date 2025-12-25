// Design System Constants
// Based on the elevated UI/UX design document

export const COLORS = {
  // Primary
  primaryRed: "#E94560",
  secondaryPurple: "#533483",
  accentGold: "#FFD700",

  // Background
  bgDarkStart: "#0A0A0F",
  bgDarkEnd: "#1A1A2E",

  // Surfaces
  surfaceGlass: "rgba(255, 255, 255, 0.05)",
  surfaceGlassBorder: "rgba(255, 255, 255, 0.1)",

  // Text
  textPrimary: "#FFFFFF",
  textSecondary: "#A0A0B0",

  // Status
  successGreen: "#00D26A",
  errorRed: "#FF4444",

  // Glow effects
  glowRed: "rgba(233, 69, 96, 0.4)",
  glowGold: "rgba(255, 215, 0, 0.4)",
  glowPurple: "rgba(83, 52, 131, 0.4)",
} as const;

export const SPACING = {
  xs: "4px",
  sm: "8px",
  md: "16px",
  lg: "24px",
  xl: "32px",
  xxl: "48px",
} as const;

export const RADII = {
  sm: "8px",
  md: "16px",
  lg: "24px",
  xl: "32px",
  full: "50%",
} as const;

export const TYPOGRAPHY = {
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  display: { size: "32px", weight: 700 },
  title: { size: "24px", weight: 600 },
  subtitle: { size: "18px", weight: 500 },
  body: { size: "16px", weight: 400 },
  small: { size: "14px", weight: 400 },
  micro: { size: "12px", weight: 500 },
} as const;

// Asset paths
export const ASSETS = {
  // Logo
  logo: "/assets/fof-logo.png",
  wafflesLogo: "/assets/waffles-logo.png",

  // 3D Elements
  snowflake: "/assets/3d-snowflake.png",
  wafflesCoin: "/assets/3d-waffles-coin.png",
  star: "/assets/3d-star.png",

  // Backgrounds
  networkPattern: "/assets/bg-network-pattern.png",
  celebrationBg: "/assets/bg-celebration.png",

  // Samples
  sampleFof: "/assets/sample-fof.png",
  ogImage: "/assets/og-image.png",

  // Default avatar for missing pfps
  defaultAvatar: "/assets/default-avatar.png",
} as const;

// App configuration
export const APP_CONFIG = {
  name: "FOF: Friends of Farcaster",
  edition: "Christmas Edition 2025",
  version: "1.0.0",

  // Pricing
  price: 1.0, // $1 USD

  // Points
  pointsForGeneration: 100,
  wafflesBonusPoints: 1000, // Bonus for checking out Waffles

  // Generation
  maxFriends: 12,
  generationTimeout: 30000, // 30 seconds

  // Waffles Integration
  wafflesMiniappUrl: "https://farcaster.xyz/miniapps/sbpPNle-R2-V/waffles",

  // Airdrop
  airdropPercent: 50, // 50% of $FOF supply

  // Share
  shareText:
    "Just created my Friends of Farcaster portrait! 🎄✨\n\nMy network, transformed into art.\n\nGet yours:",
} as const;
