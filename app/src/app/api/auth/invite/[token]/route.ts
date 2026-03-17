import { NextRequest, NextResponse } from "next/server";
import { prisma, TxClient } from "@/lib/prisma";
import { validateInviteToken, consumeInviteToken } from "@/lib/auth/inviteTokens";
import { hashPassword } from "@/lib/auth/password";
import { Role } from "@/generated/prisma/enums";

// S2.3 — Validate token (pre-fill form)
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const record = await validateInviteToken(token);

    if (!record) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      email: record.email,
      role: record.role,
      cohortId: record.cohortId ?? undefined,
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// S2.3 — Accept invite: create User (+ StudentProfile if STUDENT, + MentorCohortAssignment if MENTOR)
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const body = await req.json();
    const { password, tosVersion } = body;

    if (!password || typeof password !== "string" || password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    if (!tosVersion) {
      return NextResponse.json({ error: "tosVersion is required" }, { status: 400 });
    }

    const record = await validateInviteToken(token);
    if (!record) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    // Check for existing user with same email
    const existing = await prisma.user.findUnique({
      where: { email: record.email },
    });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      req.headers.get("x-real-ip") ??
      null;

    const user = await prisma.$transaction(async (tx: TxClient) => {
      const newUser = await tx.user.create({
        data: {
          email: record.email,
          passwordHash,
          role: record.role,
          orgId: record.orgId,
        },
      });

      // Consent record
      await tx.consentRecord.create({
        data: { userId: newUser.id, tosVersion, ipAddress: ip },
      });

      // STUDENT → create StudentProfile
      if (record.role === Role.STUDENT) {
        await tx.studentProfile.create({
          data: { userId: newUser.id },
        });
      }

      // MENTOR + cohortId → create MentorCohortAssignment
      if (record.role === Role.MENTOR && record.cohortId) {
        await tx.mentorCohortAssignment.create({
          data: { mentorId: newUser.id, cohortId: record.cohortId },
        });
      }

      // Mark invite token as accepted
      await tx.inviteToken.update({
        where: { id: record.id },
        data: { acceptedAt: new Date() },
      });

      return newUser;
    });

    return NextResponse.json({ userId: user.id, role: user.role }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
