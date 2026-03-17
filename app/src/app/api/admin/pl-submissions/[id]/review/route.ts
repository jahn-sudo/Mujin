import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PLSubmissionStatus, PLReviewAction } from "@/generated/prisma/enums";

const VALID_ACTIONS = [
  PLReviewAction.APPROVED,
  PLReviewAction.FLAGGED,
  PLReviewAction.MORE_INFO,
] as string[];

const ACTION_TO_STATUS: Record<string, PLSubmissionStatus> = {
  [PLReviewAction.APPROVED]: PLSubmissionStatus.APPROVED,
  [PLReviewAction.FLAGGED]: PLSubmissionStatus.FLAGGED,
  [PLReviewAction.MORE_INFO]: PLSubmissionStatus.MORE_INFO,
};

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
    const { action, annotation } = body;

    if (!action || !VALID_ACTIONS.includes(action)) {
      return NextResponse.json(
        { error: `action must be one of: ${VALID_ACTIONS.join(", ")}` },
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

    // Create review + update submission status in transaction
    const [review] = await prisma.$transaction([
      prisma.pLReview.create({
        data: {
          submissionId: id,
          staffId,
          action: action as PLReviewAction,
          annotation: annotation ?? null,
        },
        select: {
          id: true,
          action: true,
          createdAt: true,
        },
      }),
      prisma.pLSubmission.update({
        where: { id },
        data: { status: ACTION_TO_STATUS[action] },
      }),
    ]);

    return NextResponse.json(review, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
