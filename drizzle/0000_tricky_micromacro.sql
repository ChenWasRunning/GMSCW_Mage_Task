CREATE TABLE `progress` (
	`identifier_hash` text PRIMARY KEY NOT NULL,
	`completed` text NOT NULL,
	`revision` integer DEFAULT 1 NOT NULL,
	`updated_at` text NOT NULL
);
