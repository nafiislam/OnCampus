/*
  Warnings:

  - You are about to drop the column `content` on the `Reminder` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "post"."Reminder" DROP COLUMN "content";

-- CreateTable
CREATE TABLE "post"."Notification" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "time" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "postID" TEXT,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "post"."Notification" ADD CONSTRAINT "Notification_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "user"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post"."Notification" ADD CONSTRAINT "Notification_postID_fkey" FOREIGN KEY ("postID") REFERENCES "post"."Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
