/*
  Warnings:

  - You are about to drop the column `batch` on the `User` table. All the data in the column will be lost.
  - Added the required column `batchName` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user"."User" DROP COLUMN "batch",
ADD COLUMN     "batchName" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "user"."Batch" (
    "id" TEXT NOT NULL,
    "batchName" TEXT NOT NULL,

    CONSTRAINT "Batch_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Batch_batchName_key" ON "user"."Batch"("batchName");

-- AddForeignKey
ALTER TABLE "user"."User" ADD CONSTRAINT "User_batchName_fkey" FOREIGN KEY ("batchName") REFERENCES "user"."Batch"("batchName") ON DELETE RESTRICT ON UPDATE CASCADE;
