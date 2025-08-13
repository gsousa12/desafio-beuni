/*
  Warnings:

  - You are about to drop the column `birthday_date` on the `employees` table. All the data in the column will be lost.
  - Added the required column `birth_date` to the `employees` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "employees" DROP COLUMN "birthday_date",
ADD COLUMN     "birth_date" DATE NOT NULL;
