/*
  Warnings:

  - Changed the type of `type` on the `Notification` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `type` on the `Reminder` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "post"."Notification" DROP COLUMN "type",
ADD COLUMN     "type" "post"."ReminderTag" NOT NULL;

-- AlterTable
ALTER TABLE "post"."Reminder" DROP COLUMN "type",
ADD COLUMN     "type" "post"."ReminderTag" NOT NULL;
