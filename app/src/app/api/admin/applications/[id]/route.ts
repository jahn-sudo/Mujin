import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteContext = { params: Promise<{ id: string }> };

// GET /api/admin/applications/[id] — full application detail
export async function GET(req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const orgId = req.headers.get("x-org-id");
    if (!orgId) {
      return NextResponse.json({ error: "Missing org context" }, { status: 400 });
    }

    const application = await prisma.application.findFirst({
      where: { id, orgId },
      include: {
        reviewedBy: { select: { id: true, email: true } },
      },
    });

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    return NextResponse.json(application);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
