# Code & Unit Tests: UNIT-003 / bolt-001

## 実装済みファイル

### lib/actions/loans.ts
- `loanItem(itemId, borrowerName)`: 貸出Server Action
  - 入力バリデーション（borrowerName必須）
  - 二重貸出チェック（returned_at IS NULL レコード確認）
  - 備品存在チェック
  - loan_records に INSERT
  - revalidatePath で /, /scan/[id], /admin/loans をキャッシュ更新
- `returnItem(loanRecordId)`: 返却Server Action
  - 貸出記録の存在チェック
  - returned_at を現在時刻で UPDATE
  - revalidatePath で関連パスをキャッシュ更新

### app/page.tsx（トップページ）
- Server Component
- loan_records JOIN items で現在貸出中（returned_at IS NULL）の一覧を取得
- QRスキャンボタン（/scan へリンク）
- 現在の貸出状況テーブル表示
- 管理者ログインへのリンク

### app/scan/page.tsx（QRスキャナー）
- Server Component（外側）+ Client Component（QrScanner）
- html5-qrcode を動的インポート（useEffect 内）でSSR問題を回避
- QR読み取り成功 → /scan/[id] にルーティング

### app/scan/qr-scanner.tsx（QRスキャナーClient Component）
- "use client"
- html5-qrcode を動的インポート（import()）
- facingMode: "environment"（背面カメラ）でスキャン開始
- スキャンしたURLから /scan/[id] パターンを抽出してルーティング

### app/scan/[id]/page.tsx（貸出・返却画面）
- Server Component
- items テーブルから備品情報を取得
- loan_records から現在の貸出状況（returned_at IS NULL）を取得
- 利用可: LoanForm コンポーネントを表示
- 貸出中: ReturnButton コンポーネントを表示
- 備品が見つからない場合のエラー表示

### app/scan/[id]/loan-form.tsx（貸出・返却 Client Component）
- LoanForm: 借り手名入力フォーム + 貸出ボタン（成功時に完了メッセージ）
- ReturnButton: 返却ボタン（成功時に完了メッセージ）
- useTransition でローディング状態管理

### app/admin/loans/page.tsx（管理者向け貸出履歴）
- Server Component（認証は middleware + layout で保護済み）
- loan_records JOIN items で全履歴取得（DESC順）
- 貸出中: warning バッジ / 返却済: secondary バッジ

### app/admin/page.tsx（管理者ダッシュボード）
- 貸出履歴カードを追加（/admin/loans へのリンク）

## テスト観点（手動確認）

| # | シナリオ | 期待結果 |
|---|---------|---------|
| 1 | 利用可の備品IDで /scan/[id] にアクセス | 貸出フォームが表示される |
| 2 | 貸出中の備品IDで /scan/[id] にアクセス | 返却ボタンと借り手名が表示される |
| 3 | 名前を入力して貸出ボタンを押す | loan_records にレコードが挿入され「貸出しました」と表示 |
| 4 | 返却ボタンを押す | returned_at が更新され「返却しました」と表示 |
| 5 | 貸出中の備品を再度 /scan/[id] で貸出試行 | 二重貸出チェックでエラーになる |
| 6 | 存在しないIDで /scan/[id] にアクセス | 「備品が見つかりません」が表示される |
| 7 | トップページ（/） にアクセス | 現在貸出中の備品一覧が表示される |
| 8 | /admin/loans にアクセス（管理者） | 全貸出履歴が状態付きで表示される |
