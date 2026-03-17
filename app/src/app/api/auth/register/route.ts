import { NextRequest, NextResponse } from "next/server";
import { prisma, TxClient } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth/password";
import { signAccessToken } from "@/lib/auth/jwt";
import { issueRefreshToken } from "@/lib/auth/tokens";
import { Role } from "@/generated/prisma/enums";

// S1.3 — Registration endpoint
// S1.8 — Consent logging (ConsentRecord written on successful registration)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, orgId, role, tosVersion } = body;

    if (!email || !password || !orgId || !role || !tosVersion) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate role is a known value
    if (!Object.values(Role).includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    // S1.9 — MENTOR cannot be assigned STAFF / ORG_ADMIN (and vice versa)
    const mentorConflict =
      (role === Role.MENTOR &&
        [Role.STAFF, Role.ORG_ADMIN, Role.SUPER_ADMIN].includes(role)) ||
      ([Role.STAFF, Role.ORG_ADMIN, Role.SUPER_ADMIN].includes(role) &&
        role === Role.MENTOR);
    if (mentorConflict) {
      return NextResponse.json(
        { error: "MENTOR role cannot be combined with STAFF or ADMIN roles" },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    const org = await prisma.organization.findUnique({ where: { id: orgId } });
    if (!org) {
      return NextResponse.json(
        { error: "Organization not found" },
        { status: 404 }
      );
    }

    const passwordHash = await hashPassword(password);
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;

    const user = await prisma.$transaction(async (tx: TxClient) => {
      const newUser = await tx.user.create({
        data: { email, passwordHash, role, orgId },
      });

      // S1.8 — Consent record
      await tx.consentRecord.create({
        data: { userId: newUser.id, tosVersion, ipAddress: ip },
      });

      return newUser;
    });

    const accessToken = signAccessToken({
      sub: user.id,
      orgId: user.orgId,
      role: user.role,
    });
    const refreshToken = await issueRefreshToken(user.id);

    const response = NextResponse.json(
      { userId: user.id, role: user.role },
      { status: 201 }
    );

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
