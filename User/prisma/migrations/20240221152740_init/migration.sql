/*
  Warnings:

  - You are about to drop the column `meritPosition` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user"."User" DROP COLUMN "meritPosition",
ALTER COLUMN "session" DROP NOT NULL;
