import type { VercelRequest, VercelResponse } from "@vercel/node";
import { sql } from "./_db";
import { isAuthorized } from "./_auth";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "GET") {
    const rows = await sql`
      SELECT id, title, content, last_updated AS "lastUpdated"
      FROM content_pages ORDER BY title
    `;
    return res.status(200).json(rows);
  }

  if (req.method === "POST") {
    if (!isAuthorized(req)) return res.status(401).json({ error: "Unauthorized" });
    const { id, title, content, lastUpdated } = req.body;
    await sql`
      INSERT INTO content_pages (id, title, content, last_updated)
      VALUES (${id}, ${title}, ${content || ""}, ${lastUpdated || ""})
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        content = EXCLUDED.content,
        last_updated = EXCLUDED.last_updated
    `;
    return res.status(200).json({ id, title, content: content || "", lastUpdated: lastUpdated || "" });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
