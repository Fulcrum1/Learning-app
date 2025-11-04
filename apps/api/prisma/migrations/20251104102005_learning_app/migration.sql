/*
  Warnings:

  - You are about to drop the `ExpressionProgress` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Expressions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ExpressionsToCategories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ExpressionsToLists` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_VocabularyToCategories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_VocabularyToLists` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Type" AS ENUM ('WORD', 'EXPRESSION');

-- DropForeignKey
ALTER TABLE "public"."ExpressionProgress" DROP CONSTRAINT "ExpressionProgress_expressionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ExpressionProgress" DROP CONSTRAINT "ExpressionProgress_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."_ExpressionsToCategories" DROP CONSTRAINT "_ExpressionsToCategories_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_ExpressionsToCategories" DROP CONSTRAINT "_ExpressionsToCategories_B_fkey";

-- DropForeignKey
ALTER TABLE "public"."_ExpressionsToLists" DROP CONSTRAINT "_ExpressionsToLists_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_ExpressionsToLists" DROP CONSTRAINT "_ExpressionsToLists_B_fkey";

-- DropForeignKey
ALTER TABLE "public"."_VocabularyToCategories" DROP CONSTRAINT "_VocabularyToCategories_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_VocabularyToCategories" DROP CONSTRAINT "_VocabularyToCategories_B_fkey";

-- DropForeignKey
ALTER TABLE "public"."_VocabularyToLists" DROP CONSTRAINT "_VocabularyToLists_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_VocabularyToLists" DROP CONSTRAINT "_VocabularyToLists_B_fkey";

-- AlterTable
ALTER TABLE "Vocabulary" ADD COLUMN     "provenance" TEXT,
ADD COLUMN     "type" "Type" NOT NULL DEFAULT 'WORD';

-- DropTable
DROP TABLE "public"."ExpressionProgress";

-- DropTable
DROP TABLE "public"."Expressions";

-- DropTable
DROP TABLE "public"."_ExpressionsToCategories";

-- DropTable
DROP TABLE "public"."_ExpressionsToLists";

-- DropTable
DROP TABLE "public"."_VocabularyToCategories";

-- DropTable
DROP TABLE "public"."_VocabularyToLists";

-- CreateTable
CREATE TABLE "VocabularyList" (
    "id" TEXT NOT NULL,
    "vocabularyId" TEXT NOT NULL,
    "listId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "review" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VocabularyList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VocabularyToCategories" (
    "vocabularyId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "VocabularyList_listId_vocabularyId_key" ON "VocabularyList"("listId", "vocabularyId");

-- CreateIndex
CREATE UNIQUE INDEX "VocabularyToCategories_vocabularyId_categoryId_key" ON "VocabularyToCategories"("vocabularyId", "categoryId");

-- AddForeignKey
ALTER TABLE "VocabularyList" ADD CONSTRAINT "VocabularyList_vocabularyId_fkey" FOREIGN KEY ("vocabularyId") REFERENCES "Vocabulary"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VocabularyList" ADD CONSTRAINT "VocabularyList_listId_fkey" FOREIGN KEY ("listId") REFERENCES "Lists"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VocabularyToCategories" ADD CONSTRAINT "VocabularyToCategories_vocabularyId_fkey" FOREIGN KEY ("vocabularyId") REFERENCES "Vocabulary"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VocabularyToCategories" ADD CONSTRAINT "VocabularyToCategories_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
