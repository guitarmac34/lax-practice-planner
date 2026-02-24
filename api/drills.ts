import type { VercelRequest, VercelResponse } from "@vercel/node";
import { sql } from "./_db";
import { isAuthorized } from "./_auth";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "GET") {
    const rows = await sql`
      SELECT id, name, description, coaching_points AS "coachingPoints",
             youtube_url AS "youtubeUrl", category
      FROM drills ORDER BY name
    `;
    return res.status(200).json(rows);
  }

  if (req.method === "POST") {
    if (!isAuthorized(req)) return res.status(401).json({ error: "Unauthorized" });
    const { id, name, description, coachingPoints, youtubeUrl, category } = req.body;
    await sql`
      INSERT INTO drills (id, name, description, coaching_points, youtube_url, category)
      VALUES (${id}, ${name}, ${description || ""}, ${JSON.stringify(coachingPoints || [])}, ${youtubeUrl || ""}, ${category || "other"})
    `;
    return res.status(201).json({ id, name, description: description || "", coachingPoints: coachingPoints || [], youtubeUrl: youtubeUrl || "", category: category || "other" });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
