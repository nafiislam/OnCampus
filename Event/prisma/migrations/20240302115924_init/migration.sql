-- DropForeignKey
ALTER TABLE "user"."Image" DROP CONSTRAINT "Image_imageLinkId_fkey";

-- AlterTable
ALTER TABLE "user"."Image" ALTER COLUMN "imageLinkId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "user"."Image" ADD CONSTRAINT "Image_imageLinkId_fkey" FOREIGN KEY ("imageLinkId") REFERENCES "user"."Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;
