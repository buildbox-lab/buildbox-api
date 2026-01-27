import cors from "cors";
import express, { type Express, type Request, type Response } from "express";
import helmet from "helmet";
import { pino } from "pino";

const logger = pino({ name: "server start" });
const app: Express = express();

app.set("trust proxy", true);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: process.env.CORS_ORIGIN || "*", credentials: true }));
app.use(helmet());

app.get("/", (_req: Request, res: Response) => {
  res.send("Hello World!");
});

app.get("/health-check", (_req: Request, res: Response) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    version: process.version,
  });
});

app.get("/hello-world", (_req: Request, res: Response) => {
  const message = process.env.SERVER_HELLO || "Hello World!";
  res.send(message);
});

export { app, logger };
