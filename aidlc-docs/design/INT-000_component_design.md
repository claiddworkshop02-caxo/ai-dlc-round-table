# INT-000 Component Design（全体）

## 画面一覧

| 画面名 | パス | 認証 | 担当Unit |
|--------|------|------|---------|
| トップ（貸出状況一覧） | / | 不要 | UNIT-003 |
| QRスキャナー | /scan | 不要 | UNIT-003 |
| 貸出・返却 | /scan/[id] | 不要 | UNIT-003 |
| 管理者ログイン | /admin/login | 不要（ログイン画面自体） | UNIT-001 |
| 管理者ダッシュボード | /admin | 必要 | UNIT-001 |
| 備品一覧 | /admin/items | 必要 | UNIT-002 |
| 備品登録 | /admin/items/new | 必要 | UNIT-002 |
| 備品編集 | /admin/items/[id]/edit | 必要 | UNIT-002 |
| QRコード表示 | /admin/items/[id]/qr | 必要 | UNIT-002 |
| 貸出履歴一覧 | /admin/loans | 必要 | UNIT-003 |

## ファイル構成（全体）

```
app/
  layout.tsx
  globals.css
  page.tsx                          # トップ（貸出状況一覧）
  scan/
    page.tsx                        # QRスキャナー（Client Component）
    [id]/
      page.tsx                      # 貸出・返却
  admin/
    login/
      page.tsx                      # ログインフォーム
    layout.tsx                      # 管理者エリア共通（認証チェック）
    page.tsx                        # ダッシュボード
    items/
      page.tsx                      # 備品一覧
      new/
        page.tsx                    # 備品登録
      [id]/
        edit/
          page.tsx                  # 備品編集
        qr/
          page.tsx                  # QRコード表示
    loans/
      page.tsx                      # 貸出履歴一覧
middleware.ts                       # /admin 保護
src/
  schema.ts                         # Drizzle スキーマ
  db.ts                             # DB接続
lib/
  utils.ts
  actions/
    items.ts                        # 備品CRUD Server Actions
    loans.ts                        # 貸出・返却 Server Actions
    auth.ts                         # ログイン・ログアウト Server Actions
components/
  ui/                               # shadcn/ui コンポーネント
```

## 共通コンポーネント方針
- 基本的に shadcn/ui を使用
- カスタムコンポーネントは最小限
- スマホ対応: scan 系ページはモバイルファースト
- 印刷対応: QRコードページは @media print スタイルを付与
