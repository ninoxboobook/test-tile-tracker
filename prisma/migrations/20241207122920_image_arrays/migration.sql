/*
  Warnings:

  - The `imageUrl` column on the `clay_bodies` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `imageUrl` column on the `decorations` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `imageUrl` column on the `test_tiles` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "clay_bodies" DROP COLUMN "imageUrl",
ADD COLUMN     "imageUrl" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "decorations" DROP COLUMN "imageUrl",
ADD COLUMN     "imageUrl" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "test_tiles" DROP COLUMN "imageUrl",
ADD COLUMN     "imageUrl" TEXT[] DEFAULT ARRAY[]::TEXT[];
