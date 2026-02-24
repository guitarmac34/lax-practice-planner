import type { VercelRequest, VercelResponse } from "@vercel/node";
import { sql } from "./_db";
import { isAuthorized } from "./_auth";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "GET") {
    const rows = await sql`SELECT id, name, positions, rank FROM players ORDER BY rank, name`;
    return res.status(200).json(rows);
  }

  if (req.method === "POST") {
    if (!isAuthorized(req)) return res.status(401).json({ error: "Unauthorized" });
    const { id, name, positions, rank } = req.body;
    await sql`
      INSERT INTO players (id, name, positions, rank)
      VALUES (${id}, ${name}, ${JSON.stringify(positions || [])}, ${rank || 0})
    `;
    return res.status(201).json({ id, name, positions: positions || [], rank: rank || 0 });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
