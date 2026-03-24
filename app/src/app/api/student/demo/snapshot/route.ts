import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const DEMO_STUDENT_EMAIL = "kai.watanabe@demo.mujin.jp";

/**
 * GET /api/student/demo/snapshot
 *
 * Always returns Kai Watanabe's data in the same shape as /api/student/me.
 * Used by the student Demo tab so any logged-in student sees a populated preview.
 */
export async function GET(req: NextRequest) {
  try {
    const orgId = req.headers.get("x-org-id");
    if (!orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const demoUser = await prisma.user.findUnique({
      where: { email: DEMO_STUDENT_EMAIL },
      select: { id: true, email: true },
    });
    if (!demoUser) return NextResponse.json({ error: "Demo data not seeded" }, { status: 404 });

    const student = await prisma.studentProfile.findUnique({
      where: { userId: demoUser.id },
      include: {
        user: { select: { id: true, email: true } },
        ventureProfile: { select: { name: true, description: true } },
        cohort: { select: { id: true, name: true } },
        graduationRecord: { select: { status: true } },
      },
    });
    if (!student) return NextResponse.json({ error: "Demo data not seeded" }, { status: 404 });

    const latestScore = await prisma.trustScore.findFirst({
      where: { studentId: student.id },
      orderBy: { month: "desc" },
      select: { score: true, label: true, month: true, responsivenessRaw: true, transparencyRaw: true, mutualismRaw: true, reflectionRaw: true },
    });

    const recentPLs = await prisma.pLSubmission.findMany({
      where: { studentId: student.id },
      orderBy: { month: "desc" },
      take: 6,
      select: { net: true },
    });
    let cashFlowStreak = 0;
    for (const pl of recentPLs) {
      if (pl.net !== null && pl.net >= 0) cashFlowStreak++;
      else break;
    }

    const recentScores = await prisma.trustScore.findMany({
      where: { studentId: student.id },
      orderBy: { month: "desc" },
      take: 6,
      select: { label: true },
    });
    let greenStreak = 0;
    for (const s of recentScores) {
      if (s.label === "GREEN") greenStreak++;
      else break;
    }

    // Group view — cohort peers
    let group: Array<{ initial: string; score: number | null; label: string | null; isMe: boolean }> = [];
    if (student.cohortId) {
      const members = await prisma.studentProfile.findMany({
        where: { cohortId: student.cohortId },
        orderBy: { createdAt: "asc" },
      });
      const latestScores = await prisma.trustScore.findMany({
        where: { studentId: { in: members.map((m) => m.id) } },
        orderBy: { month: "desc" },
      });
      const scoreMap = new Map<string, { score: number; label: string }>();
      for (const s of latestScores) {
        if (!scoreMap.has(s.studentId)) scoreMap.set(s.studentId, { score: s.score, label: s.label });
      }
      const alpha = "ABCDE";
      group = members.map((member, i) => {
        const s = scoreMap.get(member.id) ?? null;
        return {
          initial: member.id === student.id ? "You" : alpha[i] ?? String(i + 1),
          score: s?.score ?? null,
          label: s?.label ?? null,
          isMe: member.id === student.id,
        };
      });
    }

    return NextResponse.json({
      user: student.user,
      venture: student.ventureProfile,
      cohort: student.cohort,
      trustScore: latestScore,
      graduationChecklist: {
        ventureExists: !!student.ventureProfile,
        cashFlowStreak,
        greenStreak,
        exitInterviewStatus: student.graduationRecord?.status ?? "INELIGIBLE",
      },
      upcoming: {
        plDue: null,
        nextTownHall: null,
        nextCheckIn: null,
      },
      group,
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
