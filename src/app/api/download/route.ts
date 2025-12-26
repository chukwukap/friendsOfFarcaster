import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/download
 *
 * Proxies an image and serves it with download headers.
 * This triggers a true file download in the browser.
 *
 * Query params:
 * - url: The image URL to download
 * - filename: Optional filename for the download
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get("url");
  const filename = searchParams.get("filename") || `fof-${Date.now()}.png`;

  if (!imageUrl) {
    return NextResponse.json(
      { error: "Missing url parameter" },
      { status: 400 }
    );
  }

  try {
    // Fetch the image
    const response = await fetch(imageUrl);

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch image" },
        { status: response.status }
      );
    }

    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();

    // Return with download headers
    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": blob.type || "image/png",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": arrayBuffer.byteLength.toString(),
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("Download proxy error:", error);
    return NextResponse.json(
      { error: "Failed to download image" },
      { status: 500 }
    );
  }
}
