-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vocabulary" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "translation" TEXT NOT NULL,
    "pronunciation" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vocabulary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Expressions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "translation" TEXT NOT NULL,
    "pronunciation" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Expressions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lists" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Lists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VocabularyProgress" (
    "id" TEXT NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,
    "lastReview" TIMESTAMP(3),
    "userId" TEXT NOT NULL,
    "vocabularyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VocabularyProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExpressionProgress" (
    "id" TEXT NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,
    "lastReview" TIMESTAMP(3),
    "userId" TEXT NOT NULL,
    "expressionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExpressionProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ExpressionsToLists" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ExpressionsToLists_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_VocabularyToLists" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_VocabularyToLists_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_VocabularyToCategories" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_VocabularyToCategories_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ExpressionsToCategories" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ExpressionsToCategories_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "VocabularyProgress_userId_vocabularyId_key" ON "VocabularyProgress"("userId", "vocabularyId");

-- CreateIndex
CREATE UNIQUE INDEX "ExpressionProgress_userId_expressionId_key" ON "ExpressionProgress"("userId", "expressionId");

-- CreateIndex
CREATE INDEX "_ExpressionsToLists_B_index" ON "_ExpressionsToLists"("B");

-- CreateIndex
CREATE INDEX "_VocabularyToLists_B_index" ON "_VocabularyToLists"("B");

-- CreateIndex
CREATE INDEX "_VocabularyToCategories_B_index" ON "_VocabularyToCategories"("B");

-- CreateIndex
CREATE INDEX "_ExpressionsToCategories_B_index" ON "_ExpressionsToCategories"("B");

-- AddForeignKey
ALTER TABLE "Lists" ADD CONSTRAINT "Lists_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VocabularyProgress" ADD CONSTRAINT "VocabularyProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VocabularyProgress" ADD CONSTRAINT "VocabularyProgress_vocabularyId_fkey" FOREIGN KEY ("vocabularyId") REFERENCES "Vocabulary"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExpressionProgress" ADD CONSTRAINT "ExpressionProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExpressionProgress" ADD CONSTRAINT "ExpressionProgress_expressionId_fkey" FOREIGN KEY ("expressionId") REFERENCES "Expressions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExpressionsToLists" ADD CONSTRAINT "_ExpressionsToLists_A_fkey" FOREIGN KEY ("A") REFERENCES "Expressions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExpressionsToLists" ADD CONSTRAINT "_ExpressionsToLists_B_fkey" FOREIGN KEY ("B") REFERENCES "Lists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_VocabularyToLists" ADD CONSTRAINT "_VocabularyToLists_A_fkey" FOREIGN KEY ("A") REFERENCES "Lists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_VocabularyToLists" ADD CONSTRAINT "_VocabularyToLists_B_fkey" FOREIGN KEY ("B") REFERENCES "Vocabulary"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_VocabularyToCategories" ADD CONSTRAINT "_VocabularyToCategories_A_fkey" FOREIGN KEY ("A") REFERENCES "Categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_VocabularyToCategories" ADD CONSTRAINT "_VocabularyToCategories_B_fkey" FOREIGN KEY ("B") REFERENCES "Vocabulary"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExpressionsToCategories" ADD CONSTRAINT "_ExpressionsToCategories_A_fkey" FOREIGN KEY ("A") REFERENCES "Categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExpressionsToCategories" ADD CONSTRAINT "_ExpressionsToCategories_B_fkey" FOREIGN KEY ("B") REFERENCES "Expressions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
