-- Drop the invalid migration first by replacing it
-- This migration properly converts looking_for from text to jsonb

-- Step 1: Create a temporary jsonb column
ALTER TABLE "waitlist_applications" ADD COLUMN "looking_for_temp" jsonb;

-- Step 2: Convert existing text data to jsonb array
UPDATE "waitlist_applications"
SET "looking_for_temp" = jsonb_build_array("looking_for")
WHERE "looking_for" IS NOT NULL;

-- Step 3: Drop the old text column
ALTER TABLE "waitlist_applications" DROP COLUMN "looking_for";

-- Step 4: Rename the temporary column to the original name
ALTER TABLE "waitlist_applications" RENAME COLUMN "looking_for_temp" TO "looking_for";

-- Step 5: Add the NOT NULL constraint
ALTER TABLE "waitlist_applications" ALTER COLUMN "looking_for" SET NOT NULL;
