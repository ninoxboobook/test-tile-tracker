/*
  Warnings:

  - You are about to drop the column `type` on the `decorations` table. All the data in the column will be lost.
  - You are about to drop the `_AtmosphereToTestTile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ClayBodyToClayBodyType` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ConeToTestTile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_DecorationToDecorationCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `decoration_categories` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `typeId` to the `clay_bodies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `typeId` to the `decorations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `atmosphereId` to the `test_tiles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `coneId` to the `test_tiles` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_AtmosphereToTestTile" DROP CONSTRAINT "_AtmosphereToTestTile_A_fkey";

-- DropForeignKey
ALTER TABLE "_AtmosphereToTestTile" DROP CONSTRAINT "_AtmosphereToTestTile_B_fkey";

-- DropForeignKey
ALTER TABLE "_ClayBodyToClayBodyType" DROP CONSTRAINT "_ClayBodyToClayBodyType_A_fkey";

-- DropForeignKey
ALTER TABLE "_ClayBodyToClayBodyType" DROP CONSTRAINT "_ClayBodyToClayBodyType_B_fkey";

-- DropForeignKey
ALTER TABLE "_ConeToTestTile" DROP CONSTRAINT "_ConeToTestTile_A_fkey";

-- DropForeignKey
ALTER TABLE "_ConeToTestTile" DROP CONSTRAINT "_ConeToTestTile_B_fkey";

-- DropForeignKey
ALTER TABLE "_DecorationToDecorationCategory" DROP CONSTRAINT "_DecorationToDecorationCategory_A_fkey";

-- DropForeignKey
ALTER TABLE "_DecorationToDecorationCategory" DROP CONSTRAINT "_DecorationToDecorationCategory_B_fkey";

-- AlterTable
ALTER TABLE "clay_bodies" ADD COLUMN     "typeId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "decorations" DROP COLUMN "type",
ADD COLUMN     "source" VARCHAR(255),
ADD COLUMN     "typeId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "test_tiles" ADD COLUMN     "atmosphereId" UUID NOT NULL,
ADD COLUMN     "coneId" UUID NOT NULL;

-- DropTable
DROP TABLE "_AtmosphereToTestTile";

-- DropTable
DROP TABLE "_ClayBodyToClayBodyType";

-- DropTable
DROP TABLE "_ConeToTestTile";

-- DropTable
DROP TABLE "_DecorationToDecorationCategory";

-- DropTable
DROP TABLE "decoration_categories";

-- CreateTable
CREATE TABLE "decoration_types" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "decoration_types_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "decoration_types_name_key" ON "decoration_types"("name");

-- AddForeignKey
ALTER TABLE "clay_bodies" ADD CONSTRAINT "clay_bodies_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "clay_body_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "decorations" ADD CONSTRAINT "decorations_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "decoration_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "test_tiles" ADD CONSTRAINT "test_tiles_coneId_fkey" FOREIGN KEY ("coneId") REFERENCES "cones"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "test_tiles" ADD CONSTRAINT "test_tiles_atmosphereId_fkey" FOREIGN KEY ("atmosphereId") REFERENCES "atmospheres"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
