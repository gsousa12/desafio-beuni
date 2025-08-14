/*
  Warnings:

  - Added the required column `birth_date_day` to the `employees` table without a default value. This is not possible if the table is not empty.
  - Added the required column `birth_date_month` to the `employees` table without a default value. This is not possible if the table is not empty.
  - Added the required column `birth_date_year` to the `employees` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "employees" ADD COLUMN     "birth_date_day" TEXT NOT NULL,
ADD COLUMN     "birth_date_month" TEXT NOT NULL,
ADD COLUMN     "birth_date_year" TEXT NOT NULL;
