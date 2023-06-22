/*
  Warnings:

  - You are about to drop the column `endTime` on the `item` table. All the data in the column will be lost.
  - Added the required column `startPrice` to the `item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `item` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "ItemStatusEnum" ADD VALUE 'PENDING';

-- AlterTable
ALTER TABLE "item" DROP COLUMN "endTime",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "publishedAt" TIMESTAMP(3),
ADD COLUMN     "startPrice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "item" ADD CONSTRAINT "item_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
