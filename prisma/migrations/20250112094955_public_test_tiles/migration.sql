-- AlterTable
ALTER TABLE "users" ADD COLUMN     "publicClayBodies" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "publicCollections" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "publicDecorations" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "publicTestTiles" BOOLEAN NOT NULL DEFAULT false;
