-- CreateEnum
CREATE TYPE "post"."Tag" AS ENUM ('TUITION', 'BLOOD');

-- CreateTable
CREATE TABLE "user"."User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "profilePicture" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "role" "user"."Role" NOT NULL DEFAULT 'USER',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post"."Post" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "images" TEXT[],
    "anonymous" BOOLEAN NOT NULL,
    "tags" "post"."Tag"[],
    "attachments" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "commentAllow" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post"."Comment" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "parentPostId" TEXT,
    "parentCommentID" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post"."_LikedPosts" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "post"."_SavedPosts" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "post"."_ViewedPosts" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "post"."_LikedComments" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "user"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "_LikedPosts_AB_unique" ON "post"."_LikedPosts"("A", "B");

-- CreateIndex
CREATE INDEX "_LikedPosts_B_index" ON "post"."_LikedPosts"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_SavedPosts_AB_unique" ON "post"."_SavedPosts"("A", "B");

-- CreateIndex
CREATE INDEX "_SavedPosts_B_index" ON "post"."_SavedPosts"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ViewedPosts_AB_unique" ON "post"."_ViewedPosts"("A", "B");

-- CreateIndex
CREATE INDEX "_ViewedPosts_B_index" ON "post"."_ViewedPosts"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_LikedComments_AB_unique" ON "post"."_LikedComments"("A", "B");

-- CreateIndex
CREATE INDEX "_LikedComments_B_index" ON "post"."_LikedComments"("B");

-- AddForeignKey
ALTER TABLE "post"."Post" ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "user"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post"."Comment" ADD CONSTRAINT "Comment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "user"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post"."Comment" ADD CONSTRAINT "Comment_parentPostId_fkey" FOREIGN KEY ("parentPostId") REFERENCES "post"."Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post"."Comment" ADD CONSTRAINT "Comment_parentCommentID_fkey" FOREIGN KEY ("parentCommentID") REFERENCES "post"."Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post"."_LikedPosts" ADD CONSTRAINT "_LikedPosts_A_fkey" FOREIGN KEY ("A") REFERENCES "post"."Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post"."_LikedPosts" ADD CONSTRAINT "_LikedPosts_B_fkey" FOREIGN KEY ("B") REFERENCES "user"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post"."_SavedPosts" ADD CONSTRAINT "_SavedPosts_A_fkey" FOREIGN KEY ("A") REFERENCES "post"."Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post"."_SavedPosts" ADD CONSTRAINT "_SavedPosts_B_fkey" FOREIGN KEY ("B") REFERENCES "user"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post"."_ViewedPosts" ADD CONSTRAINT "_ViewedPosts_A_fkey" FOREIGN KEY ("A") REFERENCES "post"."Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post"."_ViewedPosts" ADD CONSTRAINT "_ViewedPosts_B_fkey" FOREIGN KEY ("B") REFERENCES "user"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post"."_LikedComments" ADD CONSTRAINT "_LikedComments_A_fkey" FOREIGN KEY ("A") REFERENCES "post"."Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post"."_LikedComments" ADD CONSTRAINT "_LikedComments_B_fkey" FOREIGN KEY ("B") REFERENCES "user"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
