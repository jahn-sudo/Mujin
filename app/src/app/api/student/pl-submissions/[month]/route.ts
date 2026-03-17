import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { computeAutoScore } from "@/lib/pl/autoScore";
import { PLSubmissionStatus } from "@/generated/prisma/enums";
import { calculateTrustScore } from "@/lib/scoring/trustScore";

const MONTH_REGEX = /^\d{4}-(0[1-9]|1[0-2])$/;

// Student-safe fields (never include staffScore, spotAudit, or PLReview data)
const STUDENT_SELECT = {
  id: true,
  studentId: true,
  month: true,
  revenue: true,
  expenses: true,
  net: true,
  notes: true,
  receiptUrls: true,
  submittedAt: true,
  autoScore: true,
  finalScore: true,
  status: true,
  createdAt: true,
  updatedAt: true,
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ month: string }> }
) {
  try {
    const userId = req.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { month } = await params;

    if (!MONTH_REGEX.test(month)) {
      return NextResponse.json(
        { error: "month must be in YYYY-MM format" },
        { status: 400 }
      );
    }

    const studentProfile = await prisma.studentProfile.findUnique({
      where: { userId },
      select: { id: true },
    });
    if (!studentProfile) {
      return NextResponse.json(
        { error: "Student profile not found" },
        { status: 404 }
      );
    }

    const submission = await prisma.pLSubmission.findUnique({
      where: { studentId_month: { studentId: studentProfile.id, month } },
      select: STUDENT_SELECT,
    });

    if (!submission) {
      return NextResponse.json(
        { error: "Submission not found for this month" },
        { status: 404 }
      );
    }

    return NextResponse.json(submission, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ month: string }> }
) {
  try {
    const userId = req.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { month } = await params;

    if (!MONTH_REGEX.test(month)) {
      return NextResponse.json(
        { error: "month must be in YYYY-MM format" },
        { status: 400 }
      );
    }

    const studentProfile = await prisma.studentProfile.findUnique({
      where: { userId },
      select: { id: true },
    });
    if (!studentProfile) {
      return NextResponse.json(
        { error: "Student profile not found" },
        { status: 404 }
      );
    }

    const submission = await prisma.pLSubmission.findUnique({
      where: { studentId_month: { studentId: studentProfile.id, month } },
    });

    if (!submission) {
      return NextResponse.json(
        { error: "Submission record not found — contact staff to generate" },
        { status: 404 }
      );
    }

    if (submission.status !== PLSubmissionStatus.PENDING) {
      return NextResponse.json(
        { error: "P&L already submitted for this month" },
        { status: 409 }
      );
    }

    const body = await req.json();
    const { revenue, expenses, notes } = body;

    if (typeof revenue !== "number" || revenue < 0 || !Number.isInteger(revenue)) {
      return NextResponse.json(
        { error: "revenue must be a non-negative integer (yen)" },
        { status: 400 }
      );
    }
    if (typeof expenses !== "number" || expenses < 0 || !Number.isInteger(expenses)) {
      return NextResponse.json(
        { error: "expenses must be a non-negative integer (yen)" },
        { status: 400 }
      );
    }

    const net = revenue - expenses;
    const autoScore = computeAutoScore({
      revenue,
      expenses,
      notes: notes ?? null,
      receiptUrls: submission.receiptUrls,
    });

    const updated = await prisma.pLSubmission.update({
      where: { id: submission.id },
      data: {
        revenue,
        expenses,
        net,
        notes: notes ?? null,
        autoScore,
        finalScore: autoScore,
        status: PLSubmissionStatus.SUBMITTED,
        submittedAt: new Date(),
      },
      select: STUDENT_SELECT,
    });

    // Fire trust score recompute after P&L submission (fire and forget)
    calculateTrustScore(studentProfile.id, month).catch(() => {});

    return NextResponse.json(updated, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
