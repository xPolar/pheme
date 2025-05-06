// This ensures context.env.DB is correctly typed
export type Bindings = {
	DB: D1Database;
};

export interface Schedule {
	name: string;
	cron: string;
	handler: (args: {
		event: ScheduledController;
		environment: Bindings;
		context: ExecutionContext;
	}) => Promise<unknown>;
}
