import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../src/app";

const app = createApp();

describe("API endpoints", () => {
  it("returns health status", async () => {
    const response = await request(app).get("/health");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "ok", db: "ok" });
  });

  it("returns events for a seeded book", async () => {
    const response = await request(app).get("/books/1/events");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.events)).toBe(true);
    expect(response.body.events.length).toBeGreaterThan(0);
  });

  it("returns map composition for a seeded book", async () => {
    const response = await request(app).get("/books/1/map-composition");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("base");
  });
});
