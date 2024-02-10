/*
  Warnings:

  - Changed the type of `department` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "user"."dept" AS ENUM ('Computer_Science_and_Engineering', 'Mechanical_Engineering', 'Civil_Engineering', 'Biomedical_Engineering', 'Industrial_and_Production_Engineering', 'Naval_Architecture_and_Marine_Engineering', 'Water_Resource_Engineering', 'Materials_and_Metallurgical_Engineering', 'Chemical_Engineering', 'Nanomaterials_and_Ceramic_Engineering', 'Architecture', 'Electrical_and_Electronics_Engineering');

-- AlterTable
ALTER TABLE "user"."User" DROP COLUMN "department",
ADD COLUMN     "department" "user"."dept" NOT NULL;

-- DropEnum
DROP TYPE "user"."department";
