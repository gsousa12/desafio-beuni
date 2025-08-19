/*
  Warnings:

  - You are about to drop the column `name` on the `organizations` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[legal_name]` on the table `organizations` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `legal_name` to the `organizations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `trading_name` to the `organizations` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "organizations_name_key";

-- AlterTable
ALTER TABLE "organizations" DROP COLUMN "name",
ADD COLUMN     "legal_name" TEXT NOT NULL,
ADD COLUMN     "trading_name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "organizations_legal_name_key" ON "organizations"("legal_name");
