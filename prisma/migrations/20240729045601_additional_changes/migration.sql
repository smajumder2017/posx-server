-- DropForeignKey
ALTER TABLE `billing` DROP FOREIGN KEY `Billing_customerId_fkey`;

-- AlterTable
ALTER TABLE `billing` MODIFY `customerId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Billing` ADD CONSTRAINT `Billing_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
