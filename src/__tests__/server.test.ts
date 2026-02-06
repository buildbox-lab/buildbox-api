import { describe, expect, test } from "bun:test";
import request from "supertest";
import { app } from "../server";

describe("GET /health-check", () => {
	test("returns status ok", async () => {
		const res = await request(app).get("/health-check");
		expect(res.status).toBe(200);
		expect(res.body).toEqual({ status: "ok" });
	});
});

describe("GET /db/health", () => {
	test("returns 503 with disconnected status when Couchbase is not configured", async () => {
		const res = await request(app).get("/db/health");
		expect(res.status).toBe(503);
		expect(res.body).toEqual({
			connected: false,
			latencyMs: null,
			services: {},
		});
	});
});

describe("GET /db/info", () => {
	test("returns configured false when Couchbase is not configured", async () => {
		const res = await request(app).get("/db/info");
		expect(res.status).toBe(200);
		expect(res.body).toEqual({ configured: false });
	});
});
