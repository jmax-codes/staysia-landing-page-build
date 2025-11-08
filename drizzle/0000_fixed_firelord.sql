CREATE TABLE `properties` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`city` text NOT NULL,
	`area` text NOT NULL,
	`type` text NOT NULL,
	`price` integer NOT NULL,
	`nights` integer DEFAULT 2 NOT NULL,
	`rating` real NOT NULL,
	`image_url` text NOT NULL,
	`is_guest_favorite` integer DEFAULT false NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
