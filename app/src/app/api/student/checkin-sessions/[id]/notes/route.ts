import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET — student views their own note + grade for this session
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = req.headers.get("x-user-id");
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id: sessionId } = await params;

    const student = await prisma.studentProfile.findUnique({ where: { userId } });
    if (!student) return NextResponse.json({ error: "Student profile not found" }, { status: 404 });

    const note = await prisma.checkInNote.findUnique({
      where: { checkInSessionId_studentProfileId: { checkInSessionId: sessionId, studentProfileId: student.id } },
      include: { grade: { select: { rating: true, feedback: true, gradedAt: true } } },
    });

    return NextResponse.json(note ?? null);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST — student submits structured check-in notes
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = req.headers.get("x-user-id");
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id: sessionId } = await params;

    const student = await prisma.studentProfile.findUnique({ where: { userId } });
    if (!student) return NextResponse.json({ error: "Student profile not found" }, { status: 404 });

    // Verify session belongs to student's cohort
    const session = await prisma.checkInSession.findUnique({ where: { id: sessionId } });
    if (!session) return NextResponse.json({ error: "Session not found" }, { status: 404 });
    if (session.cohortId !== student.cohortId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { agendaRecap, actionItems, reflection } = await req.json();

    if (!agendaRecap?.trim() || !actionItems?.trim() || !reflection?.trim()) {
      return NextResponse.json({ error: "All three fields are required" }, { status: 400 });
    }

    // Upsert — allow editing before mentor grades
    const existing = await prisma.checkInNote.findUnique({
      where: { checkInSessionId_studentProfileId: { checkInSessionId: sessionId, studentProfileId: student.id } },
      include: { grade: true },
    });

    if (existing?.grade) {
      return NextResponse.json({ error: "Cannot edit after mentor has graded" }, { status: 409 });
    }

    const note = existing
      ? await prisma.checkInNote.update({
          where: { id: existing.id },
          data: { agendaRecap, actionItems, reflection, submittedAt: new Date() },
        })
      : await prisma.checkInNote.create({
          data: { checkInSessionId: sessionId, studentProfileId: student.id, agendaRecap, actionItems, reflection },
        });

    return NextResponse.json(note, { status: existing ? 200 : 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
