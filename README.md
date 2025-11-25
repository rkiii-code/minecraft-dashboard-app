Minecraft Server Monitoring Dashboard (frontend mock)
=====================================================

React + Vite で作る「しまえなが」テーマの Minecraft サーバーダッシュボード。現状はフロントのみで、モックデータをスタブ API として返します（本番は Go API / RCON を想定）。

主な機能
- サーバーステータス表示（オンライン/オフライン、MOTD、バージョン、人数）
- オンライン/オフラインプレイヤー一覧
- scoreboard メトリクスのランキング
- プレイヤー詳細（スコア、ログイン履歴、日次プレイ時間）
- 管理画面でのメトリクスモック追加/有効化
- 新規: 日次プレイ時間の全プレイヤー推移グラフ（/metrics/playtime、日/週/月単位切替）
- 新規: 各メトリクスの全プレイヤー推移グラフ（/metrics/:id/history または objective 名で指定可、日/週/月単位切替）

Docker での実行（フロント単体・モック利用）
1) ビルド: `docker build -f Dockerfile.frontend -t minecraft-dashboard-frontend .`
2) 実行: `docker run -d -p 5173:80 --name mc-dashboard -e VITE_USE_MOCK=true minecraft-dashboard-frontend`
3) ブラウザ: http://localhost:5173
   - 実 API を見る場合は `-e VITE_USE_MOCK=false -e VITE_API_BASE_URL=https://your-api.example.com/api` を追加。

開発（ローカル）
1) 依存インストール: `npm install`
2) 開発サーバー: `npm run dev`
   - Vite の dev サーバーが `/api/*` をモックで返します。
3) ビルド: `npm run build`（環境によっては権限設定が必要な場合があります）

ルート
- `/login`, `/dashboard`, `/players`, `/players/:id`, `/metrics`, `/metrics/playtime`, `/metrics/:id/history`, `/admin/metrics`, `/profile`, `/users/:id`

モックデータについて
- `src/data/mock.ts` に scoreboard / プレイヤー / プレイ時間のモックを定義。
- `VITE_USE_MOCK` が true（デフォルト）の場合、フロント内の API クライアントがモックを返します。
- dev サーバー起動時は Vite プラグインが `/api/*` をスタブレスポンスとして返します。
