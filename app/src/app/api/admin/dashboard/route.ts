import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DEMO_COHORT_IDS } from "@/lib/demo";

export async function GET(req: NextRequest) {
  try {
    const orgId = req.headers.get("x-org-id");
    if (!orgId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // All cohorts with students (exclude demo cohorts)
    const cohorts = await prisma.cohort.findMany({
      where: { orgId, id: { notIn: [...DEMO_COHORT_IDS] } },
      include: {
        students: {
          include: {
            user: { select: { id: true, email: true } },
            ventureProfile: { select: { name: true } },
          },
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    const allStudentIds = cohorts.flatMap((c) => c.students.map((s) => s.id));

    // Latest trust score per student
    const allScores = await prisma.trustScore.findMany({
      where: { studentId: { in: allStudentIds } },
      orderBy: { month: "desc" },
    });
    const latestScoreMap = new Map<string, { score: number; label: string; month: string }>();
    for (const s of allScores) {
      if (!latestScoreMap.has(s.studentId)) {
        latestScoreMap.set(s.studentId, { score: s.score, label: s.label, month: s.month });
      }
    }

    const cohortsWithScores = cohorts.map((cohort) => ({
      id: cohort.id,
      name: cohort.name,
      students: cohort.students.map((s) => {
        const score = latestScoreMap.get(s.id) ?? null;
        return {
          id: s.id,
          userId: s.userId,
          email: s.user.email,
          venture: s.ventureProfile?.name ?? null,
          score: score?.score ?? null,
          label: score?.label ?? null,
          month: score?.month ?? null,
        };
      }),
    }));

    // Needs attention — red students sorted by score ascending
    const redStudents = cohortsWithScores
      .flatMap((c) =>
        c.students
          .filter((s) => s.label === "RED")
          .map((s) => ({ ...s, cohortName: c.name }))
      )
      .sort((a, b) => (a.score ?? 0) - (b.score ?? 0));

    // Pending P&L reviews
    const pendingPLCount = await prisma.pLSubmission.count({
      where: {
        status: "SUBMITTED",
        student: { user: { orgId } },
      },
    });

    // Next upcoming check-in session
    const nextCheckIn = await prisma.checkInSession.findFirst({
      where: {
        cohort: { orgId },
        date: { gte: new Date() },
      },
      orderBy: { date: "asc" },
      select: {
        id: true,
        date: true,
        cohort: { select: { name: true } },
      },
    });

    return NextResponse.json({
      cohorts: cohortsWithScores,
      needsAttention: redStudents,
      pendingPLReviews: pendingPLCount,
      nextCheckIn: nextCheckIn
        ? { id: nextCheckIn.id, date: nextCheckIn.date, cohortName: nextCheckIn.cohort.name }
        : null,
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
