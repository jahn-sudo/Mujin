import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/admin/students/[id]/graduation
 *
 * Returns the student's current graduation record + exit interview package.
 * Exit package is included when status is ELIGIBLE or higher.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const orgId = req.headers.get("x-org-id");
    if (!orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id: studentId } = await params;

    const student = await prisma.studentProfile.findUnique({
      where: { id: studentId },
      select: {
        user: { select: { orgId: true } },
        ventureProfile: { select: { name: true } },
        cohortId: true,
        graduationRecord: true,
      },
    });

    if (!student) return NextResponse.json({ error: "Student not found" }, { status: 404 });
    if (student.user.orgId !== orgId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    // Compute gate statuses live (for display)
    const recentPLs = await prisma.pLSubmission.findMany({
      where: { studentId },
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
      where: { studentId },
      orderBy: { month: "desc" },
      take: 6,
      select: { label: true, month: true, score: true },
    });
    let greenStreak = 0;
    for (const s of recentScores) {
      if (s.label === "GREEN") greenStreak++;
      else break;
    }

    const gates = {
      ventureExists: !!student.ventureProfile,
      cashFlowStreak,
      cashFlowMet: cashFlowStreak >= 3,
      greenStreak,
      greenStreakMet: greenStreak >= 6,
    };

    // Exit interview package (included when ELIGIBLE or higher)
    const record = student.graduationRecord;
    const includePackage = record && record.status !== "INELIGIBLE";

    let exitPackage = null;
    if (includePackage) {
      // Last 6 months of P&L
      const plSummary = recentPLs.slice(0, 6).map((pl) => ({
        month: pl.month,
        net: pl.net,
        status: pl.status,
      }));

      // Revenue trend from last 3 submitted P&Ls
      const submittedPLs = recentPLs.filter((pl) => pl.net !== null).slice(0, 3);
      let revenueTrend: "GROWING" | "STABLE" | "DECLINING" | null = null;
      if (submittedPLs.length >= 2) {
        const latest = submittedPLs[0].net!;
        const oldest = submittedPLs[submittedPLs.length - 1].net!;
        if (latest > oldest) revenueTrend = "GROWING";
        else if (latest < oldest) revenueTrend = "DECLINING";
        else revenueTrend = "STABLE";
      }

      // Attendance record
      const sessions = await prisma.checkInSession.findMany({
        where: { cohortId: student.cohortId ?? "__none__", attendanceSubmittedAt: { not: null } },
        select: { id: true },
      });
      const attended = await prisma.attendanceRecord.count({
        where: {
          studentProfileId: studentId,
          checkInSessionId: { in: sessions.map((s) => s.id) },
          present: true,
        },
      });

      // Aggregated staff notes
      const staffNotes = await prisma.pLReview.findMany({
        where: { submission: { studentId }, annotation: { not: null } },
        orderBy: { createdAt: "desc" },
        take: 10,
        select: {
          action: true,
          annotation: true,
          createdAt: true,
          submission: { select: { month: true } },
        },
      });

      exitPackage = {
        trustScoreHistory: recentScores.map((s) => ({ month: s.month, score: s.score, label: s.label })),
        plSummary,
        revenueTrend,
        cashFlowStreak,
        attendance: {
          attended,
          total: sessions.length,
          pct: sessions.length > 0 ? Math.round((attended / sessions.length) * 100) : null,
        },
        staffNotes: staffNotes.map((n) => ({
          month: n.submission.month,
          action: n.action,
          annotation: n.annotation,
          createdAt: n.createdAt,
        })),
      };
    }

    return NextResponse.json({
      graduationRecord: record ?? { status: "INELIGIBLE" },
      gates,
      exitPackage,
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
