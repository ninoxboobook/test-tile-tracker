-- CreateEnum
CREATE TYPE "enum_TestSeries_status" AS ENUM ('planned', 'in-progress', 'completed', 'archived');

-- CreateEnum
CREATE TYPE "enum_ClayBodies_type" AS ENUM ('commercial', 'studio', 'reclaim');

-- CreateEnum
CREATE TYPE "enum_Decorations_category" AS ENUM ('commercial', 'studio', 'formula');

-- CreateEnum
CREATE TYPE "enum_Decorations_type" AS ENUM ('glaze', 'slip', 'underglaze', 'oxide', 'engobe');

-- CreateTable
CREATE TABLE "Users" (
    "id" UUID NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "lastAutoId" VARCHAR(255) DEFAULT '0A',
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestSeries" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "userId" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "variables" JSONB,
    "goal" TEXT,
    "status" "enum_TestSeries_status" NOT NULL DEFAULT 'planned',
    "conclusions" TEXT,

    CONSTRAINT "TestSeries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClayBodies" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "type" "enum_ClayBodies_type" NOT NULL DEFAULT 'studio',
    "description" TEXT,
    "coneRange" VARCHAR(255),
    "userId" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "manufacturer" VARCHAR(255),
    "composition" JSONB,
    "firingTemperature" VARCHAR(255),
    "cone" VARCHAR(255),
    "color" VARCHAR(255),
    "shrinkage" DOUBLE PRECISION,
    "absorption" DOUBLE PRECISION,
    "plasticity" VARCHAR(255),
    "texture" VARCHAR(255),

    CONSTRAINT "ClayBodies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Decorations" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "type" VARCHAR(255),
    "userId" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "category" "enum_Decorations_category" NOT NULL DEFAULT 'studio',
    "recipe" JSONB,
    "glazyUrl" VARCHAR(255),
    "firingTemperature" VARCHAR(255),
    "manufacturer" VARCHAR(255),
    "cone" VARCHAR(255),
    "applicationMethod" VARCHAR(255),
    "color" VARCHAR(255),
    "surface" VARCHAR(255),
    "transparency" VARCHAR(255),

    CONSTRAINT "Decorations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestTiles" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "userId" UUID NOT NULL,
    "testSeriesId" UUID,
    "clayBodyId" UUID,
    "decorationId" UUID,
    "description" TEXT,
    "firingTemperature" VARCHAR(255),
    "cone" VARCHAR(255),
    "firingSchedule" JSONB,
    "imageUrl" VARCHAR(255),
    "notes" TEXT,
    "results" JSONB,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "TestTiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "sid" VARCHAR NOT NULL,
    "sess" JSON NOT NULL,
    "expire" TIMESTAMP(6) NOT NULL
);

-- CreateTable
CREATE TABLE "user_sessions" (
    "sid" VARCHAR NOT NULL,
    "sess" JSON NOT NULL,
    "expire" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "user_sessions_pkey" PRIMARY KEY ("sid")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Users_username_key" ON "Users"("username");

-- CreateIndex
CREATE INDEX "clay_bodies_user_id_type" ON "ClayBodies"("userId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "clay_bodies_user_id_name" ON "ClayBodies"("userId", "name");

-- CreateIndex
CREATE INDEX "decorations_user_id_type" ON "Decorations"("userId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "decorations_user_id_name" ON "Decorations"("userId", "name");

-- CreateIndex
CREATE INDEX "idx_user_sessions_expire" ON "user_sessions"("expire");

-- AddForeignKey
ALTER TABLE "TestSeries" ADD CONSTRAINT "TestSeries_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ClayBodies" ADD CONSTRAINT "ClayBodies_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Decorations" ADD CONSTRAINT "Decorations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "TestTiles" ADD CONSTRAINT "TestTiles_clayBodyId_fkey" FOREIGN KEY ("clayBodyId") REFERENCES "ClayBodies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "TestTiles" ADD CONSTRAINT "TestTiles_decorationId_fkey" FOREIGN KEY ("decorationId") REFERENCES "Decorations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "TestTiles" ADD CONSTRAINT "TestTiles_testSeriesId_fkey" FOREIGN KEY ("testSeriesId") REFERENCES "TestSeries"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "TestTiles" ADD CONSTRAINT "TestTiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
