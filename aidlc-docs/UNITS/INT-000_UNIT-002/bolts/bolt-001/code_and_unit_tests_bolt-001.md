# Code & Unit Tests: UNIT-002 / bolt-001

## 実装済みファイル

### Server Actions
- `/mnt/c/Users/CL-SharePC/src/ai-dlc-round-table/lib/actions/items.ts`
  - `createItem(formData)`: 備品新規作成 → redirect('/admin/items')
  - `updateItem(id, formData)`: 備品更新 → redirect('/admin/items')
  - `deleteItem(id)`: 貸出中チェック後に削除。貸出中なら `{ error: "..." }` を返す

### Pages
- `/mnt/c/Users/CL-SharePC/src/ai-dlc-round-table/app/admin/items/page.tsx`
  - Server Component。全備品 + 貸出状況を取得して一覧表示
- `/mnt/c/Users/CL-SharePC/src/ai-dlc-round-table/app/admin/items/new/page.tsx`
  - Server Component。ItemForm を表示
- `/mnt/c/Users/CL-SharePC/src/ai-dlc-round-table/app/admin/items/[id]/edit/page.tsx`
  - Server Component。DB から既存データ取得して ItemForm に渡す
- `/mnt/c/Users/CL-SharePC/src/ai-dlc-round-table/app/admin/items/[id]/qr/page.tsx`
  - Server Component。備品データ取得し QrDisplay に QR URL を渡す

### Client Components
- `/mnt/c/Users/CL-SharePC/src/ai-dlc-round-table/app/admin/items/item-form.tsx`
  - フォーム（新規・編集共用）。useTransition で Server Action を呼ぶ
- `/mnt/c/Users/CL-SharePC/src/ai-dlc-round-table/app/admin/items/delete-item-button.tsx`
  - 削除ボタン。confirm ダイアログ後 deleteItem を呼ぶ。貸出中は disabled
- `/mnt/c/Users/CL-SharePC/src/ai-dlc-round-table/app/admin/items/[id]/qr/qr-display.tsx`
  - qrcode.react の QRCodeSVG でQR表示。window.print() 対応

### shadcn/ui コンポーネント（新規追加）
- `/mnt/c/Users/CL-SharePC/src/ai-dlc-round-table/components/ui/table.tsx`
- `/mnt/c/Users/CL-SharePC/src/ai-dlc-round-table/components/ui/badge.tsx`
- `/mnt/c/Users/CL-SharePC/src/ai-dlc-round-table/components/ui/textarea.tsx`

### 外部パッケージ
- `qrcode.react ^4.2.0` を package.json に追加（npm install が必要）

## テスト観点（手動確認）

| # | 観点 | 期待結果 |
|---|------|---------|
| 1 | 名称なしで登録ボタンを押す | HTML required バリデーションでフォーム送信が阻止される |
| 2 | 名称を入力して登録する | 備品が作成され、一覧ページに遷移・一覧に表示される |
| 3 | 備品を編集して更新する | 変更内容が一覧に反映される |
| 4 | 貸出中の備品の削除ボタンを押す | ボタンが disabled で押せない（isLoaned=true のため） |
| 5 | 貸出中でない備品を削除する | 備品が削除され、一覧から消える |
| 6 | QRコード画面を表示する | 正しい `/scan/{item_id}` URL を持つQRコードが表示される |
| 7 | 「印刷する」ボタンを押す | ブラウザ印刷ダイアログが開く |
