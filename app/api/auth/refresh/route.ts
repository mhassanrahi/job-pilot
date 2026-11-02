import { createRefreshAuthRouter } from "@insforge/sdk/ssr";
import { NextResponse } from "next/server";

const { POST: refreshAuth } = createRefreshAuthRouter();

export async function POST(request: Request): Promise<Response> {
  try {
    return await refreshAuth(request);
  } catch (error) {
    console.error("[api/auth/refresh] Unexpected refresh failure", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
