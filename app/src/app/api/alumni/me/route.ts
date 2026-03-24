import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/alumni/me
 *
 * Returns the authenticated alumni's journey summary:
 * - Venture profile
 * - Cohort
 * - Graduation record + bank intro date
 * - Trust score history (last 12 months)
 * - Bank intro tracking milestones
 */
export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get("x-user-id");
    const orgId = req.headers.get("x-org-id");
    if (!userId || !orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        email: true,
        role: true,
        studentProfile: {
          select: {
            id: true,
            ventureCategory: true,
            cohort: { select: { name: true } },
            ventureProfile: { select: { name: true, description: true, coFounders: true } },
            graduationRecord: {
              select: {
                status: true,
                bankIntroDate: true,
                interviewConductedAt: true,
                bankIntroTracking: {
                  select: {
                    bankName: true,
                    firstMeetingDate: true,
                    firstMeetingOutcome: true,
                    accountOpenedAt: true,
                    loanSecuredAt: true,
                    loanAmountYen: true,
                    businessManagerVisaAt: true,
                  },
                },
              },
            },
            trustScores: {
              orderBy: { month: "asc" },
              take: 12,
              select: { month: true, score: true, label: true },
            },
          },
        },
      },
    });

    if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (user.role !== "ALUMNI") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    return NextResponse.json({ alumni: user });
  } catch (err) {
    console.error("[alumni/me]", String(err));
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
