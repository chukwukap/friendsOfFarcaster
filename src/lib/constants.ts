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

// Asset paths (placeholder - user will add actual files)
export const ASSETS = {
  // Logo
  logo: "/assets/fof-logo.png",
  logoLight: "/assets/fof-logo-light.png",

  // Mascot
  mascotDefault: "/assets/mascot-default.png",
  mascotCelebrating: "/assets/mascot-celebrating.png",
  mascotThinking: "/assets/mascot-thinking.png",
  mascotSad: "/assets/mascot-sad.png",
  mascotWaving: "/assets/mascot-waving.png",

  // 3D Elements
  giftBox: "/assets/3d-gift-box.png",
  giftBoxOpening: "/assets/3d-gift-box-opening.png",
  snowflake: "/assets/3d-snowflake.png",
  wafflesCoin: "/assets/3d-waffles-coin.png",
  star: "/assets/3d-star.png",
  ornament: "/assets/3d-ornament.png",

  // Backgrounds
  networkPattern: "/assets/bg-network-pattern.png",
  celebrationBg: "/assets/bg-celebration.png",

  // Icons
  iconShare: "/assets/icon-share.png",
  iconWallet: "/assets/icon-wallet.png",
  iconProfile: "/assets/icon-profile.png",
  iconWand: "/assets/icon-wand.png",
  iconCheck: "/assets/icon-check.png",
  iconHeart: "/assets/icon-heart.png",

  // Overlays
  confettiOverlay: "/assets/overlay-confetti.png",
  sparklesOverlay: "/assets/overlay-sparkles.png",

  // Splash
  splash: "/assets/logo.png",

  // Default avatar for missing pfps
  defaultAvatar: "/assets/default-avatar.png",
} as const;

// Sound paths (placeholder - user will add actual files)
export const SOUNDS = {
  // Ambient
  winterAmbient: "/sounds/ambient-winter.mp3",
  networkPulse: "/sounds/ambient-network-pulse.mp3",
  successGlow: "/sounds/ambient-success-glow.mp3",

  // UI Interactions
  buttonTap: "/sounds/ui-button-tap.mp3",
  buttonHover: "/sounds/ui-button-hover.mp3",
  cardAppear: "/sounds/ui-card-appear.mp3",
  navigationSwipe: "/sounds/ui-navigation-swipe.mp3",
  toggleOn: "/sounds/ui-toggle-on.mp3",
  toggleOff: "/sounds/ui-toggle-off.mp3",

  // Progress
  progressStart: "/sounds/progress-start.mp3",
  progressTick: "/sounds/progress-tick.mp3",
  generationPulse: "/sounds/progress-generation-pulse.mp3",
  almostDone: "/sounds/progress-almost-done.mp3",

  // Celebration
  successReveal: "/sounds/celebration-success-reveal.mp3",
  confettiBurst: "/sounds/celebration-confetti-burst.mp3",
  pointsEarned: "/sounds/celebration-points-earned.mp3",
  pointsBonus: "/sounds/celebration-points-bonus.mp3",
  shareComplete: "/sounds/celebration-share-complete.mp3",

  // Error
  gentleError: "/sounds/error-gentle.mp3",
  connectionLost: "/sounds/error-connection-lost.mp3",
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
  pointsForCollect: 50,
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
