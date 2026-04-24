import { pool } from "$lib/server/db";
import type { Event } from "$lib/types";
import type { PageServerLoad } from "./$types";
import type { RowDataPacket } from "mysql2";

type EventRow = RowDataPacket & Event;

export const load: PageServerLoad = async () => {
	try {
		const [rows] = await pool.query<EventRow[]>(
			"SELECT name, date, location, description, image, type FROM events ORDER BY date DESC",
		);

		const sortedEvents: Event[] = rows.map((row) => ({
			name: row.name,
			date: row.date instanceof Date ? row.date : new Date(row.date),
			location: row.location,
			description: row.description,
			image: row.image,
			type: row.type,
		}));

		const now = Date.now();
		const futureEvents = sortedEvents.filter(
			(event) => event.date.getTime() >= now,
		);
		const pastEvents = sortedEvents.filter(
			(event) => event.date.getTime() < now,
		);

		return {
			eventGroups: {
				sortedEvents,
				futureEvents,
				pastEvents,
			},
			dbError: null,
		};
	} catch (error) {
		console.error(
			"[Error] Events:",
			error instanceof Error ? error.message : error,
		);

		return {
			eventGroups: {
				sortedEvents: [],
				futureEvents: [],
				pastEvents: [],
			},
			dbError: error instanceof Error ? error.message : error,
		};
	}
};
