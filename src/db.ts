import pg from "pg";
import { logger } from "./logger";

function createPool(): pg.Pool {
	const connectionString = process.env.DATABASE_URL;

	if (!connectionString) {
		logger.warn("DATABASE_URL not set - database features disabled");
		return new pg.Pool();
	}

	const sslConfig = connectionString.includes("sslmode=require")
		? {
				rejectUnauthorized: process.env.NODE_ENV === "production",
			}
		: undefined;

	return new pg.Pool({
		connectionString,
		ssl: sslConfig,
		max: 20,
		idleTimeoutMillis: 30000,
		connectionTimeoutMillis: 10000,
	});
}

const pool = createPool();

async function initialize(): Promise<void> {
	if (!process.env.DATABASE_URL) {
		logger.info("Skipping database initialization - DATABASE_URL not set");
		return;
	}

	const connected = await checkConnection();
	if (connected) {
		logger.info("Database connected");
	} else {
		logger.warn("Database not reachable");
	}
}

async function checkConnection(): Promise<boolean> {
	try {
		await pool.query("SELECT 1");
		return true;
	} catch {
		return false;
	}
}

async function close(): Promise<void> {
	await pool.end();
	logger.info("Database pool closed");
}

export { pool, initialize, checkConnection, close };
