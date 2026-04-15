# INT-000 UNIT-001 Component Design

## コンポーネント一覧

### app/admin/login/page.tsx
- 管理者ログインフォーム
- shadcn/ui: Card, Input, Label, Button
- Server Action でフォーム送信処理
- バリデーション: ID・パスワードが空の場合エラー表示
- 認証失敗時: 「IDまたはパスワードが正しくありません」を表示

### app/admin/layout.tsx
- 管理者エリア共通レイアウト
- Cookie 検証ロジック（未ログインなら /admin/login へリダイレクト）
- ログアウトボタンを含むナビゲーション

### middleware.ts
- matcher: ['/admin/:path*']
- Cookie が存在しない場合 /admin/login へ redirect

### src/schema.ts（更新）
- 既存の comments テーブルを削除
- items / loan_records テーブルを追加

### Server Actions（app/admin/login/page.tsx 内）
```
loginAction(formData: FormData): void
  - ADMIN_ID / ADMIN_PASSWORD と照合
  - 一致: SESSION_SECRET を使ったトークンをCookieにセット → redirect('/admin')
  - 不一致: エラーメッセージを返す

logoutAction(): void
  - Cookieを削除 → redirect('/admin/login')
```

## Cookie仕様
- 名前: `admin_session`
- 値: ADMIN_ID を SESSION_SECRET で HMAC-SHA256 したハッシュ（PoC用簡易実装）
- HttpOnly: true
- SameSite: lax
- Path: /admin
- 有効期限: セッション（ブラウザ閉じるまで）
