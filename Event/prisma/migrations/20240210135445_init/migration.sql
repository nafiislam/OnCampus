-- CreateEnum
CREATE TYPE "Tag" AS ENUM ('Workshop', 'Seminar', 'Sports', 'Competition', 'Rag_concert', 'Shapa_day', 'Flashmob', 'Cultural', 'Picnic', 'Tour', 'Normal_Online_Event', 'Normal_Offline_Event');

-- CreateEnum
CREATE TYPE "MeetingType" AS ENUM ('Online', 'Offline', 'Both', 'None');

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "finishDate" TIMESTAMP(3),
    "eventType" "MeetingType" NOT NULL,
    "location" TEXT,
    "onlineLink" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "organizers" TEXT NOT NULL,
    "Sponsors" TEXT,
    "registration" TEXT,
    "rules" TEXT,
    "prizes" TEXT,
    "tag" "Tag" NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Resources" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "eventId" TEXT,

    CONSTRAINT "Resources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Timeline" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "finishDate" TIMESTAMP(3),
    "meetingType" "MeetingType",
    "location" TEXT,
    "onlineLink" TEXT,
    "eventId" TEXT,

    CONSTRAINT "Timeline_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Resources" ADD CONSTRAINT "Resources_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Timeline" ADD CONSTRAINT "Timeline_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;
