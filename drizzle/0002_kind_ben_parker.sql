ALTER TABLE "inquiries" ALTER COLUMN "email" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "inquiries" ADD COLUMN "source" text DEFAULT 'website' NOT NULL;--> statement-breakpoint
ALTER TABLE "inquiries" ADD COLUMN "handle" text;