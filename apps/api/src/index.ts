import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import "dotenv/config";

import auth from "./routes/auth";
import contracts from "./routes/contracts";
import disputes from "./routes/disputes";
import dev from "./routes/dev";

const app = new Hono();

// Middleware
app.use("*", logger());
app.use(
  "*",
  cors({
    origin: process.env.APP_URL || "http://localhost:3000",
    credentials: true,
  })
);

// Health check
app.get("/healthz", (c) => c.json({ ok: true, service: "klyrn-api" }));

// Mount API v1 routes
app.route("/api/v1/auth", auth);
app.route("/api/v1/contracts", contracts);
app.route("/api/v1/disputes", disputes);
app.route("/api/v1/dev", dev);

// Version info
app.get("/api/v1", (c) =>
  c.json({ ok: true, data: { version: "0.1.0", service: "klyrn-api" } })
);

const port = Number(process.env.PORT) || 3001;

console.log(`🚀 Klyrn API starting on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});

export default app;
export type AppType = typeof app;
