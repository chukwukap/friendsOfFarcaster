import { NextResponse } from "next/server";

/**
 * Health check endpoint for Railway
 */
export async function GET() {
  return NextResponse.json({
    status: "ok",
    app: "FOF Christmas Edition",
    timestamp: new Date().toISOString(),
  });
}
