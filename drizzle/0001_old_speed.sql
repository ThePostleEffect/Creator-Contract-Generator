CREATE TABLE `contractTemplates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`templateName` varchar(255) NOT NULL,
	`description` text,
	`formData` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `contractTemplates_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `signatureRequests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`contractId` varchar(64) NOT NULL,
	`contractTitle` varchar(255) NOT NULL,
	`contractText` text NOT NULL,
	`formData` text NOT NULL,
	`creatorSigned` int NOT NULL DEFAULT 0,
	`creatorSignatureUrl` text,
	`creatorSignedAt` timestamp,
	`counterpartySigned` int NOT NULL DEFAULT 0,
	`counterpartySignatureUrl` text,
	`counterpartySignedAt` timestamp,
	`status` enum('pending','partially_signed','fully_signed') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `signatureRequests_id` PRIMARY KEY(`id`),
	CONSTRAINT `signatureRequests_contractId_unique` UNIQUE(`contractId`)
);
--> statement-breakpoint
CREATE TABLE `userPreferences` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`logoUrl` text,
	`logoFileKey` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `userPreferences_id` PRIMARY KEY(`id`)
);
