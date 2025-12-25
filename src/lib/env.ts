// Environment configuration for MiniApp
// All values can be overridden via environment variables

export const env = {
  // Database URL for Prisma
  databaseUrl: process.env.DATABASE_URL,

  // Root URL of the app
  rootUrl: process.env.NEXT_PUBLIC_APP_URL || "https://fof.app",

  // Home URL path (where the app loads)
  homeUrlPath: "/",

  // OnchainKit API Key (from Coinbase Developer Portal)
  onchainKitApiKey: process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY || "",

  // Account Association (generated using Farcaster Developer Tools)
  // These are used to verify domain ownership to your Farcaster account
  // Generate at: https://farcaster.xyz/~/developers/mini-apps/manifest
  accountAssociation: {
    header: process.env.NEXT_PUBLIC_ACCOUNT_ASSOCIATION_HEADER || "",
    payload: process.env.NEXT_PUBLIC_ACCOUNT_ASSOCIATION_PAYLOAD || "",
    signature: process.env.NEXT_PUBLIC_ACCOUNT_ASSOCIATION_SIGNATURE || "",
  },

  // Waffles API (optional)
  wafflesApiKey: process.env.WAFFLES_API_KEY || "",
  wafflesAppId: process.env.WAFFLES_APP_ID || "",
};
