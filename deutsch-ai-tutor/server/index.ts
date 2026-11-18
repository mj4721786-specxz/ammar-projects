import "dotenv/config";
import express, { type Request, type Response } from "express";
import path from "node:path";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { chat, statusBody, LIVE, MODEL_NAME } from "./core.js";

const PORT = Number(process.env.PORT) || 3000;

const app = express();
app.set("trust proxy", 1);
app.use(express.json({ limit: "20kb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/api/status", (_req, res) => {
  res.json(statusBody());
});

app.post("/api/chat", async (req: Request, res: Response) => {
  const token = (req.get("authorization") ?? "").replace(/^Bearer\s+/i, "") || null;
  const r = await chat(req.body, req.ip ?? "unknown", token);
  res.status(r.status).json(r.body);
});

/* ---- serve the built React app (npm run build creates dist/) ---- */
const here = path.dirname(fileURLToPath(import.meta.url));
const dist = path.resolve(here, "../dist");
if (existsSync(dist)) {
  app.use(express.static(dist));
  app.use((req, res, next) => {
    if (req.method !== "GET" || req.path.startsWith("/api")) return next();
    res.sendFile(path.join(dist, "index.html"));
  });
}

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Deutsch AI Tutor on port ${PORT} (${LIVE ? "live AI mode, model " + MODEL_NAME : "DEMO mode, no API key"})`);
});
