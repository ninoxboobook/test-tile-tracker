-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "firstName" VARCHAR(255),
    "lastName" VARCHAR(255),
    "imageUrl" VARCHAR(255),
    "lastAutoId" VARCHAR(255) DEFAULT '0A',
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "collections" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "userId" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "collections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clay_bodies" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "manufacturer" VARCHAR(255),
    "firingTemperature" VARCHAR(255),
    "texture" VARCHAR(255),
    "plasticity" VARCHAR(255),
    "colourOxidation" VARCHAR(255),
    "colourReduction" VARCHAR(255),
    "shrinkage" REAL,
    "absorption" REAL,
    "meshSize" INTEGER,
    "imageUrl" VARCHAR(255),
    "notes" TEXT,
    "userId" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "clay_bodies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "decorations" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "category" VARCHAR(255) NOT NULL,
    "manufacturer" VARCHAR(255),
    "colour" VARCHAR(255),
    "surface" VARCHAR(255),
    "transparency" VARCHAR(255),
    "glazyUrl" VARCHAR(255),
    "imageUrl" VARCHAR(255),
    "recipe" TEXT,
    "notes" TEXT,
    "userId" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "decorations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "test_tiles" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "stamp" VARCHAR(255),
    "notes" TEXT,
    "imageUrl" VARCHAR(255),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "userId" UUID NOT NULL,
    "clayBodyId" UUID NOT NULL,

    CONSTRAINT "test_tiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "decoration_layers" (
    "id" UUID NOT NULL,
    "order" INTEGER NOT NULL,
    "testTileId" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "decoration_layers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "sid" VARCHAR NOT NULL,
    "sess" JSON NOT NULL,
    "expire" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("sid")
);

-- CreateTable
CREATE TABLE "user_sessions" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cones" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "cones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "atmospheres" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "atmospheres_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "decoration_types" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "decoration_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clay_body_types" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "clay_body_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CollectionToTestTile" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "_ClayBodyToClayBodyType" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "_ClayBodyToCone" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "_DecorationToDecorationType" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "_DecorationToDecorationLayer" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "_ConeToDecoration" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "_ConeToTestTile" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "_AtmosphereToDecoration" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "_AtmosphereToTestTile" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "clay_bodies_user_id_name" ON "clay_bodies"("userId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "decorations_user_id_name" ON "decorations"("userId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "decoration_layers_testTileId_order_key" ON "decoration_layers"("testTileId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "user_sessions_token_key" ON "user_sessions"("token");

-- CreateIndex
CREATE UNIQUE INDEX "cones_name_key" ON "cones"("name");

-- CreateIndex
CREATE UNIQUE INDEX "atmospheres_name_key" ON "atmospheres"("name");

-- CreateIndex
CREATE UNIQUE INDEX "decoration_types_name_key" ON "decoration_types"("name");

-- CreateIndex
CREATE UNIQUE INDEX "clay_body_types_name_key" ON "clay_body_types"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_CollectionToTestTile_AB_unique" ON "_CollectionToTestTile"("A", "B");

-- CreateIndex
CREATE INDEX "_CollectionToTestTile_B_index" ON "_CollectionToTestTile"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ClayBodyToClayBodyType_AB_unique" ON "_ClayBodyToClayBodyType"("A", "B");

-- CreateIndex
CREATE INDEX "_ClayBodyToClayBodyType_B_index" ON "_ClayBodyToClayBodyType"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ClayBodyToCone_AB_unique" ON "_ClayBodyToCone"("A", "B");

-- CreateIndex
CREATE INDEX "_ClayBodyToCone_B_index" ON "_ClayBodyToCone"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_DecorationToDecorationType_AB_unique" ON "_DecorationToDecorationType"("A", "B");

-- CreateIndex
CREATE INDEX "_DecorationToDecorationType_B_index" ON "_DecorationToDecorationType"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_DecorationToDecorationLayer_AB_unique" ON "_DecorationToDecorationLayer"("A", "B");

-- CreateIndex
CREATE INDEX "_DecorationToDecorationLayer_B_index" ON "_DecorationToDecorationLayer"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ConeToDecoration_AB_unique" ON "_ConeToDecoration"("A", "B");

-- CreateIndex
CREATE INDEX "_ConeToDecoration_B_index" ON "_ConeToDecoration"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ConeToTestTile_AB_unique" ON "_ConeToTestTile"("A", "B");

-- CreateIndex
CREATE INDEX "_ConeToTestTile_B_index" ON "_ConeToTestTile"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_AtmosphereToDecoration_AB_unique" ON "_AtmosphereToDecoration"("A", "B");

-- CreateIndex
CREATE INDEX "_AtmosphereToDecoration_B_index" ON "_AtmosphereToDecoration"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_AtmosphereToTestTile_AB_unique" ON "_AtmosphereToTestTile"("A", "B");

-- CreateIndex
CREATE INDEX "_AtmosphereToTestTile_B_index" ON "_AtmosphereToTestTile"("B");

-- AddForeignKey
ALTER TABLE "collections" ADD CONSTRAINT "collections_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "clay_bodies" ADD CONSTRAINT "clay_bodies_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "decorations" ADD CONSTRAINT "decorations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "test_tiles" ADD CONSTRAINT "test_tiles_clayBodyId_fkey" FOREIGN KEY ("clayBodyId") REFERENCES "clay_bodies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "test_tiles" ADD CONSTRAINT "test_tiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "decoration_layers" ADD CONSTRAINT "decoration_layers_testTileId_fkey" FOREIGN KEY ("testTileId") REFERENCES "test_tiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CollectionToTestTile" ADD CONSTRAINT "_CollectionToTestTile_A_fkey" FOREIGN KEY ("A") REFERENCES "collections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CollectionToTestTile" ADD CONSTRAINT "_CollectionToTestTile_B_fkey" FOREIGN KEY ("B") REFERENCES "test_tiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClayBodyToClayBodyType" ADD CONSTRAINT "_ClayBodyToClayBodyType_A_fkey" FOREIGN KEY ("A") REFERENCES "clay_bodies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClayBodyToClayBodyType" ADD CONSTRAINT "_ClayBodyToClayBodyType_B_fkey" FOREIGN KEY ("B") REFERENCES "clay_body_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClayBodyToCone" ADD CONSTRAINT "_ClayBodyToCone_A_fkey" FOREIGN KEY ("A") REFERENCES "clay_bodies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClayBodyToCone" ADD CONSTRAINT "_ClayBodyToCone_B_fkey" FOREIGN KEY ("B") REFERENCES "cones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DecorationToDecorationType" ADD CONSTRAINT "_DecorationToDecorationType_A_fkey" FOREIGN KEY ("A") REFERENCES "decorations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DecorationToDecorationType" ADD CONSTRAINT "_DecorationToDecorationType_B_fkey" FOREIGN KEY ("B") REFERENCES "decoration_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DecorationToDecorationLayer" ADD CONSTRAINT "_DecorationToDecorationLayer_A_fkey" FOREIGN KEY ("A") REFERENCES "decorations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DecorationToDecorationLayer" ADD CONSTRAINT "_DecorationToDecorationLayer_B_fkey" FOREIGN KEY ("B") REFERENCES "decoration_layers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ConeToDecoration" ADD CONSTRAINT "_ConeToDecoration_A_fkey" FOREIGN KEY ("A") REFERENCES "cones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ConeToDecoration" ADD CONSTRAINT "_ConeToDecoration_B_fkey" FOREIGN KEY ("B") REFERENCES "decorations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ConeToTestTile" ADD CONSTRAINT "_ConeToTestTile_A_fkey" FOREIGN KEY ("A") REFERENCES "cones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ConeToTestTile" ADD CONSTRAINT "_ConeToTestTile_B_fkey" FOREIGN KEY ("B") REFERENCES "test_tiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AtmosphereToDecoration" ADD CONSTRAINT "_AtmosphereToDecoration_A_fkey" FOREIGN KEY ("A") REFERENCES "atmospheres"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AtmosphereToDecoration" ADD CONSTRAINT "_AtmosphereToDecoration_B_fkey" FOREIGN KEY ("B") REFERENCES "decorations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AtmosphereToTestTile" ADD CONSTRAINT "_AtmosphereToTestTile_A_fkey" FOREIGN KEY ("A") REFERENCES "atmospheres"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AtmosphereToTestTile" ADD CONSTRAINT "_AtmosphereToTestTile_B_fkey" FOREIGN KEY ("B") REFERENCES "test_tiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
