-- CreateTable
CREATE TABLE "VocabularyProgressHistory" (
    "id" TEXT NOT NULL,
    "progressId" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "lastReview" TIMESTAMP(3),
    "reviewNumber" INTEGER NOT NULL,
    "changedBy" TEXT NOT NULL,
    "changeType" TEXT NOT NULL,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VocabularyProgressHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "VocabularyProgressHistory" ADD CONSTRAINT "VocabularyProgressHistory_progressId_fkey" FOREIGN KEY ("progressId") REFERENCES "VocabularyProgress"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
