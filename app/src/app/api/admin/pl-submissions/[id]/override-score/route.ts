import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PLReviewAction } from "@/generated/prisma/enums";
import { calculateTrustScore } from "@/lib/scoring/trustScore";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const orgId = req.headers.get("x-org-id");
    const staffId = req.headers.get("x-user-id");
    if (!orgId || !staffId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { staffScore, reason } = body;

    if (
      typeof staffScore !== "number" ||
      !Number.isInteger(staffScore) ||
      staffScore < 0 ||
      staffScore > 100
    ) {
      return NextResponse.json(
        { error: "staffScore must be an integer between 0 and 100" },
        { status: 400 }
      );
    }

    if (!reason || typeof reason !== "string" || reason.trim().length === 0) {
      return NextResponse.json(
        { error: "reason is required for score override" },
        { status: 400 }
      );
    }

    // Verify submission exists and belongs to org
    const submission = await prisma.pLSubmission.findUnique({
      where: { id },
      include: { student: { select: { user: { select: { orgId: true } } } } },
    });

    if (!submission) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 }
      );
    }

    if (submission.student.user.orgId !== orgId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const [updated] = await prisma.$transaction([
      prisma.pLSubmission.update({
        where: { id },
        data: { staffScore, finalScore: staffScore },
        select: {
          id: true,
          autoScore: true,
          staffScore: true,
          finalScore: true,
          status: true,
        },
      }),
      prisma.pLReview.create({
        data: {
          submissionId: id,
          staffId,
          action: PLReviewAction.SCORE_OVERRIDE,
          scoreOverride: staffScore,
          overrideReason: reason.trim(),
        },
      }),
    ]);

    // Fire trust score recompute after staff overrides the P&L score (fire and forget)
    calculateTrustScore(submission.studentId, submission.month).catch(() => {});

    return NextResponse.json(updated, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
