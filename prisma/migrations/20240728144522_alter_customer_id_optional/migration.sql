/*
  Warnings:

  - A unique constraint covering the columns `[deliveryPartnerId,partnerOrderId]` on the table `Order` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `deliverypartner` ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE UNIQUE INDEX `Order_deliveryPartnerId_partnerOrderId_key` ON `Order`(`deliveryPartnerId`, `partnerOrderId`);
