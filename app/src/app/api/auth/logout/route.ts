import { NextRequest, NextResponse } from "next/server";
import { revokeAllRefreshTokens } from "@/lib/auth/tokens";
import { verifyRefreshToken } from "@/lib/auth/jwt";

export async function POST(req: NextRequest) {
  try {
    const raw = req.cookies.get("refresh_token")?.value;

    if (raw) {
      try {
        const payload = verifyRefreshToken(raw);
        await revokeAllRefreshTokens(payload.sub);
      } catch {
        // Token already invalid — still clear the cookie
      }
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.set("refresh_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/api/auth",
      maxAge: 0,
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
