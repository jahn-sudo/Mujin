import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { GraduationStatus } from "@/generated/prisma/enums";

/**
 * POST /api/admin/students/[id]/graduation/record-interview
 *
 * S8.3 — Staff records the exit interview result.
 * Requires: status = INTERVIEW_SCHEDULED
 * Body: { result: "PASSED" | "FAILED" }
 *
 * PASSED → INTERVIEW_PASSED
 * FAILED → INTERVIEW_FAILED, then reset to INELIGIBLE.
 *          Sets lastInterviewFailedAt so detectEligibility requires
 *          6 NEW consecutive GREEN months after this date.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const orgId = req.headers.get("x-org-id");
    if (!orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id: studentId } = await params;
    const body = await req.json();
    const { result } = body;

    if (result !== "PASSED" && result !== "FAILED") {
      return NextResponse.json({ error: "result must be PASSED or FAILED" }, { status: 400 });
    }

    const student = await prisma.studentProfile.findUnique({
      where: { id: studentId },
      select: { user: { select: { orgId: true } }, graduationRecord: true },
    });

    if (!student) return NextResponse.json({ error: "Student not found" }, { status: 404 });
    if (student.user.orgId !== orgId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const record = student.graduationRecord;
    if (!record || record.status !== GraduationStatus.INTERVIEW_SCHEDULED) {
      return NextResponse.json(
        { error: "No interview is currently scheduled for this student" },
        { status: 409 }
      );
    }

    const now = new Date();

    let updated;
    if (result === "PASSED") {
      updated = await prisma.graduationRecord.update({
        where: { studentId },
        data: {
          status: GraduationStatus.INTERVIEW_PASSED,
          interviewResult: "PASSED",
          interviewConductedAt: now,
        },
      });
    } else {
      // FAILED: record the failure, then reset to INELIGIBLE.
      // lastInterviewFailedAt anchors the green streak — student needs
      // 6 NEW consecutive GREEN months after this date to re-qualify.
      updated = await prisma.graduationRecord.update({
        where: { studentId },
        data: {
          status: GraduationStatus.INELIGIBLE,
          interviewResult: "FAILED",
          interviewConductedAt: now,
          lastInterviewFailedAt: now,
        },
      });
    }

    return NextResponse.json({ graduationRecord: updated });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
