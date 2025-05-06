import type { Bindings, Schedule } from "../../typings";

const schedules: Schedule[] = [];

/**
 * Handles the scheduled event.
 * @param event The scheduled event
 * @param environment The environment bindings
 * @param context The execution context
 */
export default async function handleSchedule(
	event: ScheduledController,
	environment: Bindings,
	context: ExecutionContext,
) {
	const validSchedules = schedules.filter(({ cron }) => event.cron === cron);

	console.log(`Found ${validSchedules.length} valid schedules for cron ${event.cron}.`);

	return Promise.all(
		validSchedules.map(async (schedule) => {
			console.log(`Running schedule ${schedule.name} with cron ${schedule.cron}.`);

			return schedule.handler({ event, environment, context }).catch((error) => {
				console.error(`Error in task ${schedule.name}: ${JSON.stringify(error, null, 4)}`);
			});
		}),
	);
}
