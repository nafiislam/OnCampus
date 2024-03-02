-- DropForeignKey
ALTER TABLE "event"."Event" DROP CONSTRAINT "Event_userId_fkey";

-- AlterTable
ALTER TABLE "post"."Post" ADD COLUMN     "reportCount" INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE "event"."Event" ADD CONSTRAINT "Event_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
