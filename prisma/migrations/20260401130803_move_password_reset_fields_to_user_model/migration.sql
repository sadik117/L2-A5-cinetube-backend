/*
  Warnings:

  - You are about to drop the column `passwordResetExpires` on the `session` table. All the data in the column will be lost.
  - You are about to drop the column `passwordResetToken` on the `session` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "session" DROP COLUMN "passwordResetExpires",
DROP COLUMN "passwordResetToken";

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "passwordResetExpires" TIMESTAMP(3),
ADD COLUMN     "passwordResetToken" TEXT;
