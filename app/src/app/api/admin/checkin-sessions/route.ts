import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const orgId = req.headers.get("x-org-id");
    if (!orgId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { date, cohortId, note } = body;

    if (!date || typeof date !== "string") {
      return NextResponse.json({ error: "date is required" }, { status: 400 });
    }
    if (!cohortId || typeof cohortId !== "string") {
      return NextResponse.json(
        { error: "cohortId is required" },
        { status: 400 }
      );
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return NextResponse.json(
        { error: "date must be a valid ISO date string" },
        { status: 400 }
      );
    }

    // Verify cohort belongs to org
    const cohort = await prisma.cohort.findFirst({
      where: { id: cohortId, orgId },
    });
    if (!cohort) {
      return NextResponse.json(
        { error: "Cohort not found in your organisation" },
        { status: 403 }
      );
    }

    const session = await prisma.checkInSession.create({
      data: {
        cohortId,
        date: parsedDate,
        note: note ?? null,
      },
    });

    return NextResponse.json(session, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const orgId = req.headers.get("x-org-id");
    if (!orgId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sessions = await prisma.checkInSession.findMany({
      where: {
        cohort: { orgId },
      },
      orderBy: { date: "desc" },
      include: { cohort: { select: { id: true, name: true } } },
    });

    return NextResponse.json(sessions, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
