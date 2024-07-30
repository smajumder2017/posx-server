-- AlterTable
ALTER TABLE `billing` ADD COLUMN `deliveryPartnerId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Billing` ADD CONSTRAINT `Billing_deliveryPartnerId_fkey` FOREIGN KEY (`deliveryPartnerId`) REFERENCES `DeliveryPartner`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
