import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const MONTH_REGEX = /^\d{4}-(0[1-9]|1[0-2])$/;
const SPOT_AUDIT_PROBABILITY = 0.15;

export async function POST(req: NextRequest) {
  try {
    const orgId = req.headers.get("x-org-id");
    if (!orgId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { month } = body;

    if (!month || typeof month !== "string" || !MONTH_REGEX.test(month)) {
      return NextResponse.json(
        { error: "month must be in YYYY-MM format" },
        { status: 400 }
      );
    }

    // Get all active student profiles in the org
    const students = await prisma.studentProfile.findMany({
      where: {
        user: { orgId, deletedAt: null },
        cohortId: { not: null },
      },
      select: { id: true },
    });

    if (students.length === 0) {
      return NextResponse.json({ created: 0, skipped: 0 }, { status: 200 });
    }

    // Upsert — idempotent (skip existing records)
    let created = 0;
    let skipped = 0;

    for (const student of students) {
      const existing = await prisma.pLSubmission.findUnique({
        where: { studentId_month: { studentId: student.id, month } },
      });

      if (existing) {
        skipped++;
        continue;
      }

      await prisma.pLSubmission.create({
        data: {
          studentId: student.id,
          month,
          spotAudit: Math.random() < SPOT_AUDIT_PROBABILITY,
        },
      });
      created++;
    }

    return NextResponse.json({ created, skipped }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
