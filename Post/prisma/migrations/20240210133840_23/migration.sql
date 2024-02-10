-- CreateEnum
CREATE TYPE "user"."Access" AS ENUM ('BANNED', 'UNBANNED');

-- AlterTable
ALTER TABLE "user"."User" ADD COLUMN     "accessBatch" "user"."Access" NOT NULL DEFAULT 'UNBANNED',
ADD COLUMN     "accessDept" "user"."Access" NOT NULL DEFAULT 'UNBANNED',
ADD COLUMN     "accessDeptBatch" "user"."Access" NOT NULL DEFAULT 'UNBANNED',
ADD COLUMN     "accessGeneral" "user"."Access" NOT NULL DEFAULT 'UNBANNED';
