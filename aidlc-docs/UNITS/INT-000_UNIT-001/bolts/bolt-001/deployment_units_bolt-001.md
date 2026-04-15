# Deployment Units: bolt-001

## Deployment Unit
- Unit name: メインアプリ（Netlify Functions / Next.js）
- Dependencies: Neon DB（PostgreSQL）
- Configuration（環境変数）:
  - `DATABASE_URL` または `NETLIFY_DATABASE_URL`: Neon DB 接続文字列
  - `ADMIN_ID`: 管理者ユーザーID
  - `ADMIN_PASSWORD`: 管理者パスワード
  - `SESSION_SECRET`: Cookie トークン署名用シークレット（必須）

## Deployment Procedure
1. 環境変数（ADMIN_ID / ADMIN_PASSWORD / SESSION_SECRET）を Netlify のダッシュボードに設定する
2. `npm run db:migrate` でマイグレーションを実行する（comments テーブル削除 / items・loan_records テーブル作成）
3. デプロイを実行する（`git push` → Netlify 自動ビルド）

## Rollback Procedure
1. アプリのロールバック: Netlify の「Deploys」画面から前のデプロイに戻す
2. DBロールバック（注意: comments テーブルは削除されるため復元不可）
   - 必要な場合は手動で `CREATE TABLE comments ...` を実行してデータを復元する
   - items / loan_records テーブルは `DROP TABLE loan_records; DROP TABLE items;` で削除可能

## Monitoring
- Health check endpoints: なし（PoC のため省略）
- Metrics to watch: なし（PoC のため省略）
- Alert conditions: なし（PoC のため省略）
