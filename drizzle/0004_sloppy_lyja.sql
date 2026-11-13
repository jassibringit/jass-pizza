ALTER TABLE "inquiries" ALTER COLUMN "event_date" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "inquiries" ADD COLUMN "service_style" text;