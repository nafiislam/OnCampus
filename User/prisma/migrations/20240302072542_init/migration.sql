-- AlterEnum
ALTER TYPE "user"."dept" ADD VALUE 'Urban_and_Regional_Planning';

-- CreateTable
CREATE TABLE "user"."Album" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Album_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user"."Image" (
    "id" TEXT NOT NULL,
    "panorama" TEXT NOT NULL,
    "thumbnail" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "caption" TEXT NOT NULL,
    "gps_lat" TEXT NOT NULL,
    "gps_long" TEXT NOT NULL,
    "gps_alt" TEXT NOT NULL,
    "imageLinkId" TEXT NOT NULL,
    "albumId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "user"."Image" ADD CONSTRAINT "Image_imageLinkId_fkey" FOREIGN KEY ("imageLinkId") REFERENCES "user"."Image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user"."Image" ADD CONSTRAINT "Image_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "user"."Album"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
