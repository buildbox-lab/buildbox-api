import { logger } from "./logger";

interface Config {
	port: number;
	host: string;
	nodeEnv: string;
	corsOrigins: string[];
	databaseUrl: string | undefined;
}

function validateEnv(): Config {
	const warnings: string[] = [];

	const port = Number(process.env.PORT) || 8000;
	const host = process.env.HOST || "localhost";
	const nodeEnv = process.env.NODE_ENV || "development";
	const corsOrigin = process.env.CORS_ORIGIN;
	const databaseUrl = process.env.DATABASE_URL;

	if (!corsOrigin && nodeEnv === "production") {
		warnings.push(
			"CORS_ORIGIN not set in production - API will reject cross-origin requests",
		);
	}

	if (!databaseUrl) {
		warnings.push("DATABASE_URL not set - database features will be disabled");
	}

	const corsOrigins = corsOrigin
		? corsOrigin.split(",").map((o) => o.trim())
		: [];

	if (corsOrigins.includes("*") && nodeEnv === "production") {
		warnings.push(
			"CORS_ORIGIN contains wildcard (*) in production - this is insecure",
		);
	}

	for (const warning of warnings) {
		logger.warn(warning);
	}

	return {
		port,
		host,
		nodeEnv,
		corsOrigins,
		databaseUrl,
	};
}

export { validateEnv, type Config };
