import { z } from "zod";

const envSchema = z.object({
  // Server-side variables
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  FAL_KEY: z.string().min(1, "FAL_KEY is required for image generation"),
  APP_FID: z.string().optional().default("0"),
  WAFFLES_API_KEY: z.string().optional(),
  WAFFLES_APP_ID: z.string().optional(),

  // Public variables (available on client if prefixed with NEXT_PUBLIC_)
  NEXT_PUBLIC_APP_URL: z.string().url().default("https://fof.app"),
  NEXT_PUBLIC_ONCHAINKIT_API_KEY: z.string().optional(),
  NEXT_PUBLIC_ACCOUNT_ASSOCIATION_HEADER: z.string().optional(),
  NEXT_PUBLIC_ACCOUNT_ASSOCIATION_PAYLOAD: z.string().optional(),
  NEXT_PUBLIC_ACCOUNT_ASSOCIATION_SIGNATURE: z.string().optional(),
});

// Parse and validate environment variables
// This will throw if required variables are missing, enforcing them at build/runtime
const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error(
    "❌ Invalid environment variables:",
    parsedEnv.error.flatten().fieldErrors
  );
  throw new Error("Invalid environment variables");
}

export const env = {
  databaseUrl: parsedEnv.data.DATABASE_URL,
  rootUrl: parsedEnv.data.NEXT_PUBLIC_APP_URL,
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

  // New variables
  falKey: parsedEnv.data.FAL_KEY,
  appFid: parseInt(parsedEnv.data.APP_FID, 10),
};
