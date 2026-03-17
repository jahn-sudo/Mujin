import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { computeMajorityAttendance } from "@/lib/attendance/majorityRule";
import { assessReflection } from "@/lib/ai/reflectionAssessor";
import { getQuarter, resolveResubmissionState } from "@/lib/attendance/resubmissionLogic";
import { ReflectionResult } from "@/generated/prisma/enums";
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

    // Verify town hall exists
    const townHall = await prisma.townHall.findUnique({
      where: { id: townHallId },
    });
    if (!townHall) {
      return NextResponse.json(
        { error: "Town Hall not found" },
        { status: 404 }
      );
    }

    // Check for duplicate submission
    const existing = await prisma.townHallSubmission.findUnique({
      where: { townHallId_submittedById: { townHallId, submittedById: userId } },
    });
    if (existing) {
      return NextResponse.json(
        { error: "You have already submitted for this Town Hall" },
        { status: 409 }
      );
    }

    const body = await req.json();
    const { attendeeIds, reflectionText } = body;

    if (!Array.isArray(attendeeIds)) {
      return NextResponse.json(
        { error: "attendeeIds must be an array" },
        { status: 400 }
      );
    }

    if (
      typeof reflectionText !== "string" ||
      reflectionText.trim().length === 0
    ) {
      return NextResponse.json(
        { error: "reflectionText is required" },
        { status: 400 }
      );
    }

    // Validate attendeeIds are members of student's cohort
    const studentProfile = await prisma.studentProfile.findUnique({
      where: { userId },
      select: { id: true, cohortId: true },
    });
    if (!studentProfile?.cohortId) {
      return NextResponse.json(
        { error: "Student is not assigned to a cohort" },
        { status: 403 }
      );
    }

    if (attendeeIds.length > 0) {
      const cohortMembers = await prisma.studentProfile.findMany({
        where: { cohortId: studentProfile.cohortId },
        select: { userId: true },
      });
      const cohortUserIds = cohortMembers.map((m) => m.userId);
      const invalidIds = attendeeIds.filter(
        (id: string) => !cohortUserIds.includes(id)
      );
      if (invalidIds.length > 0) {
        return NextResponse.json(
          { error: "attendeeIds contains users not in your cohort" },
          { status: 400 }
        );
      }
    }

    // Create submission (attended = null, computed after)
    const submission = await prisma.townHallSubmission.create({
      data: {
        townHallId,
        submittedById: userId,
        attendeeIds,
        reflectionText,
        attended: null,
      },
      // Never return reflectionText in response
      select: {
        id: true,
        townHallId: true,
        submittedById: true,
        attendeeIds: true,
        attended: true,
        submittedAt: true,
      },
    });

    // Compute majority-rule attendance (fire and forget)
    computeMajorityAttendance(townHallId, studentProfile.cohortId).catch(() => {});

    // AI reflection assessment + resubmission state (fire and forget)
    ;(async () => {
      try {
        const result = await assessReflection(reflectionText);
        const quarter = getQuarter(new Date());
        const { resubmissionState, windowExpiresAt } =
          await resolveResubmissionState(userId, quarter, result as ReflectionResult);

        await prisma.reflectionAssessment.create({
          data: {
            submissionId: submission.id,
            result: result as ReflectionResult,
            resubmissionState,
            windowExpiresAt,
            quarter,
          },
        });

        // Recompute trust score now that reflection is assessed
        const month = monthFromDate(townHall.date);
        await calculateTrustScore(studentProfile.id, month).catch(() => {});
      } catch {
        // Assessment failure is non-blocking; score will default to 0 until resolved
      }
    })();

    return NextResponse.json(submission, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
