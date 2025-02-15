/*
  Warnings:

  - You are about to drop the column `teacherId` on the `Quiz` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Quiz" DROP CONSTRAINT "Quiz_teacherId_fkey";

-- AlterTable
ALTER TABLE "Quiz" DROP COLUMN "teacherId";
