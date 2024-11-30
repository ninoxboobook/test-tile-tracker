DO $$ 
BEGIN

-- First create the new tables
CREATE TABLE "decoration_layers" (
    "id" UUID NOT NULL,
    "order" INTEGER NOT NULL,
    "testTileId" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    CONSTRAINT "decoration_layers_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "_DecorationToDecorationLayer" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- Create indexes
CREATE UNIQUE INDEX "decoration_layers_testTileId_order_key" ON "decoration_layers"("testTileId", "order");
CREATE UNIQUE INDEX "_DecorationToDecorationLayer_AB_unique" ON "_DecorationToDecorationLayer"("A", "B");
CREATE INDEX "_DecorationToDecorationLayer_B_index" ON "_DecorationToDecorationLayer"("B");

-- Add foreign key constraints
ALTER TABLE "decoration_layers" ADD CONSTRAINT "decoration_layers_testTileId_fkey" 
    FOREIGN KEY ("testTileId") REFERENCES "test_tiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_DecorationToDecorationLayer" ADD CONSTRAINT "_DecorationToDecorationLayer_A_fkey" 
    FOREIGN KEY ("A") REFERENCES "decorations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_DecorationToDecorationLayer" ADD CONSTRAINT "_DecorationToDecorationLayer_B_fkey" 
    FOREIGN KEY ("B") REFERENCES "decoration_layers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Migrate the data
WITH new_layers AS (
    INSERT INTO "decoration_layers" ("id", "order", "testTileId", "createdAt", "updatedAt")
    SELECT 
        gen_random_uuid(),
        1,
        "B" as "testTileId",
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    FROM "_DecorationToTestTile"
    GROUP BY "B"
    RETURNING id, "testTileId"
)
INSERT INTO "_DecorationToDecorationLayer" ("A", "B")
SELECT 
    dt."A",
    nl.id
FROM "_DecorationToTestTile" dt
JOIN new_layers nl ON nl."testTileId" = dt."B";

-- Drop the old relationship table and its constraints
ALTER TABLE IF EXISTS "_DecorationToTestTile" 
    DROP CONSTRAINT IF EXISTS "_DecorationToTestTile_A_fkey",
    DROP CONSTRAINT IF EXISTS "_DecorationToTestTile_B_fkey";

DROP TABLE IF EXISTS "_DecorationToTestTile";

END $$;
