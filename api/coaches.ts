import type { VercelRequest, VercelResponse } from "@vercel/node";
import { sql } from "./_db";
import { isAuthorized } from "./_auth";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "GET") {
    const rows = await sql`SELECT id, name, email, phone FROM coaches ORDER BY name`;
    return res.status(200).json(rows);
  }

  if (req.method === "POST") {
    if (!isAuthorized(req)) return res.status(401).json({ error: "Unauthorized" });
    const { id, name, email, phone } = req.body;
    await sql`INSERT INTO coaches (id, name, email, phone) VALUES (${id}, ${name}, ${email || ""}, ${phone || ""})`;
    return res.status(201).json({ id, name, email: email || "", phone: phone || "" });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
