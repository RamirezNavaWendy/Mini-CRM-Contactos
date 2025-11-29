-- DropForeignKey
ALTER TABLE "public"."StatusHistory" DROP CONSTRAINT "StatusHistory_contactId_fkey";

-- AddForeignKey
ALTER TABLE "public"."StatusHistory" ADD CONSTRAINT "StatusHistory_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "public"."Contact"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
