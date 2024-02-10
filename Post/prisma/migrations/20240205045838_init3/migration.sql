/*
  Warnings:

  - You are about to drop the `Dept` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "user"."departments" AS ENUM ('Computer_Science_and_Engineering', 'Mechanical_Engineering', 'Civil_Engineering', 'Biomedical_Engineering', 'Industrial_and_Production_Engineering', 'Naval_Architecture_and_Marine_Engineering', 'Water_Resource_Engineering', 'Materials_and_Metallurgical_Engineering', 'Chemical_Engineering', 'Nanomaterials_and_Ceramic_Engineering', 'Architecture', 'Electrical_and_Electronics_Engineering');

-- DropForeignKey
ALTER TABLE "user"."User" DROP CONSTRAINT "User_department_fkey";

-- DropTable
DROP TABLE "user"."Dept";
