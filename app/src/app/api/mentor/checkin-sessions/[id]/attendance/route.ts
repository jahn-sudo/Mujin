import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateTrustScore, monthFromDate } from "@/lib/scoring/trustScore";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const mentorId = req.headers.get("x-user-id");
    if (!mentorId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: sessionId } = await params;

    // Verify mentor has an assigned cohort
    const assignment = await prisma.mentorCohortAssignment.findUnique({
      where: { mentorId },
    });
    if (!assignment) {
      return NextResponse.json(
        { error: "No cohort assigned to this mentor" },
        { status: 403 }
      );
    }

    // Verify session belongs to mentor's cohort
    const session = await prisma.checkInSession.findUnique({
      where: { id: sessionId },
    });
    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }
    if (session.cohortId !== assignment.cohortId) {
      return NextResponse.json(
        { error: "Forbidden: session belongs to a different cohort" },
        { status: 403 }
      );
    }

    // Check if attendance already submitted (locked)
    if (session.attendanceSubmittedAt) {
      return NextResponse.json(
        {
          error:
            "Attendance already submitted. Contact staff to correct errors.",
        },
        { status: 409 }
      );
    }

    const body = await req.json();
    const { records } = body;

    if (!Array.isArray(records) || records.length === 0) {
      return NextResponse.json(
        { error: "records must be a non-empty array" },
        { status: 400 }
      );
    }

    // Validate each record has studentProfileId and present
    for (const record of records) {
      if (
        typeof record.studentProfileId !== "string" ||
        typeof record.present !== "boolean"
      ) {
        return NextResponse.json(
          {
            error:
              "Each record must have studentProfileId (string) and present (boolean)",
          },
          { status: 400 }
        );
      }
    }

    // Write attendance records + lock session in a transaction
    const [attendanceRecords] = await prisma.$transaction([
      prisma.attendanceRecord.createMany({
        data: records.map(
          (r: { studentProfileId: string; present: boolean }) => ({
            studentProfileId: r.studentProfileId,
            checkInSessionId: sessionId,
            present: r.present,
          })
        ),
        skipDuplicates: true,
      }),
      prisma.checkInSession.update({
        where: { id: sessionId },
        data: { attendanceSubmittedAt: new Date() },
      }),
    ]);

    // Fire trust score recompute for all students in the cohort (fire and forget)
    ;(async () => {
      try {
        const month = monthFromDate(session.date);
        const students = await prisma.studentProfile.findMany({
          where: { cohortId: assignment.cohortId },
          select: { id: true },
        });
        await Promise.all(
          students.map((s) => calculateTrustScore(s.id, month).catch(() => {}))
        );
      } catch {
        // Non-blocking — scoring failure does not affect attendance record
      }
    })();

    return NextResponse.json(
      { created: attendanceRecords.count },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const mentorId = req.headers.get("x-user-id");
    if (!mentorId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: sessionId } = await params;

    const assignment = await prisma.mentorCohortAssignment.findUnique({
      where: { mentorId },
    });
    if (!assignment) {
      return NextResponse.json(
        { error: "No cohort assigned to this mentor" },
        { status: 403 }
      );
    }

    const session = await prisma.checkInSession.findUnique({
      where: { id: sessionId },
    });
    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }
    if (session.cohortId !== assignment.cohortId) {
      return NextResponse.json(
        { error: "Forbidden: session belongs to a different cohort" },
        { status: 403 }
      );
    }

    const records = await prisma.attendanceRecord.findMany({
      where: { checkInSessionId: sessionId },
      include: {
        studentProfile: {
          select: { id: true, userId: true },
        },
      },
    });

    return NextResponse.json(records, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
