import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET — staff sees metrics only (no note content)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const role = req.headers.get("x-user-role");
    if (!["STAFF", "ORG_ADMIN", "SUPER_ADMIN"].includes(role ?? "")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id: sessionId } = await params;

    const session = await prisma.checkInSession.findUnique({
      where: { id: sessionId },
      include: { cohort: { select: { name: true, maxStudents: true } } },
    });
    if (!session) return NextResponse.json({ error: "Session not found" }, { status: 404 });

    const notes = await prisma.checkInNote.findMany({
      where: { checkInSessionId: sessionId },
      include: { grade: { select: { rating: true } } },
    });

    const graded = notes.filter((n) => n.grade);
    const avgRating =
      graded.length > 0
        ? Math.round((graded.reduce((sum, n) => sum + (n.grade!.rating), 0) / graded.length) * 10) / 10
        : null;

    const cohortSize = await prisma.studentProfile.count({
      where: { cohortId: session.cohortId },
    });

    return NextResponse.json({
      sessionId,
      date: session.date,
      cohortName: session.cohort.name,
      cohortSize,
      notesSubmitted: notes.length,
      notesGraded: graded.length,
      submissionRate: cohortSize > 0 ? Math.round((notes.length / cohortSize) * 100) : 0,
      avgMentorRating: avgRating,
      ratingDistribution: [1, 2, 3, 4, 5].map((r) => ({
        rating: r,
        count: graded.filter((n) => n.grade!.rating === r).length,
      })),
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
