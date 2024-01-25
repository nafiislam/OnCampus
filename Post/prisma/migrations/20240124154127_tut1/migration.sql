/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Club` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "user"."User" ALTER COLUMN "password" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Club_name_key" ON "club"."Club"("name");
