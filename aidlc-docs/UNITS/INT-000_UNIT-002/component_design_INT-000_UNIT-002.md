# INT-000 UNIT-002 Component Design

## コンポーネント一覧

### app/admin/items/page.tsx（備品一覧）
- Server Component
- DBから全備品 + 各備品の貸出状況を取得
- shadcn/ui: Table, Badge, Button
- 各行に「編集」「QR」「削除」ボタン
- 「新規登録」ボタン → /admin/items/new

### app/admin/items/new/page.tsx（備品登録）
- Client Component（フォームバリデーション）
- フィールド: 名称（必須）、管理番号（任意）、カテゴリ（任意）、説明（任意）
- shadcn/ui: Card, Form, Input, Label, Textarea, Button
- Server Action: createItem(formData)
- 登録後: redirect('/admin/items')

### app/admin/items/[id]/edit/page.tsx（備品編集）
- Server Component（データ取得） + Client Component（フォーム）
- 既存データを初期値としてフォームに表示
- Server Action: updateItem(id, formData)
- 編集後: redirect('/admin/items')

### app/admin/items/[id]/qr/page.tsx（QRコード表示）
- Server Component（備品データ取得）
- Client Component（QRコード描画）
- qrcode.react の QRCodeSVG を使用
- 印刷用スタイル（@media print）
- 「印刷する」ボタン → window.print()
- QRに埋め込むURL: `${process.env.NEXT_PUBLIC_APP_URL}/scan/${id}`

### Server Actions（lib/actions/items.ts）
```typescript
createItem(formData: FormData): Promise<void>
updateItem(id: string, formData: FormData): Promise<void>
deleteItem(id: string): Promise<{ error?: string }>
```

### 備品一覧テーブルの列構成
| 列 | 内容 |
|----|------|
| 備品名 | name |
| 管理番号 | asset_number（なければ「-」） |
| カテゴリ | category（なければ「-」） |
| 貸出状況 | Badge: 「貸出中」（赤）/ 「利用可」（緑） |
| 操作 | 編集 / QR / 削除 ボタン |
