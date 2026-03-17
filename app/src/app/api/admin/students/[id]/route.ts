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

    const { id: studentId } = await params;

    const student = await prisma.studentProfile.findUnique({
      where: { id: studentId },
      include: {
        user: { select: { id: true, email: true, orgId: true } },
        ventureProfile: { select: { name: true, description: true, coFounders: true } },
        cohort: { select: { name: true } },
        graduationRecord: true,
      },
    });

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }
    if (student.user.orgId !== orgId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Trust score history (last 12 months)
    const scoreHistory = await prisma.trustScore.findMany({
      where: { studentId },
      orderBy: { month: "asc" },
      take: 12,
      select: {
        id: true,
        month: true,
        score: true,
        label: true,
        responsivenessRaw: true,
        transparencyRaw: true,
        mutualismRaw: true,
        reflectionRaw: true,
        isOverridden: true,
      },
    });

    // P&L history
    const plHistory = await prisma.pLSubmission.findMany({
      where: { studentId },
      orderBy: { month: "desc" },
      take: 12,
      select: {
        id: true,
        month: true,
        revenue: true,
        expenses: true,
        net: true,
        autoScore: true,
        finalScore: true,
        status: true,
        submittedAt: true,
      },
    });

    // Attendance summary (rolling 3 months)
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
    const attendanceSummary = {
      attended,
      total: sessions.length,
      pct: sessions.length > 0 ? Math.round((attended / sessions.length) * 100) : null,
    };

    // Staff notes (from P&L reviews with annotations — internal, visible to staff)
    const staffNotes = await prisma.pLReview.findMany({
      where: {
        submission: { studentId },
        annotation: { not: null },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        action: true,
        annotation: true,
        overrideReason: true,
        createdAt: true,
        submission: { select: { month: true } },
      },
    });

    return NextResponse.json({
      profile: {
        id: student.id,
        email: student.user.email,
        cohortName: student.cohort?.name ?? null,
        venture: student.ventureProfile,
        ventureCategory: student.ventureCategory,
      },
      scoreHistory,
      plHistory,
      attendanceSummary,
      staffNotes: staffNotes.map((n) => ({
        month: n.submission.month,
        action: n.action,
        annotation: n.annotation,
        overrideReason: n.overrideReason,
        createdAt: n.createdAt,
      })),
      graduationRecord: student.graduationRecord ?? { status: "INELIGIBLE" },
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
