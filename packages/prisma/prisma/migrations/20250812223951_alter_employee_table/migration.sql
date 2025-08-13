/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `employees` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tax_id]` on the table `employees` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone]` on the table `employees` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `employees` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `employees` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `employees` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tax_id` to the `employees` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "employees" ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL,
ADD COLUMN     "tax_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "employees_email_key" ON "employees"("email");

-- CreateIndex
CREATE UNIQUE INDEX "employees_tax_id_key" ON "employees"("tax_id");

-- CreateIndex
CREATE UNIQUE INDEX "employees_phone_key" ON "employees"("phone");
