/*
  Warnings:

  - Added the required column `userId` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "event"."Event" ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "event"."_participatedBy" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "event"."_savedBy" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_participatedBy_AB_unique" ON "event"."_participatedBy"("A", "B");

-- CreateIndex
CREATE INDEX "_participatedBy_B_index" ON "event"."_participatedBy"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_savedBy_AB_unique" ON "event"."_savedBy"("A", "B");

-- CreateIndex
CREATE INDEX "_savedBy_B_index" ON "event"."_savedBy"("B");

-- AddForeignKey
ALTER TABLE "event"."Event" ADD CONSTRAINT "Event_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event"."_participatedBy" ADD CONSTRAINT "_participatedBy_A_fkey" FOREIGN KEY ("A") REFERENCES "event"."Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event"."_participatedBy" ADD CONSTRAINT "_participatedBy_B_fkey" FOREIGN KEY ("B") REFERENCES "user"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event"."_savedBy" ADD CONSTRAINT "_savedBy_A_fkey" FOREIGN KEY ("A") REFERENCES "event"."Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event"."_savedBy" ADD CONSTRAINT "_savedBy_B_fkey" FOREIGN KEY ("B") REFERENCES "user"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
