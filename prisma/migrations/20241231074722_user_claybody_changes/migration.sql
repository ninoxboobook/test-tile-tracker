/*
  Warnings:

  - You are about to drop the column `firingTemperature` on the `clay_bodies` table. All the data in the column will be lost.
  - You are about to drop the column `shrinkage` on the `clay_bodies` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');

-- AlterTable
ALTER TABLE "clay_bodies" 
RENAME COLUMN "firingTemperature" TO "firingRange";

ALTER TABLE "clay_bodies" 
RENAME COLUMN "shrinkage" TO "shrinkageWetToDry";

ALTER TABLE "clay_bodies" 
ADD COLUMN "bisqueTemperature" VARCHAR(255),
ADD COLUMN "shrinkageWetToBisque" REAL,
ADD COLUMN "shrinkageWetToFired" REAL,
ADD COLUMN "vitreousTemperature" VARCHAR(255);

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';

-- CreateTable
CREATE TABLE "_UserFollows" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserFollows_AB_unique" ON "_UserFollows"("A", "B");

-- CreateIndex
CREATE INDEX "_UserFollows_B_index" ON "_UserFollows"("B");

-- AddForeignKey
ALTER TABLE "_UserFollows" ADD CONSTRAINT "_UserFollows_A_fkey" FOREIGN KEY ("A") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserFollows" ADD CONSTRAINT "_UserFollows_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
