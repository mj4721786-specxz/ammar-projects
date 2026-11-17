import { statusBody } from "../server/core";

export function GET() {
  return Response.json(statusBody());
}
