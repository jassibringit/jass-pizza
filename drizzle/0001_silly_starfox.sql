ALTER TABLE "inquiries" ADD COLUMN "created_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "inquiries" ADD COLUMN "status" text DEFAULT 'new' NOT NULL;--> statement-breakpoint
ALTER TABLE "inquiries" ADD COLUMN "event_type" text NOT NULL;--> statement-breakpoint
ALTER TABLE "inquiries" ADD COLUMN "event_date" date NOT NULL;--> statement-breakpoint
ALTER TABLE "inquiries" ADD COLUMN "guests" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "inquiries" ADD COLUMN "city" text NOT NULL;--> statement-breakpoint
ALTER TABLE "inquiries" ADD COLUMN "email" text NOT NULL;--> statement-breakpoint
ALTER TABLE "inquiries" ADD COLUMN "phone" text;--> statement-breakpoint
ALTER TABLE "inquiries" ADD COLUMN "message" text;