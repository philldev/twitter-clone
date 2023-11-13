-- AlterTable
ALTER TABLE "Tweet" ADD COLUMN     "replyParentId" TEXT;

-- AddForeignKey
ALTER TABLE "Tweet" ADD CONSTRAINT "Tweet_replyParentId_fkey" FOREIGN KEY ("replyParentId") REFERENCES "Tweet"("id") ON DELETE SET NULL ON UPDATE CASCADE;
