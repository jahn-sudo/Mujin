import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteContext = { params: Promise<{ cohortId: string }> };

// S2.7 — Get mentor assignment for cohort
export async function GET(_req: NextRequest, { params }: RouteContext) {
  try {
    const { cohortId } = await params;
    const orgId = _req.headers.get("x-org-id");
    if (!orgId) {
      return NextResponse.json({ error: "Missing org context" }, { status: 400 });
    }

    const cohort = await prisma.cohort.findFirst({ where: { id: cohortId, orgId } });
    if (!cohort) {
      return NextResponse.json({ error: "Cohort not found" }, { status: 404 });
    }

    const assignment = await prisma.mentorCohortAssignment.findUnique({
      where: { cohortId },
      include: { mentor: { select: { id: true, email: true } } },
    });

    if (!assignment) {
      return NextResponse.json({ assigned: false });
    }

    return NextResponse.json({
      assigned: true,
      userId: assignment.mentor.id,
      email: assignment.mentor.email,
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// S2.7 — Unassign mentor from cohort (does not delete user)
export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  try {
    const { cohortId } = await params;
    const orgId = _req.headers.get("x-org-id");
    if (!orgId) {
      return NextResponse.json({ error: "Missing org context" }, { status: 400 });
    }

    const cohort = await prisma.cohort.findFirst({ where: { id: cohortId, orgId } });
    if (!cohort) {
      return NextResponse.json({ error: "Cohort not found" }, { status: 404 });
    }

    const assignment = await prisma.mentorCohortAssignment.findUnique({
      where: { cohortId },
    });
    if (!assignment) {
      return NextResponse.json(
        { error: "No mentor assigned to this cohort" },
        { status: 404 }
      );
    }

    await prisma.mentorCohortAssignment.delete({ where: { cohortId } });

    return NextResponse.json({ message: "Mentor unassigned" });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
