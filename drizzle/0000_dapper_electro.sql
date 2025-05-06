CREATE TABLE `sources` (
	`sourceId` text PRIMARY KEY DEFAULT '7ailwty0' NOT NULL,
	`destinations` text NOT NULL,
	`payloadsForwarded` integer DEFAULT 0 NOT NULL
);
