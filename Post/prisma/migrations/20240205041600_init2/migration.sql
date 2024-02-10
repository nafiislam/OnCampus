/*
  Warnings:

  - You are about to drop the column `batchName` on the `User` table. All the data in the column will be lost.
  - Added the required column `batch` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "user"."User" DROP CONSTRAINT "User_batchName_fkey";

-- AlterTable
ALTER TABLE "user"."User" DROP COLUMN "batchName",
ADD COLUMN     "batch" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "user"."Dept" (
    "id" TEXT NOT NULL,
    "deptName" TEXT NOT NULL,

    CONSTRAINT "Dept_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Dept_deptName_key" ON "user"."Dept"("deptName");

-- AddForeignKey
ALTER TABLE "user"."User" ADD CONSTRAINT "User_batch_fkey" FOREIGN KEY ("batch") REFERENCES "user"."Batch"("batchName") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user"."User" ADD CONSTRAINT "User_department_fkey" FOREIGN KEY ("department") REFERENCES "user"."Dept"("deptName") ON DELETE RESTRICT ON UPDATE CASCADE;
