/*
  Warnings:

  - Added the required column `type` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "post"."Post" ADD COLUMN     "type" TEXT NOT NULL;
