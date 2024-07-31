CREATE TABLE IF NOT EXISTS "theme_item" (
	"id" serial PRIMARY KEY NOT NULL,
	"theme_id" integer NOT NULL,
	"name" text,
	"image" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "theme" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"max_ranking" integer NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "theme_item" ADD CONSTRAINT "theme_item_theme_id_theme_id_fk" FOREIGN KEY ("theme_id") REFERENCES "public"."theme"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
