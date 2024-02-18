-- AlterTable
ALTER TABLE "event"."Event" ALTER COLUMN "startDate" SET DATA TYPE TEXT,
ALTER COLUMN "finishDate" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "event"."Timeline" ALTER COLUMN "startDate" SET DATA TYPE TEXT,
ALTER COLUMN "finishDate" SET DATA TYPE TEXT;
