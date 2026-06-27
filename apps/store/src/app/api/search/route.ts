import { NextRequest, NextResponse } from "next/server";

const MEDUSA_BACKEND_URL =
  process.env.MEDUSA_BACKEND_URL || "http://localhost:9100";

const PUBLISHABLE_API_KEY =
  process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "";

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();

    if (!query || typeof query !== "string") {
      return NextResponse.json(
        { error: "A search query is required" },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${MEDUSA_BACKEND_URL}/store/products/search`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-publishable-api-key": PUBLISHABLE_API_KEY,
        },
        body: JSON.stringify({ query }),
      }
    );

    if (!response.ok) {
      const text = await response.text();
      return NextResponse.json(
        { error: `Backend responded with ${response.status}: ${text}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Search API route error:", error);
    return NextResponse.json(
      { error: "Internal search error" },
      { status: 500 }
    );
  }
}
