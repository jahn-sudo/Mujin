import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ReflectionResult, ResubmissionState } from "@/generated/prisma/enums";

type ReflectionStatusResponse =
  | "MEANINGFUL"
  | "NOT_MEANINGFUL"
  | "WINDOW_OPEN"
  | "LOCKED"
  | "PENDING";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = req.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: townHallId } = await params;

    const submission = await prisma.townHallSubmission.findUnique({
      where: { townHallId_submittedById: { townHallId, submittedById: userId } },
      select: {
        id: true,
        // reflectionText intentionally excluded
        reflectionAssessment: {
          select: {
            result: true,
            resubmissionState: true,
            windowExpiresAt: true,
          },
        },
      },
    });

    if (!submission) {
      return NextResponse.json(
        { error: "No submission found" },
        { status: 404 }
      );
    }

    const assessment = submission.reflectionAssessment;

    if (!assessment) {
      return NextResponse.json(
        { status: "PENDING" as ReflectionStatusResponse, windowExpiresAt: null },
        { status: 200 }
      );
    }

    let status: ReflectionStatusResponse;

    if (assessment.resubmissionState === ResubmissionState.WINDOW_OPEN) {
      status = "WINDOW_OPEN";
    } else if (assessment.resubmissionState === ResubmissionState.LOCKED) {
      status = "LOCKED";
    } else if (assessment.result === ReflectionResult.MEANINGFUL) {
      status = "MEANINGFUL";
    } else {
      status = "NOT_MEANINGFUL";
    }

    return NextResponse.json(
      {
        status,
        windowExpiresAt: assessment.windowExpiresAt ?? null,
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
