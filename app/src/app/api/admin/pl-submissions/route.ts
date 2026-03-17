import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const MONTH_REGEX = /^\d{4}-(0[1-9]|1[0-2])$/;

export async function GET(req: NextRequest) {
  try {
    const orgId = req.headers.get("x-org-id");
    if (!orgId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const month = searchParams.get("month");
    const status = searchParams.get("status"); // optional; if provided, month is not required

    // If month is provided it must be valid; if not provided, status must be provided
    if (!month && !status) {
      return NextResponse.json(
        { error: "Provide month (YYYY-MM) or status query param" },
        { status: 400 }
      );
    }
    if (month && !MONTH_REGEX.test(month)) {
      return NextResponse.json(
        { error: "month must be in YYYY-MM format" },
        { status: 400 }
      );
    }

    const where: Record<string, unknown> = { student: { user: { orgId } } };
    if (month) where.month = month;
    if (status) where.status = status;

    const submissions = await prisma.pLSubmission.findMany({
      where: where as never,
      include: {
        student: {
          include: {
            user: { select: { id: true, email: true } },
            ventureProfile: { select: { name: true } },
          },
        },
      },
      orderBy: [{ spotAudit: "desc" }, { submittedAt: "asc" }],
    });

    return NextResponse.json(
      submissions.map((s) => ({
        id: s.id,
        month: s.month,
        studentId: s.studentId,
        email: s.student.user.email,
        venture: s.student.ventureProfile?.name ?? null,
        revenue: s.revenue,
        expenses: s.expenses,
        net: s.net,
        autoScore: s.autoScore,
        staffScore: s.staffScore,
        finalScore: s.finalScore,
        status: s.status,
        spotAudit: s.spotAudit,
        submittedAt: s.submittedAt,
      })),
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
