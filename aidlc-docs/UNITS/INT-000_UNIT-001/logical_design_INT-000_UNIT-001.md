# INT-000 UNIT-001 Logical Design

## アーキテクチャ

Next.js App Router を使用したサーバーコンポーネント中心の構成。

```
app/
  layout.tsx           # ルートレイアウト
  page.tsx             # トップページ（貸出状況一覧 → UNIT-003で実装）
  admin/
    login/
      page.tsx         # 管理者ログイン画面
    layout.tsx         # 管理者エリア共通レイアウト（認証チェック）
  api/
    auth/
      login/route.ts   # POST /api/auth/login
      logout/route.ts  # POST /api/auth/logout
middleware.ts          # /admin 配下へのアクセス制御
src/
  schema.ts            # Drizzle スキーマ定義（items / loan_records）
  db.ts                # DB接続
```

## 認証フロー

1. 管理者が /admin/login にアクセス
2. ID・パスワードを入力してフォーム送信
3. Server Action が環境変数と照合
4. 一致すれば HttpOnly Cookie（session）をセット → /admin へリダイレクト
5. middleware.ts が /admin 配下のリクエストで Cookie を検証
6. Cookie 未設定の場合 /admin/login へリダイレクト

## DBスキーマ

```sql
-- 備品テーブル
CREATE TABLE items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  asset_number TEXT,
  category    TEXT,
  description TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 貸出記録テーブル
CREATE TABLE loan_records (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id      UUID NOT NULL REFERENCES items(id),
  borrower_name TEXT NOT NULL,
  loaned_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  returned_at  TIMESTAMPTZ
);
```

## データフロー（認証）

```
ブラウザ → POST /api/auth/login
         → Server Action: 環境変数照合
         → Set-Cookie: session=<token>; HttpOnly
         → Redirect /admin
```

## 環境変数

| 変数名 | 用途 |
|--------|------|
| DATABASE_URL / NETLIFY_DATABASE_URL | Neon DB 接続文字列 |
| ADMIN_ID | 管理者ユーザーID |
| ADMIN_PASSWORD | 管理者パスワード |
| SESSION_SECRET | Cookieトークン署名用シークレット |
