import { chat } from "../server/core.js";

export async function POST(request: Request) {
  const ip = (request.headers.get("x-forwarded-for") ?? "unknown").split(",")[0].trim();
  let body: unknown = null;
  try {
    body = await request.json();
  } catch {
    body = null;
  }
  const token = (request.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "") || null;
  const r = await chat(body, ip, token);
  return Response.json(r.body, { status: r.status });
}
