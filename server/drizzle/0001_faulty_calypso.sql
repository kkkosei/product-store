CREATE TABLE "pomodoro_settings" (
	"user_id" text PRIMARY KEY NOT NULL,
	"work_sec" integer DEFAULT 1500 NOT NULL,
	"break_sec" integer DEFAULT 300 NOT NULL,
	"long_break_sec" integer DEFAULT 900 NOT NULL,
	"long_break_every" integer DEFAULT 5 NOT NULL,
	"auto_start_next" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pomodoro_state" (
	"user_id" text PRIMARY KEY NOT NULL,
	"phase" text DEFAULT 'work' NOT NULL,
	"status" text DEFAULT 'idle' NOT NULL,
	"task_id" uuid,
	"started_at" timestamp,
	"ends_at" timestamp,
	"cycle_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "pomodoro_settings" ADD CONSTRAINT "pomodoro_settings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pomodoro_state" ADD CONSTRAINT "pomodoro_state_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pomodoro_state" ADD CONSTRAINT "pomodoro_state_task_id_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."tasks"("id") ON DELETE set null ON UPDATE no action;