ALTER TABLE "inquiries" ADD COLUMN "estimate_low" integer;--> statement-breakpoint
ALTER TABLE "inquiries" ADD COLUMN "estimate_high" integer;--> statement-breakpoint
ALTER TABLE "inquiries" ADD COLUMN "pizzas" integer;--> statement-breakpoint
ALTER TABLE "inquiries" ADD COLUMN "dough_balls" integer;--> statement-breakpoint
ALTER TABLE "inquiries" ADD COLUMN "helpers" integer;--> statement-breakpoint
-- Data: the "appetizer" service style was renamed to "snack".
UPDATE "inquiries" SET "service_style" = 'snack' WHERE "service_style" = 'appetizer';
