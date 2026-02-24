import type { VercelRequest, VercelResponse } from "@vercel/node";
import { sql } from "../_db";
import { isAuthorized } from "../_auth";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;
  if (!id || typeof id !== "string") return res.status(400).json({ error: "Missing id" });

  if (req.method === "PUT") {
    if (!isAuthorized(req)) return res.status(401).json({ error: "Unauthorized" });
    const { name, email, phone } = req.body;
    await sql`UPDATE coaches SET name=${name}, email=${email || ""}, phone=${phone || ""} WHERE id=${id}`;
    return res.status(200).json({ id, name, email: email || "", phone: phone || "" });
  }

  if (req.method === "DELETE") {
    if (!isAuthorized(req)) return res.status(401).json({ error: "Unauthorized" });
    await sql`DELETE FROM coaches WHERE id=${id}`;
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
