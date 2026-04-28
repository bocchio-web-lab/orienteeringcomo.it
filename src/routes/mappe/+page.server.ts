import { pool } from "$lib/server/db";
import type { Map } from "$lib/types";
import type { RowDataPacket } from "mysql2";
import type { PageServerLoad } from "./$types";

type MapRow = RowDataPacket & Map;

const handleNullNumber = (v: unknown): number | null =>
    v !== null && v !== undefined ? Number(v) : null;

const handleNullDate = (v: unknown): Date | null =>
    v == null ? null : v instanceof Date ? v : new Date(v as string);

export const load: PageServerLoad = async () => {
    try {
        const [rows] = await pool.query<MapRow[]>(
            "SELECT id, name, `type`, scale, contours, latitude, longitude, location, created, `updated`, mapper, notes, image FROM maps ORDER BY name ASC",
        );

        const maps: Map[] = rows.map((row) => ({
            id: row.id,
            name: row.name,
            type: row.type,
            scale: Number(row.scale),
            contours: handleNullNumber(row.contours),
            latitude: Number(row.latitude),
            longitude: Number(row.longitude),
            location: row.location,
            created: handleNullDate(row.created),
            updated: handleNullDate(row.updated),
            mapper: row.mapper,
            notes: row.notes,
            image: row.image ?? null,
        }));

        return {
            maps,
            dbError: null,
        };
    } catch (error) {
        console.error("Failed to load maps from database", error);

        return {
            maps: [],
            dbError: "Errore nel recupero dati dal database.",
        };
    }
};
