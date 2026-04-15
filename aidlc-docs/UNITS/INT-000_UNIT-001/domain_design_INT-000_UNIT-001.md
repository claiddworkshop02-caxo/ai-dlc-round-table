# INT-000 UNIT-001 Domain Design

## ドメイン概念

### 用語定義

| 用語 | 説明 |
|------|------|
| 備品（Item） | 貸出管理の対象となる物品（PC・機器類など） |
| 貸出記録（LoanRecord） | 備品の貸出・返却のトランザクション記録 |
| 管理者（Admin） | 備品の登録・管理を行う担当者。環境変数で1アカウント固定 |
| 従業員（Employee） | QRスキャンで貸出・返却を行う一般ユーザー。ログイン不要 |

### 主要エンティティ

#### Item（備品）
- id: 一意識別子（UUID）
- name: 備品名（必須）
- asset_number: 管理番号（任意）
- category: カテゴリ（任意、フリーテキスト）
- description: 説明（任意）
- created_at: 登録日時

#### LoanRecord（貸出記録）
- id: 一意識別子（UUID）
- item_id: 備品ID（外部キー）
- borrower_name: 借りた人の名前（フリーテキスト）
- loaned_at: 貸出日時
- returned_at: 返却日時（NULL = 貸出中）

### ビジネスルール
- 1つの備品は同時に1人にしか貸し出せない（returned_at が NULL の LoanRecord が存在する場合、その備品は貸出中）
- 管理者は1アカウント固定（環境変数 ADMIN_ID / ADMIN_PASSWORD で管理）
- 従業員はログイン不要でQRスキャン・貸出状況閲覧が可能
