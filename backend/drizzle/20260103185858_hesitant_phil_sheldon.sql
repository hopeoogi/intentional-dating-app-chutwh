-- Safe migration to add waitlist fields
-- This migration handles the conversion from old schema to new schema

-- Step 1: Drop old columns if they exist
ALTER TABLE "waitlist_applications" DROP COLUMN IF EXISTS "name";
ALTER TABLE "waitlist_applications" DROP COLUMN IF EXISTS "location";

-- Step 2: Add the new columns if they don't exist
-- Using simple ALTER TABLE statements with IF NOT EXISTS check via DO block
DO $$ BEGIN
  IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name='waitlist_applications' AND column_name='first_name') THEN
    ALTER TABLE "waitlist_applications" ADD COLUMN "first_name" text;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name='waitlist_applications' AND column_name='last_name') THEN
    ALTER TABLE "waitlist_applications" ADD COLUMN "last_name" text;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name='waitlist_applications' AND column_name='city') THEN
    ALTER TABLE "waitlist_applications" ADD COLUMN "city" text;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name='waitlist_applications' AND column_name='province_state') THEN
    ALTER TABLE "waitlist_applications" ADD COLUMN "province_state" text;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name='waitlist_applications' AND column_name='country') THEN
    ALTER TABLE "waitlist_applications" ADD COLUMN "country" text;
  END IF;
END $$;

-- Step 3: Populate null values with defaults
UPDATE "waitlist_applications" SET "first_name" = 'Unknown' WHERE "first_name" IS NULL;
UPDATE "waitlist_applications" SET "last_name" = 'Unknown' WHERE "last_name" IS NULL;
UPDATE "waitlist_applications" SET "city" = 'Unknown' WHERE "city" IS NULL;
UPDATE "waitlist_applications" SET "province_state" = 'Unknown' WHERE "province_state" IS NULL;
UPDATE "waitlist_applications" SET "country" = 'Unknown' WHERE "country" IS NULL;

-- Step 4: Add NOT NULL constraints
DO $$ BEGIN
  ALTER TABLE "waitlist_applications" ALTER COLUMN "first_name" SET NOT NULL;
EXCEPTION WHEN OTHERS THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "waitlist_applications" ALTER COLUMN "last_name" SET NOT NULL;
EXCEPTION WHEN OTHERS THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "waitlist_applications" ALTER COLUMN "city" SET NOT NULL;
EXCEPTION WHEN OTHERS THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "waitlist_applications" ALTER COLUMN "province_state" SET NOT NULL;
EXCEPTION WHEN OTHERS THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "waitlist_applications" ALTER COLUMN "country" SET NOT NULL;
EXCEPTION WHEN OTHERS THEN NULL; END $$;
