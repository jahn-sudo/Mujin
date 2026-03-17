-- CreateTable
CREATE TABLE "CheckInNote" (
    "id" TEXT NOT NULL,
    "checkInSessionId" TEXT NOT NULL,
    "studentProfileId" TEXT NOT NULL,
    "agendaRecap" TEXT NOT NULL,
    "actionItems" TEXT NOT NULL,
    "reflection" TEXT NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CheckInNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CheckInGrade" (
    "id" TEXT NOT NULL,
    "noteId" TEXT NOT NULL,
    "mentorId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "feedback" TEXT NOT NULL,
    "gradedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CheckInGrade_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CheckInNote_checkInSessionId_idx" ON "CheckInNote"("checkInSessionId");

-- CreateIndex
CREATE INDEX "CheckInNote_studentProfileId_idx" ON "CheckInNote"("studentProfileId");

-- CreateIndex
CREATE UNIQUE INDEX "CheckInNote_checkInSessionId_studentProfileId_key" ON "CheckInNote"("checkInSessionId", "studentProfileId");

-- CreateIndex
CREATE UNIQUE INDEX "CheckInGrade_noteId_key" ON "CheckInGrade"("noteId");

-- CreateIndex
CREATE INDEX "CheckInGrade_mentorId_idx" ON "CheckInGrade"("mentorId");

-- AddForeignKey
ALTER TABLE "CheckInNote" ADD CONSTRAINT "CheckInNote_checkInSessionId_fkey" FOREIGN KEY ("checkInSessionId") REFERENCES "CheckInSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckInNote" ADD CONSTRAINT "CheckInNote_studentProfileId_fkey" FOREIGN KEY ("studentProfileId") REFERENCES "StudentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckInGrade" ADD CONSTRAINT "CheckInGrade_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "CheckInNote"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckInGrade" ADD CONSTRAINT "CheckInGrade_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
