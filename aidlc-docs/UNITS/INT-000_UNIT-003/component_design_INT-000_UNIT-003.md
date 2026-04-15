# INT-000 UNIT-003 Component Design

## コンポーネント一覧

### app/page.tsx（トップページ・貸出状況一覧）
- Server Component
- 貸出中の備品一覧を取得・表示
- shadcn/ui: Card, Table, Badge
- ヘッダー: 「現在の貸出状況」
- 「QRをスキャンして貸出・返却する」ボタン → /scan
- ログイン不要

### app/scan/page.tsx（QRスキャナー）
- Client Component
- html5-qrcode を使用してカメラ起動
- QR読み取り成功 → router.push('/scan/[item_id]')
- スマホブラウザ対応（カメラ権限リクエスト）
- 「戻る」ボタン → /

### app/scan/[id]/page.tsx（貸出・返却画面）
- Server Component（備品・貸出状況取得）
- 備品が見つからない場合: 「備品が見つかりません」表示
- 利用可の場合:
  - 備品名を表示
  - 借りる人の名前入力フォーム（shadcn/ui: Input, Label, Button）
  - Server Action: loanItem(itemId, borrowerName)
  - 成功: 「貸出しました」完了画面
- 貸出中の場合:
  - 備品名・借りた人の名前・貸出日時を表示
  - 「返却する」ボタン（shadcn/ui: Button）
  - Server Action: returnItem(loanRecordId)
  - 成功: 「返却しました」完了画面

### app/admin/loans/page.tsx（貸出履歴一覧）
- Server Component（管理者専用、認証チェックは layout で実施済み）
- 全貸出履歴を取得
- shadcn/ui: Table, Badge
- 列: 備品名 / 借りた人 / 貸出日時 / 返却日時 / 状態
- 状態: 「貸出中」（赤バッジ）/ 「返却済」（グレーバッジ）

### Server Actions（lib/actions/loans.ts）
```typescript
loanItem(itemId: string, borrowerName: string): Promise<{ error?: string }>
  - 貸出中チェック（既に貸出中ならエラー）
  - INSERT INTO loan_records (item_id, borrower_name)

returnItem(loanRecordId: string): Promise<void>
  - UPDATE loan_records SET returned_at = NOW() WHERE id = $1
```

## スマホ対応
- scan 画面はモバイルファーストのデザイン
- カメラ権限のリクエストダイアログをわかりやすく説明
- ボタンは大きめ（タップしやすい）
