import type { VercelRequest } from "@vercel/node";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "buford2026";
const TOKEN_SECRET = process.env.TOKEN_SECRET || "lax-practice-secret";

export function generateToken(password: string): string | null {
  if (password !== ADMIN_PASSWORD) return null;
  const payload = `${password}:${TOKEN_SECRET}`;
  return Buffer.from(payload).toString("base64");
}

export function isAuthorized(req: VercelRequest): boolean {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return false;
  const token = header.slice(7);
  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    return decoded === `${ADMIN_PASSWORD}:${TOKEN_SECRET}`;
  } catch {
    return false;
  }
}
