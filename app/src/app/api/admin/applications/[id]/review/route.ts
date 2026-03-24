import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ApplicationStatus } from "@/generated/prisma/enums";
import { issueInviteToken } from "@/lib/auth/inviteTokens";
import {
  sendApplicationAcceptedEmail,
  sendApplicationRejectedEmail,
  sendApplicationWaitlistedEmail,
} from "@/lib/email";

type RouteContext = { params: Promise<{ id: string }> };

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://mujin2.vercel.app";

// POST /api/admin/applications/[id]/review
// Body: { action: "ACCEPTED" | "REJECTED" | "WAITLISTED", note?: string, reviewerId: string }
//
// ACCEPTED → issues InviteToken + sends activation email (no User created yet — user creates
//            their own account on activation). StudentProfile created at activation time.
// REJECTED / WAITLISTED → updates status, sends notification email.
export async function POST(req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const orgId = req.headers.get("x-org-id");
    if (!orgId) {
      return NextResponse.json({ error: "Missing org context" }, { status: 400 });
    }

    const reviewerId = req.headers.get("x-user-id");
    if (!reviewerId) {
      return NextResponse.json({ error: "Missing user context" }, { status: 400 });
    }

    const body = await req.json();
    const { action, note } = body as { action: string; note?: string };

    const validActions: ApplicationStatus[] = ["ACCEPTED", "REJECTED", "WAITLISTED"];
    if (!validActions.includes(action as ApplicationStatus)) {
      return NextResponse.json(
        { error: "action must be ACCEPTED, REJECTED, or WAITLISTED" },
        { status: 400 }
      );
    }

    const application = await prisma.application.findFirst({
      where: { id, orgId },
    });

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    if (application.status !== "PENDING") {
      return NextResponse.json(
        { error: `Application is already ${application.status}` },
        { status: 409 }
      );
    }

    // Update application status
    const updated = await prisma.application.update({
      where: { id },
      data: {
        status: action as ApplicationStatus,
        reviewNote: note ?? null,
        reviewedAt: new Date(),
        reviewedById: reviewerId,
      },
    });

    // Send appropriate email
    if (action === "ACCEPTED") {
      // Issue invite token (no cohort yet — assigned later)
      const rawToken = await issueInviteToken({
        email: application.email,
        role: "STUDENT",
        orgId,
        createdById: reviewerId,
      });

      const activationUrl = `${BASE_URL}/activate?token=${rawToken}`;
      await sendApplicationAcceptedEmail(application.email, activationUrl);
    } else if (action === "REJECTED") {
      await sendApplicationRejectedEmail(application.email, note);
    } else {
      await sendApplicationWaitlistedEmail(application.email, note);
    }

    return NextResponse.json({ application: updated });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
