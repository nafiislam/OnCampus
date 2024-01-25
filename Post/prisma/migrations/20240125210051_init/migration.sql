-- DropForeignKey
ALTER TABLE "post"."Option" DROP CONSTRAINT "Option_postID_fkey";

-- CreateTable
CREATE TABLE "post"."Reminder" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "time" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "postID" TEXT,

    CONSTRAINT "Reminder_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "post"."Option" ADD CONSTRAINT "Option_postID_fkey" FOREIGN KEY ("postID") REFERENCES "post"."Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post"."Reminder" ADD CONSTRAINT "Reminder_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "user"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post"."Reminder" ADD CONSTRAINT "Reminder_postID_fkey" FOREIGN KEY ("postID") REFERENCES "post"."Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
