/*
  Warnings:

  - You are about to drop the column `isSpoiler` on the `review` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `review` table. All the data in the column will be lost.
  - You are about to drop the `like` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updatedAt` to the `comment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "like" DROP CONSTRAINT "like_reviewId_fkey";

-- DropForeignKey
ALTER TABLE "like" DROP CONSTRAINT "like_userId_fkey";

-- AlterTable
ALTER TABLE "comment" ADD COLUMN     "isApproved" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "review" DROP COLUMN "isSpoiler",
DROP COLUMN "tags";

-- DropTable
DROP TABLE "like";

-- CreateTable
CREATE TABLE "comment_like" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "commentId" TEXT NOT NULL,

    CONSTRAINT "comment_like_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "review_like" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "reviewId" TEXT NOT NULL,

    CONSTRAINT "review_like_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "comment_like_userId_commentId_key" ON "comment_like"("userId", "commentId");

-- CreateIndex
CREATE UNIQUE INDEX "review_like_userId_reviewId_key" ON "review_like"("userId", "reviewId");

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment_like" ADD CONSTRAINT "comment_like_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment_like" ADD CONSTRAINT "comment_like_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "comment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review_like" ADD CONSTRAINT "review_like_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review_like" ADD CONSTRAINT "review_like_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "review"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
