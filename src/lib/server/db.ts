import mysql from "mysql2/promise";
import { env } from "$env/dynamic/private";

export const pool = mysql.createPool({
	host: env.DB_HOST || "localhost",
	user: env.DB_USER || "root",
	password: env.DB_PASSWORD || "",
	database: env.DB_NAME || "orienteeringcomo",
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0,
});
