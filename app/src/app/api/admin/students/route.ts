import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DEMO_EMAIL_DOMAIN } from "@/lib/demo";

// List all activated students in the org with cohort assignment status
export async function GET(req: NextRequest) {
  try {
    const orgId = req.headers.get("x-org-id");
    if (!orgId) {
      return NextResponse.json({ error: "Missing org context" }, { status: 400 });
    }

    const students = await prisma.studentProfile.findMany({
      where: { user: { orgId, role: "STUDENT", email: { not: { endsWith: DEMO_EMAIL_DOMAIN } } } },
      include: {
        user: { select: { id: true, email: true } },
        ventureProfile: { select: { name: true } },
        cohort: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(
      students.map((s) => ({
        id: s.id,
        userId: s.userId,
        email: s.user.email,
        venture: s.ventureProfile?.name ?? null,
        cohortId: s.cohortId ?? null,
        cohortName: s.cohort?.name ?? null,
      }))
    );
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
