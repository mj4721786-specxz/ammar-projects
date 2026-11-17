import { statusBody } from "../server/core.js";

export function GET() {
  return Response.json(statusBody());
}
