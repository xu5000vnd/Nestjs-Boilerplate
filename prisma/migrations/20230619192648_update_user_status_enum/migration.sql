/*
  Warnings:

  - Changed the type of `status` on the `user` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "UserStatusEnum" AS ENUM ('ACTIVE', 'INACTIVE', 'NOT_CONFIRM');

-- AlterTable
ALTER TABLE "user" DROP COLUMN "status",
ADD COLUMN     "status" "UserStatusEnum" NOT NULL,
ALTER COLUMN "balance" SET DEFAULT 0;
