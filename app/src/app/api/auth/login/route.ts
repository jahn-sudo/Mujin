import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth/password";
import { signAccessToken } from "@/lib/auth/jwt";
import { issueRefreshToken } from "@/lib/auth/tokens";

// S1.4 — Login endpoint
export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Missing email or password" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });

    // Constant-time rejection — do not reveal whether email exists
    if (!user || user.deletedAt !== null) {
      await verifyPassword("__dummy__", "$2a$12$dummyhashplaceholderXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const accessToken = signAccessToken({
      sub: user.id,
      orgId: user.orgId,
      role: user.role,
    });
    const refreshToken = await issueRefreshToken(user.id);

    const response = NextResponse.json({ userId: user.id, role: user.role });

    response.cookies.set("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/api/auth",
      maxAge: 60 * 60 * 24 * 30,
    });

    response.headers.set("Authorization", `Bearer ${accessToken}`);

    return response;
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
