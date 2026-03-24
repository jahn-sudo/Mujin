import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/mentor/cohort-summary
 *
 * Returns the mentor's assigned cohort with:
 * - students (email, venture, latest trust score, attendance, check-in notes)
 * - sessions (recent check-in sessions)
 *
 * Used by the mentor demo page and mentor dashboard.
 */
export async function GET(req: NextRequest) {
  try {
    const mentorId = req.headers.get("x-user-id");
    if (!mentorId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const assignment = await prisma.mentorCohortAssignment.findUnique({
      where: { mentorId },
      include: {
        cohort: {
          include: {
            students: {
              include: {
                user: { select: { id: true, email: true } },
                ventureProfile: { select: { name: true } },
              },
              orderBy: { createdAt: "asc" },
            },
          },
        },
      },
    });

    if (!assignment) {
      return NextResponse.json({ error: "No cohort assigned to this mentor" }, { status: 404 });
    }

    const cohort     = assignment.cohort;
    const studentIds = cohort.students.map((s) => s.id);

    // Latest trust score per student
    const allScores = await prisma.trustScore.findMany({
      where: { studentId: { in: studentIds } },
      orderBy: { month: "desc" },
    });
    const latestScoreMap = new Map<string, { score: number; label: string }>();
    for (const s of allScores) {
      if (!latestScoreMap.has(s.studentId)) {
        latestScoreMap.set(s.studentId, { score: s.score, label: s.label });
      }
    }

    // Sessions for this cohort (most recent 10)
    const sessions = await prisma.checkInSession.findMany({
      where: { cohortId: cohort.id },
      orderBy: { date: "desc" },
      take: 10,
    });
    const sessionIds = sessions.map((s) => s.id);

    // Attendance per student
    const attendanceRecords = await prisma.attendanceRecord.findMany({
      where: { checkInSessionId: { in: sessionIds }, studentProfileId: { in: studentIds } },
    });

    // Check-in notes per student (most recent 20)
    const allNotes = await prisma.checkInNote.findMany({
      where: { studentProfileId: { in: studentIds }, checkInSessionId: { in: sessionIds } },
      include: { grade: true },
      orderBy: { submittedAt: "desc" },
      take: 30,
    });

    const sessionDateMap = new Map(sessions.map((s) => [s.id, s.date.toISOString().slice(0, 10)]));

    const students = cohort.students.map((s) => {
      const score     = latestScoreMap.get(s.id) ?? null;
      const myRecords = attendanceRecords.filter((a) => a.studentProfileId === s.id);
      const attended  = myRecords.filter((a) => a.present).length;
      const myNotes   = allNotes.filter((n) => n.studentProfileId === s.id);

      return {
        id:       s.id,
        email:    s.user.email,
        venture:  s.ventureProfile?.name ?? null,
        score:    score?.score ?? null,
        label:    score?.label ?? null,
        attendance: { attended, total: sessionIds.length },
        notes: myNotes.map((n) => ({
          sessionId:   n.checkInSessionId,
          date:        sessionDateMap.get(n.checkInSessionId) ?? "",
          agendaRecap: n.agendaRecap,
          actionItems: n.actionItems,
          reflection:  n.reflection,
          grade: n.grade ? { rating: n.grade.rating, feedback: n.grade.feedback } : null,
        })),
      };
    });

    return NextResponse.json({
      cohortName: cohort.name,
      students,
      sessions: sessions.map((s) => ({
        id:                s.id,
        date:              s.date.toISOString().slice(0, 10),
        note:              s.note,
        attendanceSubmitted: !!s.attendanceSubmittedAt,
      })),
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
