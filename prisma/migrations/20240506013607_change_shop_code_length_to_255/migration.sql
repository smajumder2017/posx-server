-- DropIndex
DROP INDEX `Shop_shopCode_key` ON `Shop`;

-- AlterTable
ALTER TABLE `Shop` MODIFY `shopCode` VARCHAR(255) NOT NULL;
