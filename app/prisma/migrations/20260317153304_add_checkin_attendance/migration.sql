-- CreateTable
CREATE TABLE "CheckInSession" (
    "id" TEXT NOT NULL,
    "cohortId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "note" TEXT,
    "attendanceSubmittedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CheckInSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AttendanceRecord" (
    "id" TEXT NOT NULL,
    "studentProfileId" TEXT NOT NULL,
    "checkInSessionId" TEXT NOT NULL,
    "present" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AttendanceRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CheckInSession_cohortId_idx" ON "CheckInSession"("cohortId");

-- CreateIndex
CREATE INDEX "AttendanceRecord_checkInSessionId_idx" ON "AttendanceRecord"("checkInSessionId");

-- CreateIndex
CREATE UNIQUE INDEX "AttendanceRecord_studentProfileId_checkInSessionId_key" ON "AttendanceRecord"("studentProfileId", "checkInSessionId");

-- AddForeignKey
ALTER TABLE "CheckInSession" ADD CONSTRAINT "CheckInSession_cohortId_fkey" FOREIGN KEY ("cohortId") REFERENCES "Cohort"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendanceRecord" ADD CONSTRAINT "AttendanceRecord_studentProfileId_fkey" FOREIGN KEY ("studentProfileId") REFERENCES "StudentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendanceRecord" ADD CONSTRAINT "AttendanceRecord_checkInSessionId_fkey" FOREIGN KEY ("checkInSessionId") REFERENCES "CheckInSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
