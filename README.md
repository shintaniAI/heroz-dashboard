# HEROZZ 経営ダッシュボード

4視点（契約ベース本日/昨日・発生ベース本日/昨日）でKGI、コスト、媒体別予約・契約、日次推移、営業員別実績、プラン別売上を可視化するNext.js 15 + Vercel 向けダッシュボード。

## Stack

- Next.js 15 (App Router)
- React 19
- TailwindCSS
- Recharts
- Google Sheets API v4 (service account)

## 環境変数

`.env.local` を `.env.example` からコピー:

```bash
GOOGLE_SERVICE_ACCOUNT_EMAIL=...@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
SOURCE_SPREADSHEET_ID=14mPCHuitBOKYjNhISKwcK2KaVJfZcEjC0GDdrpzCNow
INPUT_SPREADSHEET_ID=1Expj4pqdJPcWKEhmh7zTULCTpPqv69xcoqtitlRGrsk
```

### Google Service Account セットアップ

1. GCPでプロジェクト作成 → Sheets API 有効化
2. IAM → サービスアカウント作成 → JSONキーダウンロード
3. 対象スプレッドシートに サービスアカウントのメール を「閲覧者」で共有
4. Vercelの Environment Variables に設定（`GOOGLE_PRIVATE_KEY` は改行を `\n` でエスケープ）

## 開発

```bash
npm install
npm run dev
# => http://localhost:3000
# モック表示: http://localhost:3000/?mock=1
```

## デプロイ

```bash
git push origin main
# Vercel側で自動デプロイ
```

## データソース参照タブ

下記スプレッドシートの各タブを参照:
<https://docs.google.com/spreadsheets/d/14mPCHuitBOKYjNhISKwcK2KaVJfZcEjC0GDdrpzCNow/edit>

| ダッシュボード表示 | 参照タブ | 範囲 |
|---|---|---|
| 全KPI（契約ベース本日） | `経営管理シート(4月/契約)本日` | A1:I161 |
| 全KPI（契約ベース昨日） | `経営管理シート(4月/契約)昨日` | A1:I161 |
| 全KPI（発生ベース本日） | `経営管理シート(4月/発生)本日` | A1:I161 |
| 全KPI（発生ベース昨日） | `経営管理シート(4月/発生)昨日` | A1:I161 |
| 営業員別（未実装部分） | `②【顧客管理シート】` | T列+CZ列+AW列 |
| 広告宣伝費実績 | `チャネル別流入管理` | E72 |
| コスト目標 | `★目標管理` | C9:C15 |

手入力項目のモックは別スプレッドシート:
<https://docs.google.com/spreadsheets/d/1Expj4pqdJPcWKEhmh7zTULCTpPqv69xcoqtitlRGrsk/edit>
