-- CreateEnum
CREATE TYPE "ReflectionResult" AS ENUM ('MEANINGFUL', 'NOT_MEANINGFUL');

-- CreateEnum
CREATE TYPE "ResubmissionState" AS ENUM ('NONE', 'WINDOW_OPEN', 'WINDOW_EXPIRED', 'RESUBMITTED', 'LOCKED');

-- CreateTable
CREATE TABLE "TownHall" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TownHall_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TownHallSubmission" (
    "id" TEXT NOT NULL,
    "townHallId" TEXT NOT NULL,
    "submittedById" TEXT NOT NULL,
    "attendeeIds" TEXT[],
    "attended" BOOLEAN,
    "reflectionText" TEXT NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TownHallSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReflectionAssessment" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "result" "ReflectionResult" NOT NULL,
    "resubmissionState" "ResubmissionState" NOT NULL DEFAULT 'NONE',
    "windowExpiresAt" TIMESTAMP(3),
    "resubmittedAt" TIMESTAMP(3),
    "quarter" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReflectionAssessment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TownHall_orgId_idx" ON "TownHall"("orgId");

-- CreateIndex
CREATE INDEX "TownHallSubmission_townHallId_idx" ON "TownHallSubmission"("townHallId");

-- CreateIndex
CREATE UNIQUE INDEX "TownHallSubmission_townHallId_submittedById_key" ON "TownHallSubmission"("townHallId", "submittedById");

-- CreateIndex
CREATE UNIQUE INDEX "ReflectionAssessment_submissionId_key" ON "ReflectionAssessment"("submissionId");

-- AddForeignKey
ALTER TABLE "TownHall" ADD CONSTRAINT "TownHall_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TownHallSubmission" ADD CONSTRAINT "TownHallSubmission_townHallId_fkey" FOREIGN KEY ("townHallId") REFERENCES "TownHall"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TownHallSubmission" ADD CONSTRAINT "TownHallSubmission_submittedById_fkey" FOREIGN KEY ("submittedById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReflectionAssessment" ADD CONSTRAINT "ReflectionAssessment_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "TownHallSubmission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
