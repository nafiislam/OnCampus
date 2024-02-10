/*
  Warnings:

  - The values [TECH] on the enum `Tag` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "post"."Tag_new" AS ENUM ('TUITION', 'BLOOD', 'DISCUSSION', 'PRODUCT');
ALTER TABLE "post"."Post" ALTER COLUMN "tags" TYPE "post"."Tag_new"[] USING ("tags"::text::"post"."Tag_new"[]);
ALTER TYPE "post"."Tag" RENAME TO "Tag_old";
ALTER TYPE "post"."Tag_new" RENAME TO "Tag";
DROP TYPE "post"."Tag_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "club"."ClubMember" DROP CONSTRAINT "ClubMember_clubId_fkey";

-- DropForeignKey
ALTER TABLE "club"."ClubMember" DROP CONSTRAINT "ClubMember_email_fkey";

-- CreateTable
CREATE TABLE "post"."BloodInfo" (
    "id" TEXT NOT NULL,
    "bloodGroup" TEXT NOT NULL,
    "units" INTEGER NOT NULL,
    "hospital" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "parentPostId" TEXT NOT NULL,

    CONSTRAINT "BloodInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post"."TuitionInfo" (
    "id" TEXT NOT NULL,
    "genderPreference" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "class" TEXT NOT NULL,
    "member" INTEGER NOT NULL,
    "subject" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "medium" TEXT NOT NULL,
    "salary" INTEGER NOT NULL,
    "contact" TEXT NOT NULL,
    "studentInstitute" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "parentPostId" TEXT NOT NULL,

    CONSTRAINT "TuitionInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post"."ProductInfo" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "contact" TEXT NOT NULL,
    "parentPostId" TEXT NOT NULL,

    CONSTRAINT "ProductInfo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BloodInfo_parentPostId_key" ON "post"."BloodInfo"("parentPostId");

-- CreateIndex
CREATE UNIQUE INDEX "TuitionInfo_parentPostId_key" ON "post"."TuitionInfo"("parentPostId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductInfo_parentPostId_key" ON "post"."ProductInfo"("parentPostId");

-- AddForeignKey
ALTER TABLE "club"."ClubMember" ADD CONSTRAINT "ClubMember_email_fkey" FOREIGN KEY ("email") REFERENCES "user"."User"("email") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "club"."ClubMember" ADD CONSTRAINT "ClubMember_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "club"."Club"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post"."BloodInfo" ADD CONSTRAINT "BloodInfo_parentPostId_fkey" FOREIGN KEY ("parentPostId") REFERENCES "post"."Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post"."TuitionInfo" ADD CONSTRAINT "TuitionInfo_parentPostId_fkey" FOREIGN KEY ("parentPostId") REFERENCES "post"."Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post"."ProductInfo" ADD CONSTRAINT "ProductInfo_parentPostId_fkey" FOREIGN KEY ("parentPostId") REFERENCES "post"."Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
