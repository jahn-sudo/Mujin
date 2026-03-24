import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/alumni/directory
 *
 * Returns all alumni in the same org.
 * Accessible by: ALUMNI, STAFF, ORG_ADMIN, SUPER_ADMIN
 * Fields: venture name, category, cohort, graduation date — no financial data
 */
export async function GET(req: NextRequest) {
  try {
    const orgId = req.headers.get("x-org-id");
    const role = req.headers.get("x-user-role");
    if (!orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const allowed = ["ALUMNI", "STAFF", "ORG_ADMIN", "SUPER_ADMIN"];
    if (!role || !allowed.includes(role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const alumni = await prisma.user.findMany({
      where: { orgId, role: "ALUMNI" },
      select: {
        id: true,
        email: true,
        studentProfile: {
          select: {
            ventureCategory: true,
            cohort: { select: { name: true } },
            ventureProfile: { select: { name: true, description: true } },
            graduationRecord: {
              select: {
                bankIntroDate: true,
                bankIntroTracking: {
                  select: {
                    firstMeetingOutcome: true,
                    accountOpenedAt: true,
                    loanSecuredAt: true,
                    businessManagerVisaAt: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ alumni });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
