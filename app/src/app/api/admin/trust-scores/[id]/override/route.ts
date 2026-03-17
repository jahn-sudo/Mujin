import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { assignLabel } from "@/lib/scoring/trustScore";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const orgId = req.headers.get("x-org-id");
    const staffId = req.headers.get("x-user-id");
    if (!orgId || !staffId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { newScore, reason } = body;

    if (
      typeof newScore !== "number" ||
      !Number.isFinite(newScore) ||
      newScore < 0 ||
      newScore > 100
    ) {
      return NextResponse.json(
        { error: "newScore must be a number between 0 and 100" },
        { status: 400 }
      );
    }

    if (!reason || typeof reason !== "string" || reason.trim().length === 0) {
      return NextResponse.json(
        { error: "reason is required for trust score override" },
        { status: 400 }
      );
    }

    // Verify trust score exists and belongs to this org
    const trustScore = await prisma.trustScore.findUnique({
      where: { id },
      include: {
        student: { select: { user: { select: { orgId: true } } } },
      },
    });

    if (!trustScore) {
      return NextResponse.json(
        { error: "Trust score not found" },
        { status: 404 }
      );
    }

    if (trustScore.student.user.orgId !== orgId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const newLabel = assignLabel(newScore);

    const [updated] = await prisma.$transaction([
      prisma.trustScore.update({
        where: { id },
        data: { score: newScore, label: newLabel, isOverridden: true },
        select: {
          id: true,
          studentId: true,
          month: true,
          score: true,
          label: true,
          responsivenessRaw: true,
          transparencyRaw: true,
          mutualismRaw: true,
          reflectionRaw: true,
          isOverridden: true,
        },
      }),
      prisma.trustScoreOverride.upsert({
        where: { scoreId: id },
        update: { staffId, newScore, reason: reason.trim() },
        create: { scoreId: id, staffId, newScore, reason: reason.trim() },
      }),
    ]);

    return NextResponse.json(updated, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
