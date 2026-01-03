CREATE TYPE "public"."waitlist_status" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
CREATE TABLE "waitlist_applications" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"age" integer NOT NULL,
	"location" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"looking_for" text NOT NULL,
	"additional_info" text,
	"status" "waitlist_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "waitlist_applications_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE INDEX "idx_waitlist_email" ON "waitlist_applications" USING btree ("email");--> statement-breakpoint
CREATE INDEX "idx_waitlist_status" ON "waitlist_applications" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_waitlist_created" ON "waitlist_applications" USING btree ("created_at");