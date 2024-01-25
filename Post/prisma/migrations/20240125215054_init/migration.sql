/*
  Warnings:

  - You are about to drop the column `postID` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `time` on the `Notification` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[notificationId]` on the table `Post` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `belongsToId` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "post"."ReminderTag" AS ENUM ('POST', 'EVENT');

-- DropForeignKey
ALTER TABLE "post"."Notification" DROP CONSTRAINT "Notification_postID_fkey";

-- AlterTable
ALTER TABLE "post"."Notification" DROP COLUMN "postID",
DROP COLUMN "time",
ADD COLUMN     "belongsToId" TEXT NOT NULL,
ADD COLUMN     "seen" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "post"."Post" ADD COLUMN     "notificationId" TEXT;

-- AlterTable
ALTER TABLE "post"."Reminder" ADD COLUMN     "status" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "Post_notificationId_key" ON "post"."Post"("notificationId");

-- AddForeignKey
ALTER TABLE "post"."Post" ADD CONSTRAINT "Post_notificationId_fkey" FOREIGN KEY ("notificationId") REFERENCES "post"."Notification"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post"."Notification" ADD CONSTRAINT "Notification_belongsToId_fkey" FOREIGN KEY ("belongsToId") REFERENCES "user"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
