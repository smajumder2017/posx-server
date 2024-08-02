/*
  Warnings:

  - You are about to alter the column `cgstPercentage` on the `Shop` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to alter the column `sgstPercentage` on the `Shop` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.

*/
-- AlterTable
ALTER TABLE `Shop` MODIFY `cgstPercentage` DOUBLE NULL,
    MODIFY `sgstPercentage` DOUBLE NULL;
