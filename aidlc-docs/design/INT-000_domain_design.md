# INT-000 Domain Design（全体）

## ドメイン概念

### 用語定義

| 用語 | 説明 |
|------|------|
| 備品（Item） | 貸出管理の対象となる物品（PC・機器類など） |
| 貸出記録（LoanRecord） | 備品の貸出・返却のトランザクション記録 |
| 管理者（Admin） | 備品の登録・管理を行う担当者。1アカウント固定（環境変数管理） |
| 従業員（Employee） | QRスキャンで貸出・返却を行う一般ユーザー。ログイン不要 |

### エンティティ関係

```
Item 1 --- 0..* LoanRecord
```

- 1つの備品は複数の貸出記録を持つ（履歴）
- 同時に貸出中にできるのは1件のみ（returned_at IS NULL が高々1件）

### 主要エンティティ

#### Item（備品）
| フィールド | 型 | 必須 | 説明 |
|------------|-----|------|------|
| id | UUID | 必須 | 主キー（自動生成） |
| name | TEXT | 必須 | 備品名 |
| asset_number | TEXT | 任意 | 管理番号（フリーテキスト） |
| category | TEXT | 任意 | カテゴリ（フリーテキスト） |
| description | TEXT | 任意 | 説明 |
| created_at | TIMESTAMPTZ | 必須 | 登録日時（自動） |

#### LoanRecord（貸出記録）
| フィールド | 型 | 必須 | 説明 |
|------------|-----|------|------|
| id | UUID | 必須 | 主キー（自動生成） |
| item_id | UUID | 必須 | 備品ID（外部キー） |
| borrower_name | TEXT | 必須 | 借りた人の名前（フリーテキスト） |
| loaned_at | TIMESTAMPTZ | 必須 | 貸出日時（自動） |
| returned_at | TIMESTAMPTZ | 任意 | 返却日時（NULL = 貸出中） |

### ビジネスルール
1. 1つの備品は同時に1人にしか貸し出せない
2. 貸出中かどうかの判定: `loan_records` に `returned_at IS NULL` かつ `item_id = 該当備品` のレコードが存在するか
3. 貸出中の備品は削除不可
4. 管理者は1アカウント固定（環境変数 ADMIN_ID / ADMIN_PASSWORD）
5. 従業員はログイン不要で貸出・返却・状況確認が可能
6. QRコードには `/scan/[item_id]` が埋め込まれる
