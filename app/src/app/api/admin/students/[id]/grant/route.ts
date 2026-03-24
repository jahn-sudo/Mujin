import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Returns tranche 1 status (from PledgeRecord) + tranche 2 status + eligibility
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const orgId = req.headers.get("x-org-id");
    if (!orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id: studentId } = await params;

    const student = await prisma.studentProfile.findUnique({
      where: { id: studentId },
      include: {
        user: { select: { orgId: true } },
        grantTranche2: { include: { releasedBy: { select: { email: true } } } },
      },
    });

    if (!student) return NextResponse.json({ error: "Student not found" }, { status: 404 });
    if (student.user.orgId !== orgId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    // Tranche 1 — derived from PledgeRecord
    const pledge = await prisma.pledgeRecord.findUnique({ where: { userId: student.userId } });

    // Compute M2 and M3 month strings from pledge signing date
    let m2: string | null = null;
    let m3: string | null = null;
    let m2Score: { label: string } | null = null;
    let m3Score: { label: string } | null = null;

    if (pledge) {
      const signedDate = new Date(pledge.signedAt);
      const m2Date = new Date(signedDate);
      m2Date.setMonth(m2Date.getMonth() + 1);
      const m3Date = new Date(signedDate);
      m3Date.setMonth(m3Date.getMonth() + 2);

      m2 = `${m2Date.getFullYear()}-${String(m2Date.getMonth() + 1).padStart(2, "0")}`;
      m3 = `${m3Date.getFullYear()}-${String(m3Date.getMonth() + 1).padStart(2, "0")}`;

      const scores = await prisma.trustScore.findMany({
        where: { studentId, month: { in: [m2, m3] } },
        select: { month: true, label: true },
      });

      m2Score = scores.find((s) => s.month === m2)
        ? { label: scores.find((s) => s.month === m2)!.label }
        : null;
      m3Score = scores.find((s) => s.month === m3)
        ? { label: scores.find((s) => s.month === m3)!.label }
        : null;
    }

    // Eligibility: both M2 and M3 scores must exist and neither can be RED
    const m2Ok = m2Score !== null && m2Score.label !== "RED";
    const m3Ok = m3Score !== null && m3Score.label !== "RED";
    const scoresEligible = m2Ok && m3Ok;

    return NextResponse.json({
      tranche1: {
        amountYen: 300000,
        released: !!pledge,
        releasedAt: pledge?.signedAt ?? null,
        note: "Released on pledge signing",
      },
      tranche2: {
        amountYen: 200000,
        released: !!student.grantTranche2,
        releasedAt: student.grantTranche2?.releasedAt ?? null,
        releasedBy: student.grantTranche2?.releasedBy?.email ?? null,
        note: student.grantTranche2?.note ?? null,
      },
      eligibility: {
        pledgeSigned: !!pledge,
        m2,
        m3,
        m2Label: m2Score?.label ?? null,
        m3Label: m3Score?.label ?? null,
        scoresEligible,
        // Staff must also confirm company incorporated — checked in release endpoint
      },
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
