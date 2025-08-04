/*
  Warnings:

  - Made the column `userId` on table `Zone` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Zone" DROP CONSTRAINT "Zone_userId_fkey";

-- AlterTable
ALTER TABLE "Zone" ALTER COLUMN "userId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Zone" ADD CONSTRAINT "Zone_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
