-- Drop the clay_bodies table
DROP TABLE IF EXISTS "clay_bodies";

-- Remove the clay_bodies relation from Users model
ALTER TABLE "Users" DROP COLUMN IF EXISTS "clay_bodies";
