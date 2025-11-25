Minecraft Server Monitoring Dashboard (frontend mock)
====================================================

React/Vite で作る「しまえなが」テーマの Minecraft サーバーダッシュボードです。現状はフロントのみで、モックデータで動作します（バックエンドや Minecraft サーバーは未実装）。

主な機能

- サーバーステータス、オンライン/オフラインプレイヤー表示
- scoreboard メトリクスランキング、プレイヤー詳細/プロフィール
- 14 日分のプレイ時間チャート
- 管理画面（objective のモック追加/有効切替）

クイックスタート (Docker / フロント単体)

1. イメージビルド  
   `docker build -f Dockerfile.frontend -t minecraft-dashboard-frontend .`
2. コンテナ起動  
   `docker run -d -p 5173:80 --name mc-dashboard minecraft-dashboard-frontend`
3. ブラウザで確認  
   http://localhost:5173

補足

- ビルド時に `--build-arg VITE_API_BASE_URL=...` / `--build-arg VITE_PORT=...` で API エンドポイントやビルド時ポートを上書きできます（デフォルトは `http://localhost:8080/api` と 4173）。
- 現状はモックデータを静的に埋め込んだフロントのみです。実 API と接続する場合は、バックエンド実装を用意して上記ビルド引数で API を指し示してください。

ローカル開発 (任意)

1. 依存インストール: `npm install`
2. 開発サーバー: `npm run dev`
   - デフォルト: コンポーネント内のモックデータを直接使用
   - スタブ API: `.env.local` などで `VITE_USE_MOCK=false` を指定すると、Vite dev server 内の `/api/*` スタブが返るため、ブラウザのネットワークタブで API 風に確認できます（ポートは `VITE_PORT` の値/デフォルト 5173）。
3. ビルド: `npm run build`

モック切替

- `src/lib/api.ts` で `VITE_USE_MOCK` 環境変数を参照します。
- デフォルト: `true`（コンポーネント内でモックデータを直接使用）。
- スタブ API: `VITE_USE_MOCK=false` でフロントが `fetch` を使い、Vite dev server 内の `/api/*` スタブルートにアクセスします。`VITE_API_BASE_URL` を変更しない限り `http://localhost:5173/api` が使われます。
- 実 API をつなげる場合は `VITE_USE_MOCK=false` に加え、`VITE_API_BASE_URL` を実サーバーへ向けてください。

Docker (フロントのみ)

- ビルド: `docker build -f Dockerfile -t minecraft-dashboard-frontend .`
- 実行: `docker run -p 5173:80 minecraft-dashboard-frontend`
- ビルド時に `--build-arg VITE_API_BASE_URL` / `--build-arg VITE_PORT` で API エンドポイントやポートを上書き可能。

環境変数サンプル
- `.env.example` を参照してください。フロントで使うのは主に `VITE_API_BASE_URL`, `VITE_PORT`, `VITE_USE_MOCK` です。

その他
- `specification.md`: 仕様書
- `ui-screens.md`: 画面要件メモ
- 現時点で `docker-compose.yml` は削除しています。バックエンド/MC サーバーを追加する際に再検討してください。
