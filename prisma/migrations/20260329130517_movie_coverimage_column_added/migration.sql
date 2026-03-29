/*
  Warnings:

  - Added the required column `coverImage` to the `media` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "media" ADD COLUMN     "coverImage" TEXT NOT NULL;
