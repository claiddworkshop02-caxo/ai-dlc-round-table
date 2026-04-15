# INT-000 UNIT-003 Logical Design

## アーキテクチャ

```
app/
  page.tsx                      # トップページ（貸出状況一覧）
  scan/
    page.tsx                    # QRスキャナー画面
    [id]/
      page.tsx                  # 貸出・返却画面（備品IDで状態判定）
  admin/
    loans/
      page.tsx                  # 全貸出履歴一覧（管理者専用）
```

## データフロー

### トップページ（貸出状況一覧）
```
ブラウザ → / にアクセス（ログイン不要）
         → Server Component: 
             SELECT i.name, lr.borrower_name, lr.loaned_at
             FROM loan_records lr
             JOIN items i ON i.id = lr.item_id
             WHERE lr.returned_at IS NULL
             ORDER BY lr.loaned_at DESC
         → 貸出中備品一覧を表示
```

### QRスキャン
```
ブラウザ → /scan（スキャナー起動）
         → html5-qrcode でカメラ起動
         → QRコードを読み取り → /scan/[item_id] にルーティング
```

### 貸出処理
```
ブラウザ → /scan/[id]（備品ID取得）
         → Server Component: 備品情報 + 現在の貸出状況を取得
         → 利用可: 名前入力フォーム表示
         → 名前入力 + 「貸出」ボタン押下
         → Server Action: INSERT INTO loan_records (item_id, borrower_name)
         → 完了メッセージ表示
```

### 返却処理
```
ブラウザ → /scan/[id]（備品が貸出中）
         → 「返却する」ボタン表示
         → ボタン押下
         → Server Action: UPDATE loan_records SET returned_at = NOW() WHERE id = $1
         → 完了メッセージ表示
```

### 貸出履歴一覧（管理者）
```
ブラウザ → /admin/loans（管理者ログイン済み）
         → Server Component:
             SELECT i.name, lr.borrower_name, lr.loaned_at, lr.returned_at
             FROM loan_records lr
             JOIN items i ON i.id = lr.item_id
             ORDER BY lr.loaned_at DESC
         → 全履歴を表示（貸出中 / 返却済みを区別）
```
