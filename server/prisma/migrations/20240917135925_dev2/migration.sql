/*
  Warnings:

  - A unique constraint covering the columns `[data]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "User_data_key" ON "User"("data");
