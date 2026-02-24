import type { VercelRequest, VercelResponse } from "@vercel/node";
import { generateToken } from "../_auth";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { password } = req.body || {};
  if (!password || typeof password !== "string") {
    return res.status(400).json({ error: "Password is required" });
  }

  const token = generateToken(password);
  if (!token) {
    return res.status(401).json({ error: "Invalid password" });
  }

  return res.status(200).json({ token });
}
