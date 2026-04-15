# INT-000 UNIT-002: 備品マスタ管理・QRコード

## Purpose
管理者が備品を登録・編集・削除し、各備品のQRコードを生成・印刷できる管理者画面を実装する。

## 担当 User Stories
- US-005: 備品の登録
- US-006: 備品の編集・削除
- US-007: QRコードの生成・印刷

## Boundaries
- 含むもの
  - 備品一覧画面（/admin/items）
  - 備品登録フォーム（/admin/items/new）
  - 備品編集・削除（/admin/items/[id]/edit）
  - QRコード表示・印刷ページ（/admin/items/[id]/qr）
  - 備品CRUD の API Routes または Server Actions
- 含まないもの
  - 認証基盤（→ UNIT-001）
  - 貸出・返却処理（→ UNIT-003）

## Dependencies
- UNIT-001（DBスキーマ・認証基盤が完成していること）

## Technology Stack
- Next.js（App Router）
- Drizzle ORM + Neon DB（PostgreSQL）
- shadcn/ui
- qrcode.react（QRコード生成）
