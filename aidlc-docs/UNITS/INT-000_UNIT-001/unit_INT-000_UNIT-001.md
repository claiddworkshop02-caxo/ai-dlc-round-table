# INT-000 UNIT-001: 基盤・認証

## Purpose
アプリケーション全体の基盤となるDBスキーマを定義し、管理者認証（ログイン・ログアウト・ルート保護）を実装する。
既存のコメント機能を削除し、備品管理アプリとしての土台を作る。

## 担当 User Stories
- US-004: 管理者ログイン

## Boundaries
- 含むもの
  - DBスキーマ定義（items / loan_records テーブル）
  - Drizzle マイグレーションファイル
  - 管理者ログイン画面（/admin/login）
  - ログアウト処理
  - Next.js middleware によるルート保護（/admin 配下）
  - 既存コメント機能の削除（schema.ts / page.tsx の置き換え）
- 含まないもの
  - 備品CRUD（→ UNIT-002）
  - 貸出・返却処理（→ UNIT-003）

## Dependencies
- なし（このUnitが他のUnitの基盤となる）

## Technology Stack
- Next.js（App Router）
- Drizzle ORM + Neon DB（PostgreSQL）
- shadcn/ui
- 環境変数：ADMIN_ID / ADMIN_PASSWORD（管理者認証情報）
