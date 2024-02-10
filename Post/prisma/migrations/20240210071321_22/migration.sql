-- AlterTable
ALTER TABLE "user"."User" ADD COLUMN     "aboutMe" TEXT,
ADD COLUMN     "address" TEXT,
ADD COLUMN     "bloodGroup" TEXT,
ADD COLUMN     "dateOfBirth" TIMESTAMP(3),
ADD COLUMN     "emergencyContact" TEXT,
ADD COLUMN     "section" TEXT;
