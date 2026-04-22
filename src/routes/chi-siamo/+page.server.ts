import { pool } from "$lib/server/db";
import type { Member } from "$lib/types";
import type { PageServerLoad } from "./$types";
import type { RowDataPacket } from "mysql2";

type MemberRow = RowDataPacket & Member;

export const load: PageServerLoad = async () => {
    try {
        const [rows] = await pool.query<MemberRow[]>(
            "SELECT name, role, bio, image FROM members ORDER BY name ASC",
        );

        const members: Member[] = rows.map((row) => ({
            name: row.name,
            role: row.role,
            bio: row.bio,
            image: row.image,
        }));

        return {
            members,
            dbError: null,
        };
    } catch (error) {
        console.error("[Error] Members:", error instanceof Error ? error.message : error);

        return {
            members: [],
            dbError: error instanceof Error ? error.message : error,
        };
    }
};