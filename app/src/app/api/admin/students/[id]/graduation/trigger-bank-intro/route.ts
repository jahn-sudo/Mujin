import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { GraduationStatus } from "@/generated/prisma/enums";

/**
 * POST /api/admin/students/[id]/graduation/trigger-bank-intro
 *
 * S8.4 — Staff triggers the bank introduction, completing graduation.
 * Requires: status = INTERVIEW_PASSED
 * Transition: INTERVIEW_PASSED → GRADUATED
 * Writes bankIntroDate = now()
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const orgId = req.headers.get("x-org-id");
    if (!orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id: studentId } = await params;

    const student = await prisma.studentProfile.findUnique({
      where: { id: studentId },
      select: { user: { select: { orgId: true } }, graduationRecord: true },
    });

    if (!student) return NextResponse.json({ error: "Student not found" }, { status: 404 });
    if (student.user.orgId !== orgId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const record = student.graduationRecord;
    if (!record || record.status !== GraduationStatus.INTERVIEW_PASSED) {
      return NextResponse.json(
        { error: "Student must have a passed interview before bank introduction" },
        { status: 409 }
      );
    }

    const updated = await prisma.graduationRecord.update({
      where: { studentId },
      data: {
        status: GraduationStatus.GRADUATED,
        bankIntroDate: new Date(),
      },
    });

    return NextResponse.json({ graduationRecord: updated });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
