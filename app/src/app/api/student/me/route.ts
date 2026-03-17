import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get("x-user-id");
    const orgId = req.headers.get("x-org-id");
    if (!userId || !orgId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const student = await prisma.studentProfile.findUnique({
      where: { userId },
      include: {
        user: { select: { id: true, email: true } },
        ventureProfile: { select: { name: true, description: true } },
        cohort: { select: { id: true, name: true } },
        graduationRecord: { select: { status: true } },
      },
    });

    if (!student) {
      return NextResponse.json({ error: "Student profile not found" }, { status: 404 });
    }

    // Latest trust score
    const latestScore = await prisma.trustScore.findFirst({
      where: { studentId: student.id },
      orderBy: { month: "desc" },
      select: { score: true, label: true, month: true, responsivenessRaw: true, transparencyRaw: true, mutualismRaw: true, reflectionRaw: true },
    });

    // Graduation checklist signals
    const recentPLs = await prisma.pLSubmission.findMany({
      where: { studentId: student.id },
      orderBy: { month: "desc" },
      take: 6,
      select: { month: true, net: true, status: true },
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

    // Upcoming events
    const currentMonth = new Date().toISOString().slice(0, 7);
    const plPending = await prisma.pLSubmission.findUnique({
      where: { studentId_month: { studentId: student.id, month: currentMonth } },
      select: { status: true },
    });
    let plDue: string | null = null;
    if (plPending?.status === "PENDING") {
      const [y, m] = currentMonth.split("-").map(Number);
      plDue = new Date(y, m, 0).toISOString().slice(0, 10);
    }

    const nextTownHall = await prisma.townHall.findFirst({
      where: { orgId, date: { gte: new Date() } },
      orderBy: { date: "asc" },
      select: { id: true, date: true },
    });

    // Next check-in session for student's cohort where they haven't submitted notes yet
    const nextCheckIn = student.cohortId
      ? await prisma.checkInSession.findFirst({
          where: {
            cohortId: student.cohortId,
            date: { lte: new Date() }, // session has occurred
            checkInNotes: { none: { studentProfileId: student.id } }, // no note yet
          },
          orderBy: { date: "desc" },
          select: { id: true, date: true },
        })
      : null;

    // Group view — cohort peers
    let group: Array<{ initial: string; score: number | null; label: string | null; isMe: boolean }> = [];
    if (student.cohortId) {
      const members = await prisma.studentProfile.findMany({
        where: { cohortId: student.cohortId },
        include: { user: { select: { id: true, email: true } } },
        orderBy: { createdAt: "asc" },
      });

      const latestScores = await prisma.trustScore.findMany({
        where: { studentId: { in: members.map((m) => m.id) } },
        orderBy: { month: "desc" },
      });
      const scoreMap = new Map<string, { score: number; label: string }>();
      for (const s of latestScores) {
        if (!scoreMap.has(s.studentId)) {
          scoreMap.set(s.studentId, { score: s.score, label: s.label });
        }
      }

      const alpha = "ABCDE";
      group = members.map((member, i) => {
        const s = scoreMap.get(member.id) ?? null;
        return {
          initial: member.userId === userId ? "You" : alpha[i] ?? String(i + 1),
          score: s?.score ?? null,
          label: s?.label ?? null,
          isMe: member.userId === userId,
        };
      });
    }

    // Inbox items — reflection flags with open resubmission windows
    const openFlags = await prisma.reflectionAssessment.findMany({
      where: {
        resubmissionState: "WINDOW_OPEN",
        submission: { submittedById: userId },
      },
      include: { submission: { select: { townHallId: true, submittedAt: true } } },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

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
        plDue,
        nextTownHall: nextTownHall ? { id: nextTownHall.id, date: nextTownHall.date } : null,
        nextCheckIn: nextCheckIn ? { id: nextCheckIn.id, date: nextCheckIn.date } : null,
      },
      group,
      openReflectionFlags: openFlags.map((f) => ({
        townHallId: f.submission.townHallId,
        windowExpiresAt: f.windowExpiresAt,
      })),
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
