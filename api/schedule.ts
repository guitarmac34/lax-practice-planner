import type { VercelRequest, VercelResponse } from "@vercel/node";
import { sql } from "./_db";
import { isAuthorized } from "./_auth";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "GET") {
    const rows = await sql`
      SELECT id, date, time, event_type AS "eventType", opponent, location, notes
      FROM schedule_events ORDER BY date, time
    `;
    return res.status(200).json(rows);
  }

  if (req.method === "POST") {
    if (!isAuthorized(req)) return res.status(401).json({ error: "Unauthorized" });
    const { id, date, time, eventType, opponent, location, notes } = req.body;
    await sql`
      INSERT INTO schedule_events (id, date, time, event_type, opponent, location, notes)
      VALUES (${id}, ${date || ""}, ${time || ""}, ${eventType || "other"}, ${opponent || ""}, ${location || ""}, ${notes || ""})
    `;
    return res.status(201).json({ id, date: date || "", time: time || "", eventType: eventType || "other", opponent: opponent || "", location: location || "", notes: notes || "" });
  }

  if (req.method === "PUT") {
    if (!isAuthorized(req)) return res.status(401).json({ error: "Unauthorized" });
    const events = req.body;
    if (!Array.isArray(events)) return res.status(400).json({ error: "Expected array of events" });
    await sql`DELETE FROM schedule_events`;
    for (const ev of events) {
      await sql`
        INSERT INTO schedule_events (id, date, time, event_type, opponent, location, notes)
        VALUES (${ev.id}, ${ev.date || ""}, ${ev.time || ""}, ${ev.eventType || "other"}, ${ev.opponent || ""}, ${ev.location || ""}, ${ev.notes || ""})
      `;
    }
    return res.status(200).json(events);
  }

  return res.status(405).json({ error: "Method not allowed" });
}
