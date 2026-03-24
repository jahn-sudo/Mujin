import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DEMO_COHORT_IDS } from "@/lib/demo";

// S2.1 — Create cohort (STAFF / ORG_ADMIN / SUPER_ADMIN)
export async function POST(req: NextRequest) {
  try {
    const orgId = req.headers.get("x-org-id");
    if (!orgId) {
      return NextResponse.json({ error: "Missing org context" }, { status: 400 });
    }

    const body = await req.json();
    const { name, maxStudents = 5 } = body;

    if (!name || typeof name !== "string" || name.trim() === "") {
      return NextResponse.json({ error: "name is required" }, { status: 400 });
    }

    if (
      typeof maxStudents !== "number" ||
      !Number.isInteger(maxStudents) ||
      maxStudents < 1 ||
      maxStudents > 10
    ) {
      return NextResponse.json(
        { error: "maxStudents must be an integer between 1 and 10" },
        { status: 400 }
      );
    }

    // Duplicate name check within org
    const existing = await prisma.cohort.findFirst({
      where: { orgId, name: name.trim() },
    });
    if (existing) {
      return NextResponse.json(
        { error: "A cohort with that name already exists in this organisation" },
        { status: 409 }
      );
    }

    const cohort = await prisma.cohort.create({
      data: { name: name.trim(), orgId, maxStudents },
    });

    return NextResponse.json(cohort, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// S2.1 — List cohorts for org
export async function GET(req: NextRequest) {
  try {
    const orgId = req.headers.get("x-org-id");
    if (!orgId) {
      return NextResponse.json({ error: "Missing org context" }, { status: 400 });
    }

    const cohorts = await prisma.cohort.findMany({
      where: { orgId, id: { notIn: [...DEMO_COHORT_IDS] } },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(cohorts);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
