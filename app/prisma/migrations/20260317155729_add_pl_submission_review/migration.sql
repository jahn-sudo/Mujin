-- CreateEnum
CREATE TYPE "PLSubmissionStatus" AS ENUM ('PENDING', 'SUBMITTED', 'APPROVED', 'FLAGGED', 'MORE_INFO');

-- CreateEnum
CREATE TYPE "PLReviewAction" AS ENUM ('APPROVED', 'FLAGGED', 'MORE_INFO', 'SCORE_OVERRIDE');

-- CreateTable
CREATE TABLE "PLSubmission" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "month" TEXT NOT NULL,
    "revenue" INTEGER,
    "expenses" INTEGER,
    "net" INTEGER,
    "notes" TEXT,
    "receiptUrls" TEXT[],
    "submittedAt" TIMESTAMP(3),
    "autoScore" INTEGER,
    "staffScore" INTEGER,
    "finalScore" INTEGER,
    "status" "PLSubmissionStatus" NOT NULL DEFAULT 'PENDING',
    "spotAudit" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PLSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PLReview" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "staffId" TEXT NOT NULL,
    "action" "PLReviewAction" NOT NULL,
    "annotation" TEXT,
    "scoreOverride" INTEGER,
    "overrideReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PLReview_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PLSubmission_studentId_idx" ON "PLSubmission"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "PLSubmission_studentId_month_key" ON "PLSubmission"("studentId", "month");

-- CreateIndex
CREATE INDEX "PLReview_submissionId_idx" ON "PLReview"("submissionId");

-- AddForeignKey
ALTER TABLE "PLSubmission" ADD CONSTRAINT "PLSubmission_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "StudentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PLReview" ADD CONSTRAINT "PLReview_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "PLSubmission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PLReview" ADD CONSTRAINT "PLReview_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
