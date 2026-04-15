# INT-000 UNIT-002 Logical Design

## アーキテクチャ

```
app/
  admin/
    page.tsx                     # 管理者ダッシュボード（備品一覧へのリンク）
    items/
      page.tsx                   # 備品一覧
      new/
        page.tsx                 # 備品登録フォーム
      [id]/
        edit/
          page.tsx               # 備品編集フォーム
        qr/
          page.tsx               # QRコード表示・印刷
  api/
    items/
      route.ts                   # GET（一覧）/ POST（登録）
      [id]/
        route.ts                 # PUT（更新）/ DELETE（削除）
```

## データフロー

### 備品登録
```
管理者 → /admin/items/new（フォーム入力）
       → Server Action: INSERT INTO items
       → redirect('/admin/items')
```

### 備品編集
```
管理者 → /admin/items/[id]/edit（フォーム入力）
       → Server Action: UPDATE items SET ... WHERE id = $1
       → redirect('/admin/items')
```

### 備品削除
```
管理者 → DELETE ボタン押下
       → Server Action: 貸出中チェック（loan_records で returned_at IS NULL）
       → 貸出中: エラーメッセージ表示
       → 貸出中でない: DELETE FROM items WHERE id = $1
       → revalidatePath('/admin/items')
```

### QRコード表示
```
管理者 → /admin/items/[id]/qr
       → Server Component: SELECT item WHERE id = $1
       → qrcode.react で QRコード描画（URL: /scan/{id}）
       → ブラウザ印刷（window.print()）
```

## 備品一覧表示
- 全備品を登録日時降順で表示
- 各備品の貸出状況（貸出中/利用可）を JOIN で取得
- 貸出中: loan_records に returned_at IS NULL のレコードが存在する
