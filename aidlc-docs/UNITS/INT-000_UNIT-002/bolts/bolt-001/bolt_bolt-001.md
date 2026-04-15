# Bolt: UNIT-002 / bolt-001

## 0. Bolt Purpose
- Target Intent: INT-000
- Target Unit: INT-000_UNIT-002（備品マスタ管理・QRコード）
- Target User Stories: US-005, US-006, US-007
- Goal (Definition of Done):
  - 管理者が備品を登録・編集・削除できる
  - 貸出中の備品は削除不可
  - 各備品のQRコードを画面で確認・印刷できる

## 1. Scope
### In Scope
- app/admin/items/page.tsx（備品一覧）
- app/admin/items/new/page.tsx（備品登録フォーム）
- app/admin/items/[id]/edit/page.tsx（備品編集フォーム）
- app/admin/items/[id]/qr/page.tsx（QRコード表示）
- lib/actions/items.ts（Server Actions）
- qrcode.react のインストール・設定

### Out of Scope
- 貸出・返却処理（UNIT-003）

## 2. Dependencies & Prerequisites
- Dependencies: UNIT-001 の完了（DBスキーマ・認証基盤）
- Prerequisites: qrcode.react パッケージの追加（npm install qrcode.react）
- Constraints: なし

## 3. Design Diff
- 新規ルート: /admin/items, /admin/items/new, /admin/items/[id]/edit, /admin/items/[id]/qr
- DBアクセス: items テーブルへの CRUD + loan_records との JOIN
- 外部パッケージ: qrcode.react

## 4. Implementation & Tests
- Target paths:
  - /mnt/c/Users/CL-SharePC/src/ai-dlc-round-table/app/admin/items/
  - /mnt/c/Users/CL-SharePC/src/ai-dlc-round-table/lib/actions/items.ts
- Unit test viewpoints:
  - 名称なしで登録しようとするとバリデーションエラー
  - 正常な情報で備品が登録される
  - 貸出中の備品に削除ボタンを押すとエラーになる
  - 貸出中でない備品が削除される
  - QRコード画面に正しいURLが埋め込まれたQRが表示される

## 5. Deployment Units
- Affected: メインアプリ（Netlify Functions / Next.js）
- 手順: UNIT-001完了後にデプロイ
- Rollback: 前バージョンにロールバック

## 6. Approval Gate
- [x] Scope is agreed upon
- [x] Design diff is appropriate
- [x] Test viewpoints are appropriate
- [x] Deployment/rollback is appropriate

Approver:
Approval Date: 2026-04-15

## Outcome
- What was completed:
  - lib/actions/items.ts (createItem / updateItem / deleteItem Server Actions)
  - app/admin/items/page.tsx (備品一覧 Server Component)
  - app/admin/items/item-form.tsx (新規・編集共用フォーム Client Component)
  - app/admin/items/delete-item-button.tsx (削除ボタン Client Component)
  - app/admin/items/new/page.tsx (備品登録ページ)
  - app/admin/items/[id]/edit/page.tsx (備品編集ページ)
  - app/admin/items/[id]/qr/page.tsx (QRコード表示ページ)
  - app/admin/items/[id]/qr/qr-display.tsx (QRコード描画 Client Component)
  - components/ui/table.tsx, badge.tsx, textarea.tsx (shadcn/ui コンポーネント追加)
  - package.json に qrcode.react ^4.2.0 追加
- What could not be completed: なし
- Changed design/assumptions:
  - API Routes ではなく Server Actions で実装（設計ドキュメントの両案から Server Actions を選択）
  - Button の asChild の代わりに Link コンポーネントにクラス名を付与する方式を採用（@base-ui/react の asChild 対応が不明確なため）

## Open Issues
- NEXT_PUBLIC_APP_URL 環境変数をデプロイ時に設定が必要

## Next Bolt
- UNIT-003 / bolt-001: 貸出・返却・閲覧
