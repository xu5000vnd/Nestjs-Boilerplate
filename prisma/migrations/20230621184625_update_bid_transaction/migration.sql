/*
  Warnings:

  - You are about to drop the `bid_refund` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "bid_refund" DROP CONSTRAINT "bid_refund_bidId_fkey";

-- DropForeignKey
ALTER TABLE "bid_refund" DROP CONSTRAINT "bid_refund_transactionId_fkey";

-- DropTable
DROP TABLE "bid_refund";

-- CreateTable
CREATE TABLE "bid_transaction" (
    "id" SERIAL NOT NULL,
    "bidId" INTEGER NOT NULL,
    "transactionId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bid_transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "bid_transaction_bidId_key" ON "bid_transaction"("bidId");

-- CreateIndex
CREATE UNIQUE INDEX "bid_transaction_transactionId_key" ON "bid_transaction"("transactionId");

-- AddForeignKey
ALTER TABLE "bid_transaction" ADD CONSTRAINT "bid_transaction_bidId_fkey" FOREIGN KEY ("bidId") REFERENCES "bid"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bid_transaction" ADD CONSTRAINT "bid_transaction_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
