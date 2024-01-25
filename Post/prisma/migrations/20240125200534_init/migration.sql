/*
  Warnings:

  - Added the required column `isPoll` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "post"."Tag" ADD VALUE 'DISCUSSION';
ALTER TYPE "post"."Tag" ADD VALUE 'PRODUCT';
ALTER TYPE "post"."Tag" ADD VALUE 'TECH';

-- AlterTable
ALTER TABLE "post"."Post" ADD COLUMN     "isPoll" BOOLEAN NOT NULL;

-- CreateTable
CREATE TABLE "post"."Option" (
    "optionID" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "postID" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Option_pkey" PRIMARY KEY ("optionID")
);

-- CreateTable
CREATE TABLE "post"."_VotedOptions" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_VotedOptions_AB_unique" ON "post"."_VotedOptions"("A", "B");

-- CreateIndex
CREATE INDEX "_VotedOptions_B_index" ON "post"."_VotedOptions"("B");

-- AddForeignKey
ALTER TABLE "post"."Option" ADD CONSTRAINT "Option_postID_fkey" FOREIGN KEY ("postID") REFERENCES "post"."Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post"."_VotedOptions" ADD CONSTRAINT "_VotedOptions_A_fkey" FOREIGN KEY ("A") REFERENCES "post"."Option"("optionID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post"."_VotedOptions" ADD CONSTRAINT "_VotedOptions_B_fkey" FOREIGN KEY ("B") REFERENCES "user"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
