import type { VercelRequest, VercelResponse } from "@vercel/node";
import { sql } from "../_db";
import { isAuthorized } from "../_auth";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;
  if (!id || typeof id !== "string") return res.status(400).json({ error: "Missing id" });

  if (req.method === "PUT") {
    if (!isAuthorized(req)) return res.status(401).json({ error: "Unauthorized" });
    const { name, description, coachingPoints, youtubeUrl, category } = req.body;
    await sql`
      UPDATE drills SET name=${name}, description=${description || ""},
        coaching_points=${JSON.stringify(coachingPoints || [])},
        youtube_url=${youtubeUrl || ""}, category=${category || "other"}
      WHERE id=${id}
    `;
    return res.status(200).json({ id, name, description: description || "", coachingPoints: coachingPoints || [], youtubeUrl: youtubeUrl || "", category: category || "other" });
  }

  if (req.method === "DELETE") {
    if (!isAuthorized(req)) return res.status(401).json({ error: "Unauthorized" });
    await sql`DELETE FROM drills WHERE id=${id}`;
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
