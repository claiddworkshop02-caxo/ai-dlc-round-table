# INT-000 UNIT-003: 貸出・返却・閲覧

## Purpose
従業員がQRコードをスキャンして貸出・返却を記録できるスマホ対応画面と、貸出状況・履歴の閲覧機能を実装する。

## 担当 User Stories
- US-001: QRコードスキャンによる貸出
- US-002: QRコードスキャンによる返却
- US-003: 貸出状況の確認（トップページ）
- US-008: 貸出履歴の確認（管理者画面）

## Boundaries
- 含むもの
  - トップページ（/）: 現在の貸出状況一覧（ログイン不要）
  - QRスキャン画面（/scan → スキャナー起動）
  - QRスキャン後の貸出・返却画面（/scan/[id]）
  - 管理者画面：全貸出履歴一覧（/admin/loans）
- 含まないもの
  - 備品CRUD（→ UNIT-002）
  - 認証基盤（→ UNIT-001）

## Dependencies
- UNIT-001（DBスキーマ・認証基盤）
- UNIT-002（備品マスタが存在すること）

## Technology Stack
- Next.js（App Router）
- Drizzle ORM + Neon DB（PostgreSQL）
- shadcn/ui
- html5-qrcode（QRコードスキャン）
