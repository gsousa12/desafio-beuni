/*
  Warnings:

  - You are about to drop the column `tax_id` on the `employees` table. All the data in the column will be lost.
  - You are about to drop the column `tax_id` on the `organizations` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cpf]` on the table `employees` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[cnpj]` on the table `organizations` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cpf` to the `employees` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cnpj` to the `organizations` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "employees_tax_id_key";

-- DropIndex
DROP INDEX "organizations_tax_id_key";

-- AlterTable
ALTER TABLE "employees" DROP COLUMN "tax_id",
ADD COLUMN     "cpf" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "organizations" DROP COLUMN "tax_id",
ADD COLUMN     "cnpj" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "employees_cpf_key" ON "employees"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "organizations_cnpj_key" ON "organizations"("cnpj");
