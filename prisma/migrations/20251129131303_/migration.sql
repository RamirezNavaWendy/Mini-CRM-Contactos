/*
  Warnings:

  - You are about to drop the column `changedAt` on the `StatusHistory` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."StatusHistory" DROP CONSTRAINT "StatusHistory_contactId_fkey";

-- DropIndex
DROP INDEX "public"."Contact_email_key";

-- AlterTable
ALTER TABLE "public"."Contact" ALTER COLUMN "status" DROP DEFAULT;

-- AlterTable
ALTER TABLE "public"."StatusHistory" DROP COLUMN "changedAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AddForeignKey
ALTER TABLE "public"."StatusHistory" ADD CONSTRAINT "StatusHistory_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "public"."Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;
