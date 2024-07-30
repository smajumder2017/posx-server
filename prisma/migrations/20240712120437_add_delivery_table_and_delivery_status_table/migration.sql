-- AlterTable
ALTER TABLE `Billing` ADD COLUMN `deliveryCharges` DOUBLE NULL DEFAULT 0,
    ADD COLUMN `packingCharges` DOUBLE NULL DEFAULT 0;

-- CreateTable
CREATE TABLE `DeliveryStatus` (
    `id` INTEGER NOT NULL,
    `value` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `DeliveryStatus_value_key`(`value`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Delivery` (
    `id` VARCHAR(191) NOT NULL,
    `shopId` VARCHAR(191) NOT NULL,
    `orderId` VARCHAR(191) NOT NULL,
    `employeeId` VARCHAR(191) NOT NULL,
    `customerName` VARCHAR(191) NOT NULL,
    `contactNo` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `latitude` VARCHAR(191) NOT NULL,
    `longitude` VARCHAR(191) NOT NULL,
    `deliveryStatusId` INTEGER NOT NULL,
    `isActive` BOOLEAN NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Delivery` ADD CONSTRAINT `Delivery_deliveryStatusId_fkey` FOREIGN KEY (`deliveryStatusId`) REFERENCES `DeliveryStatus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Delivery` ADD CONSTRAINT `Delivery_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
