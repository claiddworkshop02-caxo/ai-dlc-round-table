# INT-000 UNIT-002 Domain Design

## ドメイン概念

UNIT-001 で定義したエンティティを前提とする。

### このUnitで扱うエンティティ

#### Item（備品）- 主要エンティティ
- id: UUID（自動生成）
- name: 備品名（必須、フリーテキスト）
- asset_number: 管理番号（任意、フリーテキスト）
- category: カテゴリ（任意、フリーテキスト）
- description: 説明（任意）
- created_at: 登録日時

### ビジネスルール
- 備品は名称が必須
- 貸出中の備品は削除不可（loan_records に returned_at = NULL のレコードが存在する場合）
- QRコードには `/scan/[id]` のURLを埋め込む
- 管理番号はシステムが自動採番しない（管理者が任意で入力）

### QRコード仕様
- 埋め込みURL: `{APP_ORIGIN}/scan/{item_id}`
- QRコードサイズ: 200x200px（印刷用）
- 備品名をQRコードの下に表示する
