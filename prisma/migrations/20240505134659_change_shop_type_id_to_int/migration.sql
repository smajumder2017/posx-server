/*
  Warnings:

  - You are about to alter the column `shopTypeId` on the `Shop` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `ShopType` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `ShopType` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- DropForeignKey
ALTER TABLE `Shop` DROP FOREIGN KEY `Shop_shopTypeId_fkey`;

-- AlterTable
ALTER TABLE `Shop` MODIFY `shopTypeId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `ShopType` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `Shop` ADD CONSTRAINT `Shop_shopTypeId_fkey` FOREIGN KEY (`shopTypeId`) REFERENCES `ShopType`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
