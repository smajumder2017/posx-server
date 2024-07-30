-- AlterTable
ALTER TABLE `MenuItems` ADD COLUMN `onlineDeliveryPrice` DOUBLE NULL;

-- AlterTable
ALTER TABLE `Order` ADD COLUMN `deliveryPartnerId` VARCHAR(191) NULL,
    ADD COLUMN `partnerOrderId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `DeliveryPartner` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `DeliveryPartner_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_deliveryPartnerId_fkey` FOREIGN KEY (`deliveryPartnerId`) REFERENCES `DeliveryPartner`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
