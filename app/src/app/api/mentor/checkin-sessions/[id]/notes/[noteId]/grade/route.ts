import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST — mentor submits or updates grade for a student's check-in note
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; noteId: string }> }
) {
  try {
    const mentorId = req.headers.get("x-user-id");
    if (!mentorId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id: sessionId, noteId } = await params;

    const assignment = await prisma.mentorCohortAssignment.findUnique({ where: { mentorId } });
    if (!assignment) return NextResponse.json({ error: "No cohort assigned" }, { status: 403 });

    const session = await prisma.checkInSession.findUnique({ where: { id: sessionId } });
    if (!session || session.cohortId !== assignment.cohortId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const note = await prisma.checkInNote.findUnique({ where: { id: noteId } });
    if (!note || note.checkInSessionId !== sessionId) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    const { rating, feedback } = await req.json();

    if (typeof rating !== "number" || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be 1–5" }, { status: 400 });
    }
    if (!feedback?.trim()) {
      return NextResponse.json({ error: "Feedback is required" }, { status: 400 });
    }

    const grade = await prisma.checkInGrade.upsert({
      where: { noteId },
      update: { rating, feedback, gradedAt: new Date() },
      create: { noteId, mentorId, rating, feedback },
    });

    return NextResponse.json(grade, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
