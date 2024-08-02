/*
  Warnings:

  - You are about to alter the column `serviceChargePercentage` on the `Shop` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.

*/
-- AlterTable
ALTER TABLE `Shop` MODIFY `serviceChargePercentage` DOUBLE NULL;
