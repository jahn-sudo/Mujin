import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const orgId = req.headers.get("x-org-id");
    if (!orgId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: townHallId } = await params;

    const townHall = await prisma.townHall.findUnique({
      where: { id: townHallId },
      select: { id: true, date: true, orgId: true },
    });

    if (!townHall) {
      return NextResponse.json({ error: "Town Hall not found" }, { status: 404 });
    }
    if (townHall.orgId !== orgId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const cohorts = await prisma.cohort.findMany({
      where: { orgId },
      include: { students: { select: { id: true, userId: true } } },
      orderBy: { createdAt: "asc" },
    });

    // Never select reflectionText — attendance + attended flag only
    const submissions = await prisma.townHallSubmission.findMany({
      where: { townHallId },
      select: { submittedById: true, attendeeIds: true, attended: true, submittedAt: true },
    });

    const submittedByIds = new Set(submissions.map((s) => s.submittedById));
    const alpha = "ABCDE";

    const groups = cohorts.map((cohort) => {
      const memberUserIds = cohort.students.map((s) => s.userId);
      const cohortSubs = submissions.filter((s) => memberUserIds.includes(s.submittedById));
      const attendedCount = cohortSubs.filter((s) => s.attended === true).length;
      const totalStudents = cohort.students.length;
      const majority = Math.ceil(totalStudents / 2);

      return {
        cohortId: cohort.id,
        cohortName: cohort.name,
        totalStudents,
        submittedCount: cohortSubs.length,
        attendedCount,
        majorityAttended: attendedCount >= majority,
        sentiment: null, // AI-structured sentiment — Sprint 7 (E9)
        members: cohort.students.map((member, i) => ({
          initial: alpha[i] ?? String(i + 1),
          submitted: submittedByIds.has(member.userId),
          attended: submissions.find((s) => s.submittedById === member.userId)?.attended ?? null,
        })),
      };
    });

    return NextResponse.json(groups);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
