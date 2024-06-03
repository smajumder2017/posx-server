/*
  Warnings:

  - A unique constraint covering the columns `[userId,roleId]` on the table `UserRoles` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `UserRoles` ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `UserShop` ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE UNIQUE INDEX `UserRoles_userId_roleId_key` ON `UserRoles`(`userId`, `roleId`);
