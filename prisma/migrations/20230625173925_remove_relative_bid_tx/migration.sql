-- DropForeignKey
ALTER TABLE "bid_transaction" DROP CONSTRAINT "bid_transaction_bidId_fkey";

-- DropForeignKey
ALTER TABLE "bid_transaction" DROP CONSTRAINT "bid_transaction_transactionId_fkey";

-- DropIndex
DROP INDEX "bid_transaction_bidId_key";

-- DropIndex
DROP INDEX "bid_transaction_transactionId_key";
