-- CreateEnum
CREATE TYPE "TrustScoreLabel" AS ENUM ('GREEN', 'YELLOW', 'RED');

-- CreateTable
CREATE TABLE "TrustScore" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "month" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "label" "TrustScoreLabel" NOT NULL,
    "responsivenessRaw" DOUBLE PRECISION NOT NULL,
    "transparencyRaw" DOUBLE PRECISION NOT NULL,
    "mutualismRaw" DOUBLE PRECISION NOT NULL,
    "reflectionRaw" DOUBLE PRECISION NOT NULL,
    "isOverridden" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrustScore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrustScoreOverride" (
    "id" TEXT NOT NULL,
    "scoreId" TEXT NOT NULL,
    "staffId" TEXT NOT NULL,
    "newScore" DOUBLE PRECISION NOT NULL,
    "reason" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TrustScoreOverride_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TrustScore_studentId_idx" ON "TrustScore"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "TrustScore_studentId_month_key" ON "TrustScore"("studentId", "month");

-- CreateIndex
CREATE UNIQUE INDEX "TrustScoreOverride_scoreId_key" ON "TrustScoreOverride"("scoreId");

-- CreateIndex
CREATE INDEX "TrustScoreOverride_staffId_idx" ON "TrustScoreOverride"("staffId");

-- AddForeignKey
ALTER TABLE "TrustScore" ADD CONSTRAINT "TrustScore_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "StudentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrustScoreOverride" ADD CONSTRAINT "TrustScoreOverride_scoreId_fkey" FOREIGN KEY ("scoreId") REFERENCES "TrustScore"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrustScoreOverride" ADD CONSTRAINT "TrustScoreOverride_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
