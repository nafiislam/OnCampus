/*
  Warnings:

  - Changed the type of `department` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "event";

-- CreateEnum
CREATE TYPE "user"."Access" AS ENUM ('BANNED', 'UNBANNED');

-- CreateEnum
CREATE TYPE "user"."dept" AS ENUM ('Computer_Science_and_Engineering', 'Mechanical_Engineering', 'Civil_Engineering', 'Biomedical_Engineering', 'Industrial_and_Production_Engineering', 'Naval_Architecture_and_Marine_Engineering', 'Water_Resource_Engineering', 'Materials_and_Metallurgical_Engineering', 'Chemical_Engineering', 'Nanomaterials_and_Ceramic_Engineering', 'Architecture', 'Electrical_and_Electronics_Engineering');

-- CreateEnum
CREATE TYPE "event"."EventTag" AS ENUM ('Workshop', 'Seminar', 'Sports', 'Competition', 'Rag_concert', 'Shapa_day', 'Flashmob', 'Cultural', 'Picnic', 'Tour', 'Normal_Online_Event', 'Normal_Offline_Event');

-- CreateEnum
CREATE TYPE "event"."MeetingType" AS ENUM ('Online', 'Offline', 'Both', 'None');

-- AlterTable
ALTER TABLE "user"."User" ADD COLUMN     "aboutMe" TEXT,
ADD COLUMN     "accessBatch" "user"."Access" NOT NULL DEFAULT 'UNBANNED',
ADD COLUMN     "accessDept" "user"."Access" NOT NULL DEFAULT 'UNBANNED',
ADD COLUMN     "accessDeptBatch" "user"."Access" NOT NULL DEFAULT 'UNBANNED',
ADD COLUMN     "accessGeneral" "user"."Access" NOT NULL DEFAULT 'UNBANNED',
ADD COLUMN     "address" TEXT,
ADD COLUMN     "bloodGroup" TEXT,
ADD COLUMN     "dateOfBirth" TIMESTAMP(3),
ADD COLUMN     "emergencyContact" TEXT,
ADD COLUMN     "section" TEXT,
DROP COLUMN "department",
ADD COLUMN     "department" "user"."dept" NOT NULL;

-- CreateTable
CREATE TABLE "user"."Batch" (
    "id" TEXT NOT NULL,
    "batchName" TEXT NOT NULL,

    CONSTRAINT "Batch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event"."Event" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "finishDate" TIMESTAMP(3),
    "eventType" "event"."MeetingType" NOT NULL,
    "location" TEXT,
    "onlineLink" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "organizers" TEXT NOT NULL,
    "Sponsors" TEXT,
    "registration" TEXT,
    "rules" TEXT,
    "prizes" TEXT,
    "tag" "event"."EventTag" NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event"."Resources" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "eventId" TEXT,

    CONSTRAINT "Resources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event"."Timeline" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "finishDate" TIMESTAMP(3),
    "meetingType" "event"."MeetingType",
    "location" TEXT,
    "onlineLink" TEXT,
    "eventId" TEXT,

    CONSTRAINT "Timeline_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Batch_batchName_key" ON "user"."Batch"("batchName");

-- AddForeignKey
ALTER TABLE "user"."User" ADD CONSTRAINT "User_batch_fkey" FOREIGN KEY ("batch") REFERENCES "user"."Batch"("batchName") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event"."Resources" ADD CONSTRAINT "Resources_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "event"."Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event"."Timeline" ADD CONSTRAINT "Timeline_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "event"."Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;
