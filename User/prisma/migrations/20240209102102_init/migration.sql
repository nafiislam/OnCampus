-- CreateTable
CREATE TABLE "post"."_IntPosts" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_IntPosts_AB_unique" ON "post"."_IntPosts"("A", "B");

-- CreateIndex
CREATE INDEX "_IntPosts_B_index" ON "post"."_IntPosts"("B");

-- AddForeignKey
ALTER TABLE "post"."_IntPosts" ADD CONSTRAINT "_IntPosts_A_fkey" FOREIGN KEY ("A") REFERENCES "post"."Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post"."_IntPosts" ADD CONSTRAINT "_IntPosts_B_fkey" FOREIGN KEY ("B") REFERENCES "user"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
