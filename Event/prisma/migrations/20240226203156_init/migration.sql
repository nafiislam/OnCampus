-- CreateTable
CREATE TABLE "post"."_ReportedPosts" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ReportedPosts_AB_unique" ON "post"."_ReportedPosts"("A", "B");

-- CreateIndex
CREATE INDEX "_ReportedPosts_B_index" ON "post"."_ReportedPosts"("B");

-- AddForeignKey
ALTER TABLE "post"."_ReportedPosts" ADD CONSTRAINT "_ReportedPosts_A_fkey" FOREIGN KEY ("A") REFERENCES "post"."Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post"."_ReportedPosts" ADD CONSTRAINT "_ReportedPosts_B_fkey" FOREIGN KEY ("B") REFERENCES "user"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
