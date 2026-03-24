import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Staff releases tranche 2 after confirming:
//   1. Company is incorporated (staff-confirmed checkbox)
//   2. M2 and M3 trust scores are not RED (system-verified)
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const orgId = req.headers.get("x-org-id");
    const staffId = req.headers.get("x-user-id");
    if (!orgId || !staffId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id: studentId } = await params;

    const student = await prisma.studentProfile.findUnique({
      where: { id: studentId },
      include: {
        user: { select: { orgId: true } },
        grantTranche2: true,
      },
    });

    if (!student) return NextResponse.json({ error: "Student not found" }, { status: 404 });
    if (student.user.orgId !== orgId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    if (student.grantTranche2) return NextResponse.json({ error: "Tranche 2 already released" }, { status: 409 });

    const body = await req.json();
    const { companyIncorporatedConfirmed, note } = body;

    if (!companyIncorporatedConfirmed) {
      return NextResponse.json(
        { error: "You must confirm that the company is incorporated before releasing Tranche 2." },
        { status: 400 }
      );
    }

    // Verify pledge exists (tranche 1 released)
    const pledge = await prisma.pledgeRecord.findUnique({ where: { userId: student.userId } });
    if (!pledge) {
      return NextResponse.json({ error: "Tranche 1 has not been released — pledge not signed." }, { status: 400 });
    }

    // Compute M2 and M3
    const signedDate = new Date(pledge.signedAt);
    const m2Date = new Date(signedDate);
    m2Date.setMonth(m2Date.getMonth() + 1);
    const m3Date = new Date(signedDate);
    m3Date.setMonth(m3Date.getMonth() + 2);

    const m2 = `${m2Date.getFullYear()}-${String(m2Date.getMonth() + 1).padStart(2, "0")}`;
    const m3 = `${m3Date.getFullYear()}-${String(m3Date.getMonth() + 1).padStart(2, "0")}`;

    const scores = await prisma.trustScore.findMany({
      where: { studentId, month: { in: [m2, m3] } },
      select: { month: true, label: true },
    });

    const m2Score = scores.find((s) => s.month === m2);
    const m3Score = scores.find((s) => s.month === m3);

    if (!m2Score || !m3Score) {
      return NextResponse.json(
        { error: `Trust scores for ${m2} and ${m3} must both exist before releasing Tranche 2.` },
        { status: 400 }
      );
    }

    if (m2Score.label === "RED" || m3Score.label === "RED") {
      return NextResponse.json(
        { error: `Cannot release Tranche 2: student had a RED trust score at ${m2Score.label === "RED" ? m2 : m3}.` },
        { status: 400 }
      );
    }

    const record = await prisma.grantTranche2.create({
      data: {
        studentId,
        releasedAt: new Date(),
        releasedById: staffId,
        note: note?.trim() || null,
      },
    });

    return NextResponse.json(record, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
