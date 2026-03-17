import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signAccessToken } from "@/lib/auth/jwt";
import { rotateRefreshToken } from "@/lib/auth/tokens";

// S1.5 — Refresh token rotation
export async function POST(req: NextRequest) {
  try {
    const raw = req.cookies.get("refresh_token")?.value;

    if (!raw) {
      return NextResponse.json(
        { error: "No refresh token" },
        { status: 401 }
      );
    }

    const newRefreshToken = await rotateRefreshToken(raw);

    // Re-fetch user to build access token payload
    const user = await prisma.user.findFirst({
      where: {
        refreshTokens: {
          some: { rotatedAt: null },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    const accessToken = signAccessToken({
      sub: user.id,
      orgId: user.orgId,
      role: user.role,
    });

    const response = NextResponse.json({ ok: true });

    response.cookies.set("refresh_token", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/api/auth",
      maxAge: 60 * 60 * 24 * 30,
    });

    response.headers.set("Authorization", `Bearer ${accessToken}`);

    return response;
  } catch {
    return NextResponse.json({ error: "Invalid refresh token" }, { status: 401 });
  }
}
