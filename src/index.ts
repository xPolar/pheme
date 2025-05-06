import { Hono } from "hono";
import { cors } from "hono/cors";
import * as schema from "./db/schema";
import { eq, sql } from "drizzle-orm";
import handleSchedule from "./schedules";
import type { Bindings } from "../typings";
import extendedDrizzle from "./lib/utils/extendedDrizzle";

const app = new Hono<{ Bindings: Bindings }>();

app.use(
	"/",
	cors({
		origin: "*",
		allowMethods: ["POST", "GET", "OPTIONS"],
	}),
);

app.all("/forward", async (context) => {
	const { token } = context.req.query();

	if (!token) return context.json({ error: "Missing token" }, 400);

	const db = extendedDrizzle(context.env.DB);

	const source = await db.query.sourcesTable.findFirst({
		where: eq(schema.sourcesTable.sourceId, token.toLowerCase()),
	});

	if (!source) return context.json({ error: "Invalid token" }, 400);

	const { destinations } = source;

	// buffer the request body once so it can be reused for multiple destinations
	let bodyBuffer: ArrayBuffer | null = null;

	if (context.req.raw.body)
		try {
			// read and store the body as array buffer
			bodyBuffer = await context.req.raw.arrayBuffer();
		} catch (err) {
			console.error("Error reading request body:", err);

			return context.json({ error: "Failed to process request body" }, 500);
		}

	// for any destination that fails, collect the error so we can return it to the client
	const errors = await Promise.all(
		(
			(
				await Promise.all(
					destinations.map(async (destination) => {
						// create a new request for each destination with the buffered body
						const newRequest = new Request(destination, {
							method: context.req.raw.method,
							headers: context.req.raw.headers,
							body: bodyBuffer ? bodyBuffer.slice(0) : null,
						});

						return fetch(newRequest).catch((error) => {
							console.error(
								`Error forwarding to ${destination} for source ${token}: ${JSON.stringify(error, null, 4)}`,
							);
						});
					}),
				)
			).filter(Boolean) as Response[]
		)
			.filter((response) => !response.ok)
			.map(async (response) => ({
				destination: response.url,
				status: response.status,
				statusText: response.statusText,
				body: await response.text(),
			})),
	);

	await db
		.update(schema.sourcesTable)
		.set({
			payloadsForwarded: sql`${schema.sourcesTable.payloadsForwarded} + ${destinations.length - errors.length}`,
		})
		.where(eq(schema.sourcesTable.sourceId, token.toLowerCase()));

	return context.json({
		success: true,
		success_count: destinations.length - errors.length,
		error_count: errors.length,
		errors,
	});
});

export default {
	fetch: app.fetch,
	scheduled: async (event: ScheduledController, environment: Bindings, context: ExecutionContext) => {
		await handleSchedule(event, environment, context);
	},
};
