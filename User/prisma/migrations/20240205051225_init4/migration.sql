/*
  Warnings:

  - The values [Computer_Science_and_Engineering,Mechanical_Engineering,Civil_Engineering,Biomedical_Engineering,Industrial_and_Production_Engineering,Naval_Architecture_and_Marine_Engineering,Water_Resource_Engineering,Materials_and_Metallurgical_Engineering,Chemical_Engineering,Nanomaterials_and_Ceramic_Engineering,Architecture,Electrical_and_Electronics_Engineering] on the enum `departments` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "user"."departments_new" AS ENUM ('CSE');
ALTER TYPE "user"."departments" RENAME TO "departments_old";
ALTER TYPE "user"."departments_new" RENAME TO "departments";
DROP TYPE "user"."departments_old";
COMMIT;
