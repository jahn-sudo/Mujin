import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET — mentor views all student notes for a session
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const mentorId = req.headers.get("x-user-id");
    if (!mentorId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id: sessionId } = await params;

    const assignment = await prisma.mentorCohortAssignment.findUnique({ where: { mentorId } });
    if (!assignment) return NextResponse.json({ error: "No cohort assigned" }, { status: 403 });

    const session = await prisma.checkInSession.findUnique({ where: { id: sessionId } });
    if (!session) return NextResponse.json({ error: "Session not found" }, { status: 404 });
    if (session.cohortId !== assignment.cohortId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const notes = await prisma.checkInNote.findMany({
      where: { checkInSessionId: sessionId },
      include: {
        studentProfile: { select: { id: true, user: { select: { email: true } } } },
        grade: true,
      },
      orderBy: { submittedAt: "asc" },
    });

    // Also return students who haven't submitted yet
    const allStudents = await prisma.studentProfile.findMany({
      where: { cohortId: assignment.cohortId },
      select: { id: true, user: { select: { email: true } } },
    });

    return NextResponse.json({
      session: { id: session.id, date: session.date, note: session.note },
      notes,
      pendingStudents: allStudents.filter(
        (s) => !notes.some((n) => n.studentProfileId === s.id)
      ),
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
