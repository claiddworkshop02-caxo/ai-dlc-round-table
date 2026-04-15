# INT-000 Logical Design（全体）

## アーキテクチャ概要

Next.js App Router を使用したフルスタックWebアプリケーション。
Server Components・Server Actions を中心に、クライアントサイドはQRスキャンのみ Client Component を使用。

## ルーティング構造

```
/                              # トップページ（貸出状況一覧、ログイン不要）
/scan                          # QRスキャナー（ログイン不要）
/scan/[id]                     # 貸出・返却画面（ログイン不要）
/admin/login                   # 管理者ログイン
/admin                         # 管理者ダッシュボード
/admin/items                   # 備品一覧
/admin/items/new               # 備品登録
/admin/items/[id]/edit         # 備品編集
/admin/items/[id]/qr           # QRコード表示・印刷
/admin/loans                   # 貸出履歴一覧
```

## 認証・認可

```
middleware.ts
  └─ /admin/:path* → Cookie（admin_session）チェック
       ├─ Cookie あり: 通過
       └─ Cookie なし: /admin/login へ redirect
```

- 認証方式: 環境変数（ADMIN_ID / ADMIN_PASSWORD）との照合 + HttpOnly Cookie
- Cookie 値: ADMIN_ID を SESSION_SECRET で HMAC-SHA256 したハッシュ

## DBスキーマ（全体）

```sql
CREATE TABLE items (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT NOT NULL,
  asset_number TEXT,
  category     TEXT,
  description  TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE loan_records (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id       UUID NOT NULL REFERENCES items(id),
  borrower_name TEXT NOT NULL,
  loaned_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  returned_at   TIMESTAMPTZ
);
```

## レイヤー構成

```
[Browser]
    |
[Next.js Pages / Server Components]  <- DBから直接データ取得
    |
[Server Actions]                      <- CUD操作
    |
[Drizzle ORM]
    |
[Neon DB (PostgreSQL)]
```

## 外部ライブラリ

| ライブラリ | 用途 |
|-----------|------|
| drizzle-orm | ORM |
| @neondatabase/serverless | Neon DB接続 |
| shadcn/ui | UIコンポーネント |
| qrcode.react | QRコード生成・表示 |
| html5-qrcode | QRコードスキャン（カメラ） |

## 環境変数一覧

| 変数名 | 用途 |
|--------|------|
| DATABASE_URL | Neon DB 接続文字列（または NETLIFY_DATABASE_URL） |
| NETLIFY_DATABASE_URL | Netlify環境でのフォールバック |
| ADMIN_ID | 管理者ユーザーID |
| ADMIN_PASSWORD | 管理者パスワード |
| SESSION_SECRET | Cookie署名用シークレット |
| NEXT_PUBLIC_APP_URL | QRコード埋め込みURL生成用（例: https://xxx.netlify.app） |
