-- DropForeignKey
ALTER TABLE "club"."ClubMember" DROP CONSTRAINT "ClubMember_clubId_fkey";

-- DropForeignKey
ALTER TABLE "club"."ClubMember" DROP CONSTRAINT "ClubMember_email_fkey";

-- AddForeignKey
ALTER TABLE "club"."ClubMember" ADD CONSTRAINT "ClubMember_email_fkey" FOREIGN KEY ("email") REFERENCES "user"."User"("email") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "club"."ClubMember" ADD CONSTRAINT "ClubMember_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "club"."Club"("id") ON DELETE CASCADE ON UPDATE CASCADE;
