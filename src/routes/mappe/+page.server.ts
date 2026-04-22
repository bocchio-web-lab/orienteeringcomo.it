import { pool } from "$lib/server/db";
import type { Map } from "$lib/types";
import type { RowDataPacket } from "mysql2";
import type { PageServerLoad } from "./$types";

type MapRow = RowDataPacket & Map;

export const load: PageServerLoad = async () => {
    try {
        const [rows] = await pool.query<MapRow[]>(
            "SELECT id, name, `type`, scale, contours, latitude, longitude, location, `updated`, mapper, code, `standard`, image, `file` FROM maps ORDER BY name ASC",
        );

        const maps: Map[] = rows.map((row) => ({
            id: row.id,
            name: row.name,
            type: row.type,
            scale: Number(row.scale),
            contours: Number(row.contours),
            latitude: Number(row.latitude),
            longitude: Number(row.longitude),
            location: row.location,
            updated: row.updated
                ? row.updated instanceof Date
                    ? row.updated
                    : new Date(row.updated)
                : null,
            mapper: row.mapper,
            code: row.code,
            standard: row.standard,
            image: row.image,
            file: row.file,
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