import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { GraduationStatus } from "@/generated/prisma/enums";

/**
 * POST /api/admin/students/[id]/graduation/schedule-interview
 *
 * S8.2 — Staff schedules the exit interview.
 * Requires: status = ELIGIBLE
 * Body: { interviewDate: string (ISO 8601) }
 * Transition: ELIGIBLE → INTERVIEW_SCHEDULED
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
    const { interviewDate } = body;

    if (!interviewDate) {
      return NextResponse.json({ error: "interviewDate is required" }, { status: 400 });
    }

    const parsedDate = new Date(interviewDate);
    if (isNaN(parsedDate.getTime())) {
      return NextResponse.json({ error: "Invalid interviewDate" }, { status: 400 });
    }

    const student = await prisma.studentProfile.findUnique({
      where: { id: studentId },
      select: { user: { select: { orgId: true } }, graduationRecord: true },
    });

    if (!student) return NextResponse.json({ error: "Student not found" }, { status: 404 });
    if (student.user.orgId !== orgId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const record = student.graduationRecord;
    if (!record || record.status !== GraduationStatus.ELIGIBLE) {
      return NextResponse.json(
        { error: "Student is not currently ELIGIBLE for graduation" },
        { status: 409 }
      );
    }

    const updated = await prisma.graduationRecord.update({
      where: { studentId },
      data: {
        status: GraduationStatus.INTERVIEW_SCHEDULED,
        interviewScheduledAt: new Date(),
        interviewDate: parsedDate,
      },
    });

    return NextResponse.json({ graduationRecord: updated });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
