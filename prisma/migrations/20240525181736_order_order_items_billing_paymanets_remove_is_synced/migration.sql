/*
  Warnings:

  - You are about to drop the column `isSynced` on the `Billing` table. All the data in the column will be lost.
  - You are about to drop the column `isSynced` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `isSynced` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `isSynced` on the `Payment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Billing` DROP COLUMN `isSynced`;

-- AlterTable
ALTER TABLE `Order` DROP COLUMN `isSynced`;

-- AlterTable
ALTER TABLE `OrderItem` DROP COLUMN `isSynced`;

-- AlterTable
ALTER TABLE `Payment` DROP COLUMN `isSynced`;
