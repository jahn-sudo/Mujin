import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const orgId = req.headers.get("x-org-id");
    if (!orgId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const submission = await prisma.pLSubmission.findUnique({
      where: { id },
      include: {
        reviews: {
          select: {
            id: true,
            action: true,
            annotation: true,
            scoreOverride: true,
            overrideReason: true,
            staffId: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
        },
        student: {
          select: {
            id: true,
            user: { select: { orgId: true } },
          },
        },
      },
    });

    if (!submission) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 }
      );
    }

    // Verify org scoping
    if (submission.student.user.orgId !== orgId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(submission, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
