import type { VercelRequest, VercelResponse } from "@vercel/node";
import { sql } from "./_db";
import { isAuthorized } from "./_auth";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "GET") {
    const rows = await sql`SELECT id, name, date, notes, stations FROM practice_plans ORDER BY date DESC`;
    return res.status(200).json(rows);
  }

  if (req.method === "POST") {
    if (!isAuthorized(req)) return res.status(401).json({ error: "Unauthorized" });
    const { id, name, date, notes, stations } = req.body;
    await sql`
      INSERT INTO practice_plans (id, name, date, notes, stations)
      VALUES (${id}, ${name}, ${date || ""}, ${notes || ""}, ${JSON.stringify(stations || [])})
    `;
    return res.status(201).json({ id, name, date: date || "", notes: notes || "", stations: stations || [] });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
