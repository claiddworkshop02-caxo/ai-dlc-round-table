# INT-000 UNIT-003 Domain Design

## ドメイン概念

UNIT-001 / UNIT-002 で定義したエンティティを前提とする。

### このUnitで扱うエンティティ

#### LoanRecord（貸出記録）- 主要エンティティ
- id: UUID
- item_id: 備品ID（外部キー）
- borrower_name: 借りた人の名前（フリーテキスト）
- loaned_at: 貸出日時
- returned_at: 返却日時（NULL = 貸出中）

### ビジネスルール
- QRコードをスキャンすると `/scan/[item_id]` にアクセスされる
- 備品が利用可能な場合: 借りる人の名前入力フォームを表示し「貸出」ボタンを押すと貸出記録を作成
- 備品が貸出中の場合: 「返却する」ボタンを表示し押すと returned_at を更新
- 貸出・返却はいずれもログイン不要

### 貸出状況判定ロジック
```
SELECT * FROM loan_records
WHERE item_id = $1 AND returned_at IS NULL
LIMIT 1
```
- レコードが存在する → 貸出中（返却ボタン表示）
- レコードが存在しない → 利用可（貸出フォーム表示）
