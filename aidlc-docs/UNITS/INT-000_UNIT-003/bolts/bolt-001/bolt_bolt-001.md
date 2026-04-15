# Bolt: UNIT-003 / bolt-001

## 0. Bolt Purpose
- Target Intent: INT-000
- Target Unit: INT-000_UNIT-003（貸出・返却・閲覧）
- Target User Stories: US-001, US-002, US-003, US-008
- Goal (Definition of Done):
  - トップページに現在の貸出状況一覧が表示される
  - QRスキャン画面でカメラが起動し、QRコードを読み取れる
  - スキャン後に貸出フォーム（利用可）または返却ボタン（貸出中）が表示される
  - 貸出・返却が記録される
  - 管理者画面で全貸出履歴が確認できる

## 1. Scope
### In Scope
- app/page.tsx（トップページ・貸出状況一覧）
- app/scan/page.tsx（QRスキャナー）
- app/scan/[id]/page.tsx（貸出・返却画面）
- app/admin/loans/page.tsx（全貸出履歴）
- lib/actions/loans.ts（Server Actions）
- html5-qrcode のインストール・設定

### Out of Scope
- 備品CRUD（UNIT-002）

## 2. Dependencies & Prerequisites
- Dependencies: UNIT-001 / UNIT-002 の完了
- Prerequisites: html5-qrcode パッケージの追加（npm install html5-qrcode）
- Constraints: スマホブラウザでカメラアクセスにはHTTPS必須（本番環境・Netlify前提）

## 3. Design Diff
- app/page.tsx を完全実装（コメント画面から貸出状況一覧に置き換え）
- 新規ルート: /scan, /scan/[id], /admin/loans
- DBアクセス: loan_records テーブルへの INSERT / UPDATE + JOIN

## 4. Implementation & Tests
- Target paths:
  - /mnt/c/Users/CL-SharePC/src/ai-dlc-round-table/app/page.tsx
  - /mnt/c/Users/CL-SharePC/src/ai-dlc-round-table/app/scan/
  - /mnt/c/Users/CL-SharePC/src/ai-dlc-round-table/app/admin/loans/page.tsx
  - /mnt/c/Users/CL-SharePC/src/ai-dlc-round-table/lib/actions/loans.ts
- Unit test viewpoints:
  - 利用可の備品IDで /scan/[id] にアクセスすると貸出フォームが表示される
  - 貸出中の備品IDで /scan/[id] にアクセスすると返却ボタンが表示される
  - 名前を入力して貸出すると loan_records にレコードが挿入される
  - 返却ボタンを押すと returned_at が更新される
  - 貸出中の備品を二重貸出しようとするとエラーになる

## 5. Deployment Units
- Affected: メインアプリ（Netlify Functions / Next.js）
- 手順: UNIT-002完了後にデプロイ
- Rollback: 前バージョンにロールバック

## 6. Approval Gate
- [x] Scope is agreed upon
- [x] Design diff is appropriate
- [x] Test viewpoints are appropriate
- [x] Deployment/rollback is appropriate

Approver:
Approval Date:

## Outcome
- What was completed:
  - lib/actions/loans.ts: loanItem / returnItem Server Actions（二重貸出チェック含む）
  - app/page.tsx: トップページ（現在の貸出状況一覧 + QRスキャンボタン）
  - app/scan/page.tsx: QRスキャナー画面（html5-qrcode 動的インポート）
  - app/scan/qr-scanner.tsx: QRスキャナー Client Component
  - app/scan/[id]/page.tsx: 貸出・返却画面（状態判定 Server Component）
  - app/scan/[id]/loan-form.tsx: LoanForm / ReturnButton Client Component
  - app/admin/loans/page.tsx: 全貸出履歴一覧（管理者向け）
  - app/admin/page.tsx: 貸出履歴カードを追加
  - package.json: html5-qrcode パッケージ追加
  - next.config.ts: serverExternalPackages 設定
- What could not be completed: なし
- Changed design/assumptions:
  - html5-qrcode はuseEffect内で動的インポート（import()）することでSSRエラーを回避

## Open Issues
- ローカル開発環境でのカメラアクセス（localhost はHTTPSなしでもカメラOK）

## Next Bolt
- なし（このBoltでINT-000の全US実装完了）
