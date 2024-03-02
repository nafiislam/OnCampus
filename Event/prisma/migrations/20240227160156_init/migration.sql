-- AlterTable
ALTER TABLE "event"."Notice" ADD COLUMN     "attachmentNames" TEXT[],
ADD COLUMN     "attachments" TEXT[],
ADD COLUMN     "imageNames" TEXT[],
ADD COLUMN     "images" TEXT[];
