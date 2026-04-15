# Deployment Units: UNIT-003 / bolt-001

## デプロイ対象

### メインアプリ（Next.js / Netlify）
- UNIT-001 / UNIT-002 完了後にデプロイ

## 変更ファイル一覧

| ファイル | 変更種別 | 説明 |
|---------|---------|------|
| package.json | 更新 | html5-qrcode パッケージを追加 |
| next.config.ts | 更新 | serverExternalPackages に html5-qrcode を追加 |
| lib/actions/loans.ts | 新規 | 貸出・返却 Server Actions |
| app/page.tsx | 更新 | トップページを貸出状況一覧に全面置換 |
| app/scan/page.tsx | 新規 | QRスキャナー画面 |
| app/scan/qr-scanner.tsx | 新規 | QRスキャナー Client Component |
| app/scan/[id]/page.tsx | 新規 | 貸出・返却画面 |
| app/scan/[id]/loan-form.tsx | 新規 | 貸出フォーム・返却ボタン Client Component |
| app/admin/loans/page.tsx | 新規 | 管理者向け全貸出履歴画面 |
| app/admin/page.tsx | 更新 | 貸出履歴カードを追加 |

## デプロイ手順

1. `npm install`（html5-qrcode を含む依存関係インストール）
2. DBマイグレーション確認（UNIT-001 でスキーマ適用済み）
3. Netlify へデプロイ（自動デプロイ or `netlify deploy --prod`）
4. 環境変数確認: `DATABASE_URL` または `NETLIFY_DATABASE_URL` が設定されていること

## 動作確認手順

1. トップページ（/）を開き貸出状況が表示されることを確認
2. 管理者画面（/admin/items）で備品にQRコードを生成
3. QRコードにスマホをかざして /scan/[id] に遷移することを確認
4. 名前を入力して貸出ボタンを押し、トップページに反映されることを確認
5. 再度QRをスキャンして返却ボタンで返却できることを確認
6. /admin/loans で貸出履歴が確認できることを確認

## ロールバック手順

- Netlify の管理画面から前バージョンへロールバック
- DBデータはそのまま保持（スキーマ変更なし）

## 注意事項

- QRスキャン機能はHTTPS環境が必要（本番: Netlify / 開発: localhost はHTTPでもカメラOK）
- html5-qrcode は Client Component 内で動的インポートするためSSRの問題なし
