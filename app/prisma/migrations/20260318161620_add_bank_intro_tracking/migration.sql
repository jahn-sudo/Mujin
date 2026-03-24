-- CreateEnum
CREATE TYPE "BankMeetingOutcome" AS ENUM ('COMPLETED', 'NO_SHOW', 'DECLINED');

-- CreateTable
CREATE TABLE "BankIntroTracking" (
    "id" TEXT NOT NULL,
    "graduationRecordId" TEXT NOT NULL,
    "bankName" TEXT,
    "bankContactName" TEXT,
    "firstMeetingDate" TIMESTAMP(3),
    "firstMeetingOutcome" "BankMeetingOutcome",
    "accountOpenedAt" TIMESTAMP(3),
    "loanSecuredAt" TIMESTAMP(3),
    "loanAmountYen" INTEGER,
    "businessManagerVisaAt" TIMESTAMP(3),
    "staffNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BankIntroTracking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BankIntroTracking_graduationRecordId_key" ON "BankIntroTracking"("graduationRecordId");

-- AddForeignKey
ALTER TABLE "BankIntroTracking" ADD CONSTRAINT "BankIntroTracking_graduationRecordId_fkey" FOREIGN KEY ("graduationRecordId") REFERENCES "GraduationRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE;
