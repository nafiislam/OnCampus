-- AlterTable
ALTER TABLE "post"."Post" ADD COLUMN     "attachmentNames" TEXT[],
ADD COLUMN     "imageNames" TEXT[];

-- CreateIndex
CREATE INDEX "User_email_idx" ON "user"."User"("email");
