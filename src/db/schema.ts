import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

/**
 * Generate a random alphanumeric string of a desired length.
 * @param length The length of the random string we want to generate.
 * @returns A random string of the specified length.
 */
const generateRandomString = (length: number): string => {
	const characters = "abcdefghijklmnopqrstuvwxyz0123456789";

	let result = "";

	for (let i = 0; i < length; i++) result += characters.charAt(Math.floor(Math.random() * characters.length));

	return result;
};

export const sourcesTable = sqliteTable("sources", {
	sourceId: text().primaryKey().notNull().default(generateRandomString(8).toLowerCase()),
	destinations: text({ mode: "json" }).$type<string[]>().notNull(),
	payloadsForwarded: integer().default(0).notNull(),
});
