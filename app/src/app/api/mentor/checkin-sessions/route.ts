import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const mentorId = req.headers.get("x-user-id");
    if (!mentorId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find mentor's assigned cohort
    const assignment = await prisma.mentorCohortAssignment.findUnique({
      where: { mentorId },
    });
    if (!assignment) {
      return NextResponse.json(
        { error: "No cohort assigned to this mentor" },
        { status: 404 }
      );
    }

    const sessions = await prisma.checkInSession.findMany({
      where: { cohortId: assignment.cohortId },
      orderBy: { date: "desc" },
    });

    return NextResponse.json(sessions, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
