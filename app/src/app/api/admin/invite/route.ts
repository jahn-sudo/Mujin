import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { issueInviteToken } from "@/lib/auth/inviteTokens";
import { sendActivationEmail } from "@/lib/email";
import { Role } from "@/generated/prisma/enums";

const ALLOWED_ROLES: Role[] = [Role.STUDENT, Role.MENTOR];

// S2.2 — Staff sends activation link to accepted applicant or mentor
export async function POST(req: NextRequest) {
  try {
    const orgId = req.headers.get("x-org-id");
    const createdById = req.headers.get("x-user-id");

    if (!orgId || !createdById) {
      return NextResponse.json({ error: "Missing org context" }, { status: 400 });
    }

    const body = await req.json();
    const { email, role, cohortId } = body;

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
    }

    if (!role || !ALLOWED_ROLES.includes(role)) {
      return NextResponse.json(
        { error: "role must be STUDENT or MENTOR" },
        { status: 400 }
      );
    }

    // MENTOR requires cohortId
    if (role === Role.MENTOR) {
      if (!cohortId) {
        return NextResponse.json(
          { error: "cohortId is required when role is MENTOR" },
          { status: 400 }
        );
      }

      // Verify cohort belongs to this org
      const cohort = await prisma.cohort.findFirst({
        where: { id: cohortId, orgId },
      });
      if (!cohort) {
        return NextResponse.json(
          { error: "Cohort not found in this organisation" },
          { status: 400 }
        );
      }

      // Check cohort doesn't already have a mentor (S2.7 conflict check)
      const existingMentor = await prisma.mentorCohortAssignment.findUnique({
        where: { cohortId },
      });
      if (existingMentor) {
        return NextResponse.json(
          { error: "Cohort already has a mentor" },
          { status: 409 }
        );
      }
    }

    const raw = await issueInviteToken({
      email: email.trim().toLowerCase(),
      role,
      orgId,
      cohortId: cohortId ?? undefined,
      createdById,
    });

    const appUrl = process.env.APP_URL ?? "http://localhost:3000";
    const activationUrl = `${appUrl}/activate?token=${raw}`;

    await sendActivationEmail(email, activationUrl, role);

    return NextResponse.json({ message: "Invitation sent" });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
