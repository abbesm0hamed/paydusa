import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const MEDUSA_BACKEND_URL =
  process.env.MEDUSA_BACKEND_URL || "http://localhost:9100";

const PUBLISHABLE_API_KEY =
  process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "";

export const POST = async (request: NextRequest) => {
  try {
    const { query } = await request.json();

    if (typeof query !== "string" || !query.trim()) {
      return NextResponse.json(
        { error: "A search query is required" },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${MEDUSA_BACKEND_URL}/store/products/search`,
      {
        body: JSON.stringify({ query: query.trim() }),
        headers: {
          "Content-Type": "application/json",
          "x-publishable-api-key": PUBLISHABLE_API_KEY,
        },
        method: "POST",
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        {
          error:
            "Product search is temporarily unavailable. Please try again later.",
        },
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
};
