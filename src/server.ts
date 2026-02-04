import cors from "cors";
import express, { type Express, type Request, type Response } from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import swaggerUi from "swagger-ui-express";

import { logger } from "./logger";
import { requestLogger } from "./middleware/request-logger";
import { swaggerSpec } from "./swagger";

const app: Express = express();

app.set("trust proxy", true);

app.use(
	helmet({
		contentSecurityPolicy: {
			directives: {
				defaultSrc: ["'self'"],
				styleSrc: ["'self'", "'unsafe-inline'"],
				scriptSrc: ["'self'", "'unsafe-inline'"],
				imgSrc: ["'self'", "data:", "https:"],
			},
		},
		crossOriginEmbedderPolicy: false,
	}),
);

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 100,
	standardHeaders: true,
	legacyHeaders: false,
	message: { error: "Too many requests, please try again later" },
	skip: (req) => req.path === "/health-check",
});
app.use(limiter);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

const corsOriginEnv = process.env.CORS_ORIGIN;
if (!corsOriginEnv) {
	logger.warn(
		"CORS_ORIGIN not set - defaulting to restrictive mode (no cross-origin requests allowed)",
	);
}
const corsOrigins = corsOriginEnv
	? corsOriginEnv.split(",").map((o) => o.trim())
	: [];

app.use(
	cors({
		origin: (origin, callback) => {
			if (!origin) {
				callback(null, true);
				return;
			}
			if (corsOrigins.length === 0) {
				callback(new Error("CORS not configured"));
				return;
			}
			if (corsOrigins.includes("*") || corsOrigins.includes(origin)) {
				callback(null, true);
				return;
			}
			callback(new Error("Not allowed by CORS"));
		},
		credentials: true,
		methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization"],
		maxAge: 86400,
	}),
);

app.use(requestLogger);

app.use("/api", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/health-check", (_req: Request, res: Response) => {
	res.json({ status: "ok" });
});

export { app, logger };
