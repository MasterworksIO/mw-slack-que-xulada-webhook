CREATE TABLE `acknowledgements` (
	`id` integer PRIMARY KEY NOT NULL,
	`from` text NOT NULL,
	`to` text NOT NULL,
	`channel` text NOT NULL,
	`text` text NOT NULL,
	`api_app_id` text NOT NULL,
	`event_context` text NOT NULL,
	`event_id` text NOT NULL,
	`event_time` integer NOT NULL,
	`team_id` text NOT NULL
);
