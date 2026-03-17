-- CreateEnum
CREATE TYPE "GraduationStatus" AS ENUM ('INELIGIBLE', 'ELIGIBLE', 'INTERVIEW_SCHEDULED', 'INTERVIEW_PASSED', 'INTERVIEW_FAILED', 'GRADUATED');

-- CreateTable
CREATE TABLE "GraduationRecord" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "status" "GraduationStatus" NOT NULL DEFAULT 'INELIGIBLE',
    "interviewScheduledAt" TIMESTAMP(3),
    "interviewDate" TIMESTAMP(3),
    "interviewConductedAt" TIMESTAMP(3),
    "interviewResult" TEXT,
    "lastInterviewFailedAt" TIMESTAMP(3),
    "bankIntroDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GraduationRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GraduationRecord_studentId_key" ON "GraduationRecord"("studentId");

-- CreateIndex
CREATE INDEX "GraduationRecord_status_idx" ON "GraduationRecord"("status");

-- AddForeignKey
ALTER TABLE "GraduationRecord" ADD CONSTRAINT "GraduationRecord_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "StudentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
