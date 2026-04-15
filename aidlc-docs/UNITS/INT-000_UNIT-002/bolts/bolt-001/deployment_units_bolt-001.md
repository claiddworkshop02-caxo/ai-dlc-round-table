# Deployment Units: UNIT-002 / bolt-001

## 対象システム
- メインアプリケーション（Next.js / Netlify Functions）

## デプロイ前の前提条件

1. UNIT-001 のデプロイが完了していること（DBスキーマ・認証基盤）
2. 以下の環境変数が設定されていること：
   - `NETLIFY_DATABASE_URL` または `DATABASE_URL`: Neon PostgreSQL 接続文字列
   - `ADMIN_ID`: 管理者ログインID
   - `ADMIN_PASSWORD`: 管理者パスワード
   - `SESSION_SECRET`: セッション署名シークレット
   - `NEXT_PUBLIC_APP_URL`: アプリのベースURL（QRコードに埋め込まれる）
     - 例: `https://your-app.netlify.app`

## デプロイ手順

1. `npm install` を実行して `qrcode.react` をインストール
2. git push で Netlify の自動デプロイを起動
3. Netlify のビルドログでエラーがないか確認
4. デプロイ完了後、以下の動作確認：
   - `/admin/items` にアクセスして備品一覧が表示されること
   - 備品の新規登録・編集・削除が動作すること
   - QRコードが表示・印刷できること

## ロールバック手順

1. Netlify ダッシュボードから前のデプロイに戻す（Publish deploy）
2. DB スキーマは変更なし（UNIT-001 から引き継ぎ）のため、DBロールバックは不要

## 影響範囲
- 新規追加ルート: `/admin/items`, `/admin/items/new`, `/admin/items/[id]/edit`, `/admin/items/[id]/qr`
- 既存ルート変更: `/admin` ダッシュボードにリンク追加
- 新規 UI コンポーネント: Table, Badge, Textarea
