import { NextRequest, NextResponse } from "next/server";
import {
  SESSION_COOKIE_NAME,
  generateSessionToken,
} from "@/lib/auth";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body.id !== "string" || typeof body.password !== "string") {
    return NextResponse.json({ error: "Bad Request" }, { status: 400 });
  }

  const { id, password } = body as { id: string; password: string };
  const adminId = process.env.ADMIN_ID;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminId || !adminPassword) {
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }

  if (id !== adminId || password !== adminPassword) {
    return NextResponse.json(
      { error: "IDまたはパスワードが正しくありません" },
      { status: 401 }
    );
  }

  const token = await generateSessionToken(adminId);
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/admin",
    // セッションCookie（有効期限なし = ブラウザ閉じるまで）
  });

  return response;
}
