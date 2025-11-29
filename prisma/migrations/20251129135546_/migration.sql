/*
  Warnings:

  - You are about to drop the column `createdAt` on the `StatusHistory` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `Contact` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."Contact" ALTER COLUMN "status" SET DEFAULT 'PROSPECTO';

-- AlterTable
ALTER TABLE "public"."StatusHistory" DROP COLUMN "createdAt",
ADD COLUMN     "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "Contact_email_key" ON "public"."Contact"("email");
