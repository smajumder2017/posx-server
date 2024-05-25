-- AlterTable
ALTER TABLE `MenuItems` MODIFY `waitingTime` INTEGER NULL,
    MODIFY `servingTime` JSON NULL,
    MODIFY `itemImageUrl` VARCHAR(191) NULL,
    MODIFY `remoteImageId` VARCHAR(191) NULL;
