import type { VercelRequest, VercelResponse } from "@vercel/node";
import { sql } from "../_db";
import { isAuthorized } from "../_auth";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;
  if (!id || typeof id !== "string") return res.status(400).json({ error: "Missing id" });

  if (req.method === "PUT") {
    if (!isAuthorized(req)) return res.status(401).json({ error: "Unauthorized" });
    const { date, time, eventType, opponent, location, notes } = req.body;
    await sql`
      UPDATE schedule_events SET date=${date || ""}, time=${time || ""},
        event_type=${eventType || "other"}, opponent=${opponent || ""},
        location=${location || ""}, notes=${notes || ""}
      WHERE id=${id}
    `;
    return res.status(200).json({ id, date: date || "", time: time || "", eventType: eventType || "other", opponent: opponent || "", location: location || "", notes: notes || "" });
  }

  if (req.method === "DELETE") {
    if (!isAuthorized(req)) return res.status(401).json({ error: "Unauthorized" });
    await sql`DELETE FROM schedule_events WHERE id=${id}`;
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
