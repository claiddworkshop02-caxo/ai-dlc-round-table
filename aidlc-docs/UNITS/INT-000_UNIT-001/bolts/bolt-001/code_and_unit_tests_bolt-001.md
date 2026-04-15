# Code & Unit Tests: bolt-001

## Scope

### 実装対象ファイル

| ファイル | 内容 |
|---------|------|
| `src/schema.ts` | Drizzle スキーマ全面書き換え（comments 削除 / items・loan_records 追加） |
| `lib/auth.ts` | 認証ユーティリティ（トークン生成・検証、Web Crypto API 使用） |
| `middleware.ts` | /admin 配下のルート保護（Cookie 検証 → /admin/login リダイレクト） |
| `app/admin/login/page.tsx` | 管理者ログインフォーム（Client Component、API 呼び出し） |
| `app/admin/layout.tsx` | 管理者エリア共通レイアウト（ログアウトボタン） |
| `app/admin/page.tsx` | 管理者ダッシュボード仮ページ |
| `app/api/auth/login/route.ts` | POST /api/auth/login（認証 + Cookie セット） |
| `app/api/auth/logout/route.ts` | POST /api/auth/logout（Cookie クリア） |
| `app/page.tsx` | トップページ（コメント機能を削除してシンプルな仮ページに差し替え） |
| `drizzle/0002_add_items_loan_records.sql` | マイグレーション SQL（手動生成） |
| `drizzle/meta/0002_snapshot.json` | Drizzle メタスナップショット（手動生成） |

### 削除したファイル/コード

- `src/schema.ts` の `comments` テーブル定義
- `app/page.tsx` のコメント投稿・一覧表示ロジック

## Test Viewpoints

### 正常系
- 正しいID・パスワードで `/api/auth/login` にPOSTすると 200 が返り `admin_session` Cookie がセットされる
- ログイン後に `/admin` にアクセスすると管理者ダッシュボードが表示される
- ログアウトボタン押下で `/api/auth/logout` にPOSTされ Cookie が削除され `/admin/login` にリダイレクトされる

### 異常系
- 誤ったID・パスワードで `/api/auth/login` にPOSTすると 401 が返る
- Cookie 未設定の状態で `/admin` にアクセスすると `/admin/login` にリダイレクトされる
- ID・パスワードが空の場合、ログインフォームでクライアントバリデーションエラーが表示される

## Done Conditions
- [x] src/schema.ts が items / loan_records テーブルに書き換えられている
- [x] マイグレーションファイル（0002_add_items_loan_records.sql）が生成されている
- [x] /admin/login ページが実装されている
- [x] /api/auth/login・/api/auth/logout API が実装されている
- [x] middleware.ts が /admin 配下を保護している
- [x] comments 関連コードがすべて削除されている

## 備考

- `npm run db:generate` は WSL 環境に Node.js がインストールされていないためコマンド実行不可。
  マイグレーション SQL とスナップショット JSON は Drizzle の出力仕様に準拠して手動作成。
  実際のマイグレーション実行（`npm run db:migrate`）はデプロイ環境（Netlify 等）で行う。
- 認証は PoC 用簡易実装。Web Crypto API（HMAC-SHA256）で Cookie トークンを生成・検証している。
  Edge Runtime（middleware）でも動作するよう Node.js の `crypto` モジュールは使用していない。
