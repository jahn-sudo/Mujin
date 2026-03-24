-- CreateTable
CREATE TABLE "GrantTranche2" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "releasedAt" TIMESTAMP(3) NOT NULL,
    "releasedById" TEXT NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GrantTranche2_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GrantTranche2_studentId_key" ON "GrantTranche2"("studentId");

-- AddForeignKey
ALTER TABLE "GrantTranche2" ADD CONSTRAINT "GrantTranche2_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "StudentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GrantTranche2" ADD CONSTRAINT "GrantTranche2_releasedById_fkey" FOREIGN KEY ("releasedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
