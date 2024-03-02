/*
  Warnings:

  - You are about to drop the column `reportCount` on the `Post` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "event"."Resources" DROP CONSTRAINT "Resources_eventId_fkey";

-- DropForeignKey
ALTER TABLE "event"."Timeline" DROP CONSTRAINT "Timeline_eventId_fkey";

-- AlterTable
ALTER TABLE "post"."Post" DROP COLUMN "reportCount";

-- AddForeignKey
ALTER TABLE "event"."Resources" ADD CONSTRAINT "Resources_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "event"."Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event"."Timeline" ADD CONSTRAINT "Timeline_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "event"."Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
