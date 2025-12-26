import { z } from "zod";

// Check if we're on the server
const isServer = typeof window === "undefined";

const envSchema = z.object({
  // Server-side variables (optional in schema, validated at access time)
  DATABASE_URL: z.string().optional(),
  FAL_KEY: z.string().optional(),
  APP_FID: z.string().optional().default("0"),
  WAFFLES_API_KEY: z.string().optional(),
  WAFFLES_APP_ID: z.string().optional(),

  // Public variables (available on client if prefixed with NEXT_PUBLIC_)
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  NEXT_PUBLIC_ONCHAINKIT_API_KEY: z.string().optional(),
  NEXT_PUBLIC_ACCOUNT_ASSOCIATION_HEADER: z.string().optional(),
  NEXT_PUBLIC_ACCOUNT_ASSOCIATION_PAYLOAD: z.string().optional(),
  NEXT_PUBLIC_ACCOUNT_ASSOCIATION_SIGNATURE: z.string().optional(),
});

// Parse environment variables
const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error(
    "❌ Invalid environment variables:",
    parsedEnv.error.flatten().fieldErrors
  );
  throw new Error("Invalid environment variables");
}

// Helper to get server-only env var with validation
function getServerEnv<T extends string>(
  key: T,
  value: string | undefined
): string {
  if (isServer && !value) {
    throw new Error(`Missing required server environment variable: ${key}`);
  }
  return value || "";
}

export const env = {
  // Server-only (validated at access time)
  get databaseUrl() {
    return getServerEnv("DATABASE_URL", parsedEnv.data.DATABASE_URL);
  },
  get falKey() {
    return getServerEnv("FAL_KEY", parsedEnv.data.FAL_KEY);
  },

  // Public
  rootUrl: parsedEnv.data.NEXT_PUBLIC_APP_URL || "https://fof.playwaffles.fun",
  homeUrlPath: "/",
  onchainKitApiKey: parsedEnv.data.NEXT_PUBLIC_ONCHAINKIT_API_KEY || "",

  // Account Association
  accountAssociation: {
    header: parsedEnv.data.NEXT_PUBLIC_ACCOUNT_ASSOCIATION_HEADER || "",
    payload: parsedEnv.data.NEXT_PUBLIC_ACCOUNT_ASSOCIATION_PAYLOAD || "",
    signature: parsedEnv.data.NEXT_PUBLIC_ACCOUNT_ASSOCIATION_SIGNATURE || "",
  },

  wafflesApiKey: parsedEnv.data.WAFFLES_API_KEY || "",
  wafflesAppId: parsedEnv.data.WAFFLES_APP_ID || "",
  appFid: parseInt(parsedEnv.data.APP_FID || "0", 10),
};
