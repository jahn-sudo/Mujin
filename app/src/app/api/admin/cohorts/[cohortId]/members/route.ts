import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteContext = { params: Promise<{ cohortId: string }> };

// S2.6 — Assign student to cohort
export async function POST(req: NextRequest, { params }: RouteContext) {
  try {
    const { cohortId } = await params;
    const orgId = req.headers.get("x-org-id");
    if (!orgId) {
      return NextResponse.json({ error: "Missing org context" }, { status: 400 });
    }

    const body = await req.json();
    const { studentId } = body;
    if (!studentId) {
      return NextResponse.json({ error: "studentId is required" }, { status: 400 });
    }

    // Verify cohort belongs to org
    const cohort = await prisma.cohort.findFirst({ where: { id: cohortId, orgId } });
    if (!cohort) {
      return NextResponse.json({ error: "Cohort not found" }, { status: 404 });
    }

    // Fetch student profile
    const student = await prisma.studentProfile.findUnique({
      where: { userId: studentId },
      include: { user: true },
    });
    if (!student) {
      return NextResponse.json({ error: "Student profile not found" }, { status: 404 });
    }

    // Org match check
    if (student.user.orgId !== orgId) {
      return NextResponse.json(
        { error: "Student does not belong to this organisation" },
        { status: 400 }
      );
    }

    // Capacity check — only if student isn't already in this cohort
    if (student.cohortId !== cohortId) {
      const memberCount = await prisma.studentProfile.count({
        where: { cohortId },
      });
      if (memberCount >= cohort.maxStudents) {
        return NextResponse.json({ error: "Cohort is full" }, { status: 409 });
      }
    }

    const updated = await prisma.studentProfile.update({
      where: { id: student.id },
      data: { cohortId },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// S2.6 — List cohort members
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

    const members = await prisma.studentProfile.findMany({
      where: { cohortId },
      include: {
        user: { select: { id: true, email: true } },
        ventureProfile: true,
      },
    });

    return NextResponse.json(members);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
