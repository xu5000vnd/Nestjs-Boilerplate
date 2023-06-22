/*
  Warnings:

  - The values [REFUND] on the enum `TransactionEnum` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TransactionEnum_new" AS ENUM ('DEPOSIT', 'WITHDRAW');
ALTER TABLE "transaction" ALTER COLUMN "state" TYPE "TransactionEnum_new" USING ("state"::text::"TransactionEnum_new");
ALTER TYPE "TransactionEnum" RENAME TO "TransactionEnum_old";
ALTER TYPE "TransactionEnum_new" RENAME TO "TransactionEnum";
DROP TYPE "TransactionEnum_old";
COMMIT;
