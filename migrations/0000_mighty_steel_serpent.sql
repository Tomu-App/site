CREATE TABLE `subscribers` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`status` text NOT NULL,
	`consent_version` text NOT NULL,
	`created_at` integer NOT NULL,
	`confirmed_at` integer,
	`mail_window_start` integer,
	`mail_window_count` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `subscribers_email_unique` ON `subscribers` (`email`);