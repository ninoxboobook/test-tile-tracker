/*
  Warnings:

  - You are about to drop the column `category` on the `decorations` table. All the data in the column will be lost.
  - You are about to drop the `_DecorationToDecorationType` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `decoration_types` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_DecorationToDecorationType" DROP CONSTRAINT "_DecorationToDecorationType_A_fkey";

-- DropForeignKey
ALTER TABLE "_DecorationToDecorationType" DROP CONSTRAINT "_DecorationToDecorationType_B_fkey";

-- AlterTable
ALTER TABLE "decorations" DROP COLUMN "category",
ADD COLUMN     "type" VARCHAR(255);

-- DropTable
DROP TABLE "_DecorationToDecorationType";

-- DropTable
DROP TABLE "decoration_types";

-- CreateTable
CREATE TABLE "decoration_categories" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "decoration_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_DecorationToDecorationCategory" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "decoration_categories_name_key" ON "decoration_categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_DecorationToDecorationCategory_AB_unique" ON "_DecorationToDecorationCategory"("A", "B");

-- CreateIndex
CREATE INDEX "_DecorationToDecorationCategory_B_index" ON "_DecorationToDecorationCategory"("B");

-- AddForeignKey
ALTER TABLE "_DecorationToDecorationCategory" ADD CONSTRAINT "_DecorationToDecorationCategory_A_fkey" FOREIGN KEY ("A") REFERENCES "decorations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DecorationToDecorationCategory" ADD CONSTRAINT "_DecorationToDecorationCategory_B_fkey" FOREIGN KEY ("B") REFERENCES "decoration_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
