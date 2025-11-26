-- DropForeignKey
ALTER TABLE "public"."VocabularyList" DROP CONSTRAINT "VocabularyList_listId_fkey";

-- AddForeignKey
ALTER TABLE "VocabularyList" ADD CONSTRAINT "VocabularyList_listId_fkey" FOREIGN KEY ("listId") REFERENCES "Lists"("id") ON DELETE CASCADE ON UPDATE CASCADE;
