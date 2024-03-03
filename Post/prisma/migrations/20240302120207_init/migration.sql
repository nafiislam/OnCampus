/*
  Warnings:

  - You are about to drop the column `imageLinkId` on the `Image` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "user"."Image" DROP CONSTRAINT "Image_imageLinkId_fkey";

-- AlterTable
ALTER TABLE "user"."Image" DROP COLUMN "imageLinkId",
ADD COLUMN     "links" TEXT[] DEFAULT ARRAY[]::TEXT[];
