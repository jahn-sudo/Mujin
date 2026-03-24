import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/admin/students/[id]/graduation/bank-tracking
 *
 * Returns the BankIntroTracking record for a graduated student.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const orgId = req.headers.get("x-org-id");
    if (!orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id: studentId } = await params;

    const student = await prisma.studentProfile.findUnique({
      where: { id: studentId },
      select: {
        user: { select: { orgId: true } },
        graduationRecord: {
          select: {
            id: true,
            status: true,
            bankIntroTracking: true,
          },
        },
      },
    });

    if (!student) return NextResponse.json({ error: "Student not found" }, { status: 404 });
    if (student.user.orgId !== orgId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    return NextResponse.json({
      tracking: student.graduationRecord?.bankIntroTracking ?? null,
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * PUT /api/admin/students/[id]/graduation/bank-tracking
 *
 * Upserts the BankIntroTracking record for a graduated student.
 * Only allowed when graduation status is GRADUATED.
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const orgId = req.headers.get("x-org-id");
    if (!orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id: studentId } = await params;

    const student = await prisma.studentProfile.findUnique({
      where: { id: studentId },
      select: {
        user: { select: { orgId: true } },
        graduationRecord: { select: { id: true, status: true } },
      },
    });

    if (!student) return NextResponse.json({ error: "Student not found" }, { status: 404 });
    if (student.user.orgId !== orgId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const record = student.graduationRecord;
    if (!record || record.status !== "GRADUATED") {
      return NextResponse.json(
        { error: "Bank tracking is only available for graduated students" },
        { status: 409 }
      );
    }

    const body = await req.json();
    const {
      bankName,
      bankContactName,
      firstMeetingDate,
      firstMeetingOutcome,
      accountOpenedAt,
      loanSecuredAt,
      loanAmountYen,
      businessManagerVisaAt,
      staffNotes,
    } = body;

    const tracking = await prisma.bankIntroTracking.upsert({
      where: { graduationRecordId: record.id },
      create: {
        graduationRecordId: record.id,
        bankName: bankName ?? null,
        bankContactName: bankContactName ?? null,
        firstMeetingDate: firstMeetingDate ? new Date(firstMeetingDate) : null,
        firstMeetingOutcome: firstMeetingOutcome ?? null,
        accountOpenedAt: accountOpenedAt ? new Date(accountOpenedAt) : null,
        loanSecuredAt: loanSecuredAt ? new Date(loanSecuredAt) : null,
        loanAmountYen: loanAmountYen ?? null,
        businessManagerVisaAt: businessManagerVisaAt ? new Date(businessManagerVisaAt) : null,
        staffNotes: staffNotes ?? null,
      },
      update: {
        bankName: bankName ?? null,
        bankContactName: bankContactName ?? null,
        firstMeetingDate: firstMeetingDate ? new Date(firstMeetingDate) : null,
        firstMeetingOutcome: firstMeetingOutcome ?? null,
        accountOpenedAt: accountOpenedAt ? new Date(accountOpenedAt) : null,
        loanSecuredAt: loanSecuredAt ? new Date(loanSecuredAt) : null,
        loanAmountYen: loanAmountYen ?? null,
        businessManagerVisaAt: businessManagerVisaAt ? new Date(businessManagerVisaAt) : null,
        staffNotes: staffNotes ?? null,
      },
    });

    return NextResponse.json({ tracking });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
