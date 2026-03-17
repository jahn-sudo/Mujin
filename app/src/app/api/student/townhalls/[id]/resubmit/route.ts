import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { assessReflection } from "@/lib/ai/reflectionAssessor";
import { getQuarter } from "@/lib/attendance/resubmissionLogic";
import { ReflectionResult, ResubmissionState } from "@/generated/prisma/enums";
import { calculateTrustScore, monthFromDate } from "@/lib/scoring/trustScore";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = req.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: townHallId } = await params;

    // Find existing submission for this student + town hall
    const submission = await prisma.townHallSubmission.findUnique({
      where: { townHallId_submittedById: { townHallId, submittedById: userId } },
      include: { reflectionAssessment: true },
    });

    if (!submission) {
      return NextResponse.json(
        { error: "No submission found for this Town Hall" },
        { status: 404 }
      );
    }

    const assessment = submission.reflectionAssessment;

    if (!assessment) {
      return NextResponse.json(
        { error: "Assessment not yet available" },
        { status: 409 }
      );
    }

    // Validate window is open and not expired
    if (assessment.resubmissionState !== ResubmissionState.WINDOW_OPEN) {
      return NextResponse.json(
        { error: "Resubmission window is not open" },
        { status: 409 }
      );
    }

    if (assessment.windowExpiresAt && assessment.windowExpiresAt < new Date()) {
      // Mark window as expired
      await prisma.reflectionAssessment.update({
        where: { id: assessment.id },
        data: { resubmissionState: ResubmissionState.WINDOW_EXPIRED },
      });
      return NextResponse.json(
        { error: "Resubmission window has expired" },
        { status: 409 }
      );
    }

    const body = await req.json();
    const { reflectionText } = body;

    if (typeof reflectionText !== "string" || reflectionText.trim().length === 0) {
      return NextResponse.json(
        { error: "reflectionText is required" },
        { status: 400 }
      );
    }

    // Update reflection text
    await prisma.townHallSubmission.update({
      where: { id: submission.id },
      data: { reflectionText },
    });

    // Re-assess
    const result = await assessReflection(reflectionText);
    const quarter = getQuarter(new Date());

    let newState: ResubmissionState;
    if (result === ReflectionResult.MEANINGFUL) {
      newState = ResubmissionState.RESUBMITTED;
    } else {
      // Second flag → locked
      newState = ResubmissionState.LOCKED;
    }

    const updatedAssessment = await prisma.reflectionAssessment.update({
      where: { id: assessment.id },
      data: {
        result: result as ReflectionResult,
        resubmissionState: newState,
        resubmittedAt: new Date(),
        quarter,
        windowExpiresAt: newState === ResubmissionState.LOCKED ? null : assessment.windowExpiresAt,
      },
      select: {
        result: true,
        resubmissionState: true,
        windowExpiresAt: true,
        resubmittedAt: true,
      },
    });

    // Fire trust score recompute after resubmission result changes (fire and forget)
    ;(async () => {
      try {
        const townHall = await prisma.townHall.findUnique({
          where: { id: townHallId },
          select: { date: true },
        });
        const studentProfile = await prisma.studentProfile.findUnique({
          where: { userId },
          select: { id: true },
        });
        if (townHall && studentProfile) {
          await calculateTrustScore(studentProfile.id, monthFromDate(townHall.date));
        }
      } catch {
        // Non-blocking
      }
    })();

    return NextResponse.json(updatedAssessment, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
