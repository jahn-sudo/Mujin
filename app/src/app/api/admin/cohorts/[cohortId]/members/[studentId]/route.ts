import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteContext = { params: Promise<{ cohortId: string; studentId: string }> };

// S2.6 — Remove student from cohort
export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  try {
    const { cohortId, studentId } = await params;
    const orgId = _req.headers.get("x-org-id");
    if (!orgId) {
      return NextResponse.json({ error: "Missing org context" }, { status: 400 });
    }

    const cohort = await prisma.cohort.findFirst({ where: { id: cohortId, orgId } });
    if (!cohort) {
      return NextResponse.json({ error: "Cohort not found" }, { status: 404 });
    }

    const student = await prisma.studentProfile.findUnique({
      where: { userId: studentId },
    });
    if (!student || student.cohortId !== cohortId) {
      return NextResponse.json(
        { error: "Student not found in this cohort" },
        { status: 404 }
      );
    }

    await prisma.studentProfile.update({
      where: { id: student.id },
      data: { cohortId: null },
    });

    return NextResponse.json({ message: "Student removed from cohort" });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
