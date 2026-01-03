-- This migration fixes the waitlist_applications table by ensuring columns are properly nullable
-- before adding NOT NULL constraints

-- Step 1: Check if columns already exist with NOT NULL - if so, we need to handle them
-- First, drop the NOT NULL constraints if they exist
ALTER TABLE "waitlist_applications" ALTER COLUMN "first_name" DROP NOT NULL;
ALTER TABLE "waitlist_applications" ALTER COLUMN "last_name" DROP NOT NULL;
ALTER TABLE "waitlist_applications" ALTER COLUMN "city" DROP NOT NULL;
ALTER TABLE "waitlist_applications" ALTER COLUMN "province_state" DROP NOT NULL;
ALTER TABLE "waitlist_applications" ALTER COLUMN "country" DROP NOT NULL;

-- Step 2: Update all null values to 'Unknown'
UPDATE "waitlist_applications" SET "first_name" = 'Unknown' WHERE "first_name" IS NULL;
UPDATE "waitlist_applications" SET "last_name" = 'Unknown' WHERE "last_name" IS NULL;
UPDATE "waitlist_applications" SET "city" = 'Unknown' WHERE "city" IS NULL;
UPDATE "waitlist_applications" SET "province_state" = 'Unknown' WHERE "province_state" IS NULL;
UPDATE "waitlist_applications" SET "country" = 'Unknown' WHERE "country" IS NULL;

-- Step 3: Re-add the NOT NULL constraints
ALTER TABLE "waitlist_applications" ALTER COLUMN "first_name" SET NOT NULL;
ALTER TABLE "waitlist_applications" ALTER COLUMN "last_name" SET NOT NULL;
ALTER TABLE "waitlist_applications" ALTER COLUMN "city" SET NOT NULL;
ALTER TABLE "waitlist_applications" ALTER COLUMN "province_state" SET NOT NULL;
ALTER TABLE "waitlist_applications" ALTER COLUMN "country" SET NOT NULL;
