-- AlterTable
ALTER TABLE "review" ADD COLUMN     "isSpoiler" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "tags" TEXT[];
