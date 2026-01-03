-- Add new location fields to waitlist_applications table
-- This migration drops the old 'name' and 'location' columns and adds the new fields

-- Step 1: Drop the old name and location columns if they exist
ALTER TABLE "waitlist_applications" DROP COLUMN IF EXISTS "name";
ALTER TABLE "waitlist_applications" DROP COLUMN IF EXISTS "location";

-- Step 2: Add the new columns if they don't exist (with nullable type initially)
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name='waitlist_applications' AND column_name='first_name') THEN
    ALTER TABLE "waitlist_applications" ADD COLUMN "first_name" text;
  END IF;
  IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name='waitlist_applications' AND column_name='last_name') THEN
    ALTER TABLE "waitlist_applications" ADD COLUMN "last_name" text;
  END IF;
  IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name='waitlist_applications' AND column_name='city') THEN
    ALTER TABLE "waitlist_applications" ADD COLUMN "city" text;
  END IF;
  IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name='waitlist_applications' AND column_name='province_state') THEN
    ALTER TABLE "waitlist_applications" ADD COLUMN "province_state" text;
  END IF;
  IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name='waitlist_applications' AND column_name='country') THEN
    ALTER TABLE "waitlist_applications" ADD COLUMN "country" text;
  END IF;
END $$;

-- Step 3: Update all existing null values to 'Unknown'
UPDATE "waitlist_applications" SET "first_name" = 'Unknown' WHERE "first_name" IS NULL;
UPDATE "waitlist_applications" SET "last_name" = 'Unknown' WHERE "last_name" IS NULL;
UPDATE "waitlist_applications" SET "city" = 'Unknown' WHERE "city" IS NULL;
UPDATE "waitlist_applications" SET "province_state" = 'Unknown' WHERE "province_state" IS NULL;
UPDATE "waitlist_applications" SET "country" = 'Unknown' WHERE "country" IS NULL;
