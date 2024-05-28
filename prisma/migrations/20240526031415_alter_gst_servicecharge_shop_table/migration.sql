-- AlterTable
ALTER TABLE `Shop` ADD COLUMN `cgstPercentage` INTEGER NULL,
    ADD COLUMN `gstinNo` VARCHAR(191) NULL,
    ADD COLUMN `serviceChargePercentage` INTEGER NULL,
    ADD COLUMN `sgstPercentage` INTEGER NULL;
