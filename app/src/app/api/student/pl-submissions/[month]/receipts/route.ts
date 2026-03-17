import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { uploadReceipt } from "@/lib/storage/r2";
import { PLSubmissionStatus } from "@/generated/prisma/enums";

const MONTH_REGEX = /^\d{4}-(0[1-9]|1[0-2])$/;

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ month: string }> }
) {
  try {
    const userId = req.headers.get("x-user-id");
    const orgId = req.headers.get("x-org-id");
    if (!userId || !orgId) {
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
      where: {
        studentId_month: { studentId: studentProfile.id, month },
      },
    });

    if (!submission) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 }
      );
    }

    // Allow receipt uploads for PENDING and SUBMITTED states
    if (
      submission.status !== PLSubmissionStatus.PENDING &&
      submission.status !== PLSubmissionStatus.SUBMITTED
    ) {
      return NextResponse.json(
        { error: "Receipts cannot be added to a reviewed submission" },
        { status: 409 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "file is required (multipart/form-data)" },
        { status: 400 }
      );
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const url = await uploadReceipt(
      orgId,
      studentProfile.id,
      month,
      fileBuffer,
      file.type || "application/octet-stream"
    );

    const updated = await prisma.pLSubmission.update({
      where: { id: submission.id },
      data: { receiptUrls: { push: url } },
      select: { id: true, receiptUrls: true },
    });

    return NextResponse.json(updated, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
