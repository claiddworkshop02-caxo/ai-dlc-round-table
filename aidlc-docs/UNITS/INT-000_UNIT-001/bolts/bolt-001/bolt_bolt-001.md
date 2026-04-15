# Bolt: UNIT-001 / bolt-001

## 0. Bolt Purpose
- Target Intent: INT-000
- Target Unit: INT-000_UNIT-001（基盤・認証）
- Target User Stories: US-004（管理者ログイン）
- Goal (Definition of Done):
  - DBスキーマ（items / loan_records）が定義されマイグレーション済み
  - 管理者ログイン・ログアウトが動作する
  - /admin 配下が未ログイン時にリダイレクトされる
  - 既存コメント機能が削除されている

## 1. Scope
### In Scope
- src/schema.ts の全面書き換え（comments → items / loan_records）
- Drizzle マイグレーション実行
- app/admin/login/page.tsx（ログインフォーム + Server Action）
- app/admin/layout.tsx（認証チェック + ログアウト）
- middleware.ts（/admin ルート保護）
- app/page.tsx の既存コメント機能削除（仮のトップページに差し替え）

### Out of Scope
- 備品CRUD（UNIT-002）
- 貸出・返却処理（UNIT-003）

## 2. Dependencies & Prerequisites
- Dependencies: なし（このBoltが全体の基盤）
- Prerequisites: DATABASE_URL, ADMIN_ID, ADMIN_PASSWORD, SESSION_SECRET の環境変数設定
- Constraints: 既存のcommentsテーブルのデータは破棄してよい

## 3. Design Diff
- スキーマ変更: comments テーブル削除、items / loan_records テーブル追加
- 新規ルート: /admin/login, /admin（ダッシュボード仮ページ）
- middleware.ts 新規追加（/admin 配下保護）
- 認証方式: 環境変数 + HttpOnly Cookie（HMAC-SHA256 簡易実装）

## 4. Implementation & Tests
- Target paths:
  - /mnt/c/Users/CL-SharePC/src/ai-dlc-round-table/src/schema.ts
  - /mnt/c/Users/CL-SharePC/src/ai-dlc-round-table/app/admin/login/page.tsx
  - /mnt/c/Users/CL-SharePC/src/ai-dlc-round-table/app/admin/layout.tsx
  - /mnt/c/Users/CL-SharePC/src/ai-dlc-round-table/app/admin/page.tsx
  - /mnt/c/Users/CL-SharePC/src/ai-dlc-round-table/middleware.ts
  - /mnt/c/Users/CL-SharePC/src/ai-dlc-round-table/app/page.tsx（コメント機能削除）
- Unit test viewpoints:
  - ログインフォームが正しいID/PWで認証成功する
  - 誤ったID/PWでエラーメッセージが表示される
  - /admin に未ログイン状態でアクセスすると /admin/login にリダイレクトされる
  - ログアウト後にCookieが削除される

## 5. Deployment Units
- Affected: メインアプリ（Netlify Functions / Next.js）
- 手順: Drizzle マイグレーション実行後にデプロイ
- Rollback: DBスキーマをロールバック（commentsテーブルは削除済みのため要注意）

## 6. Approval Gate
- [x] Scope is agreed upon
- [x] Design diff is appropriate
- [x] Test viewpoints are appropriate
- [x] Deployment/rollback is appropriate

Approver: （承認待ち）
Approval Date: 2026-04-15

## Outcome
- What was completed:
  - src/schema.ts の全面書き換え（comments → items / loan_records）
  - Drizzle マイグレーションファイルの手動生成（0002_add_items_loan_records.sql）
  - lib/auth.ts（Web Crypto API 使用の認証ユーティリティ）
  - middleware.ts（/admin 配下のルート保護）
  - app/admin/login/page.tsx（ログインフォーム）
  - app/admin/layout.tsx（ログアウトボタン付きレイアウト）
  - app/admin/page.tsx（管理者ダッシュボード仮ページ）
  - app/api/auth/login/route.ts（POST ログイン API）
  - app/api/auth/logout/route.ts（POST ログアウト API）
  - app/page.tsx のコメント機能削除（仮のトップページに差し替え）
- What could not be completed:
  - npm run db:generate（WSL 環境に Node.js 未インストールのため手動生成で対応）
- Changed design/assumptions:
  - 認証ユーティリティを Node.js の `crypto` モジュールから Web Crypto API に変更（Edge Runtime 対応のため）
  - マイグレーションファイルをコマンドではなく手動生成（環境制約）

## Open Issues
- SESSION_SECRET の値はデプロイ時に環境変数に設定が必要

## Next Bolt
- UNIT-002 / bolt-001: 備品マスタ管理・QRコード生成
