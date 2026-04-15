export const SESSION_COOKIE_NAME = "admin_session";

/**
 * ADMIN_ID を SESSION_SECRET で HMAC-SHA256 したトークンを生成する（PoC用簡易実装）
 * Web Crypto API を使用（Edge Runtime / Node.js 両対応）
 */
export async function generateSessionToken(adminId: string): Promise<string> {
  const secret = process.env.SESSION_SECRET ?? "dev-secret";
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(adminId)
  );
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Cookie の値がトークンとして正しいか検証する
 */
export async function verifySessionToken(token: string): Promise<boolean> {
  const adminId = process.env.ADMIN_ID;
  if (!adminId) return false;
  const expected = await generateSessionToken(adminId);
  return token === expected;
}
