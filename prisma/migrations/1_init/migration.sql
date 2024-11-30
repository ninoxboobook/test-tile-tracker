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
    "type" VARCHAR(255) NOT NULL,
    "manufacturer" VARCHAR(255),
    "cone" VARCHAR(255),
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
    "type" VARCHAR(255) NOT NULL,
    "manufacturer" VARCHAR(255),
    "cone" VARCHAR(255),
    "atmosphere" VARCHAR(255),
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
CREATE TABLE "_CollectionToTestTile" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "_DecorationToTestTile" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE INDEX "clay_bodies_user_id_type" ON "clay_bodies"("userId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "clay_bodies_user_id_name" ON "clay_bodies"("userId", "name");

-- CreateIndex
CREATE INDEX "decorations_user_id_type" ON "decorations"("userId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "decorations_user_id_name" ON "decorations"("userId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "user_sessions_token_key" ON "user_sessions"("token");

-- CreateIndex
CREATE UNIQUE INDEX "_CollectionToTestTile_AB_unique" ON "_CollectionToTestTile"("A", "B");

-- CreateIndex
CREATE INDEX "_CollectionToTestTile_B_index" ON "_CollectionToTestTile"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_DecorationToTestTile_AB_unique" ON "_DecorationToTestTile"("A", "B");

-- CreateIndex
CREATE INDEX "_DecorationToTestTile_B_index" ON "_DecorationToTestTile"("B");

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
ALTER TABLE "_CollectionToTestTile" ADD CONSTRAINT "_CollectionToTestTile_A_fkey" FOREIGN KEY ("A") REFERENCES "collections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CollectionToTestTile" ADD CONSTRAINT "_CollectionToTestTile_B_fkey" FOREIGN KEY ("B") REFERENCES "test_tiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DecorationToTestTile" ADD CONSTRAINT "_DecorationToTestTile_A_fkey" FOREIGN KEY ("A") REFERENCES "decorations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DecorationToTestTile" ADD CONSTRAINT "_DecorationToTestTile_B_fkey" FOREIGN KEY ("B") REFERENCES "test_tiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

