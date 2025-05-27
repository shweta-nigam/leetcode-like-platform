/*
  Warnings:

  - You are about to drop the column `createdAT` on the `Playlist` table. All the data in the column will be lost.
  - You are about to drop the column `createdAT` on the `ProblemInPlaylist` table. All the data in the column will be lost.
  - You are about to drop the column `createdAT` on the `ProblemSolved` table. All the data in the column will be lost.
  - You are about to drop the column `createdAT` on the `Problems` table. All the data in the column will be lost.
  - You are about to drop the column `createdAT` on the `Submission` table. All the data in the column will be lost.
  - You are about to drop the column `createdAT` on the `TestCaseResult` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Playlist" DROP COLUMN "createdAT",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "ProblemInPlaylist" DROP COLUMN "createdAT",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "ProblemSolved" DROP COLUMN "createdAT",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Problems" DROP COLUMN "createdAT",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Submission" DROP COLUMN "createdAT",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "TestCaseResult" DROP COLUMN "createdAT",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
