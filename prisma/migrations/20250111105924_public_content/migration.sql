-- AlterTable
ALTER TABLE "clay_bodies" ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "collections" ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "decorations" ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "test_tiles" ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT false;
