/*
  Warnings:

  - Added the required column `batch` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `meritPosition` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `session` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "club";

-- CreateEnum
CREATE TYPE "club"."clubRole" AS ENUM ('PRESIDENT', 'VICE_PRESIDENT', 'GENERAL_SECRETARY', 'ASSISTANT_GENERAL_SECRETARY', 'SECRETARY', 'JOINT_SECRETARY', 'OFFICE_SECRETARY', 'EXECUTIVE', 'GENERAL');

-- AlterTable
ALTER TABLE "user"."User" ADD COLUMN     "batch" TEXT NOT NULL,
ADD COLUMN     "meritPosition" INTEGER NOT NULL,
ADD COLUMN     "session" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "club"."Club" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "images" TEXT[],

    CONSTRAINT "Club_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "club"."ClubMember" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "clubId" TEXT NOT NULL,
    "role" "club"."clubRole" NOT NULL DEFAULT 'GENERAL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClubMember_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "club"."ClubMember" ADD CONSTRAINT "ClubMember_email_fkey" FOREIGN KEY ("email") REFERENCES "user"."User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "club"."ClubMember" ADD CONSTRAINT "ClubMember_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "club"."Club"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
