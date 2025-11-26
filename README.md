# Minecraft Server Monitoring Dashboard (frontend mock)

React + Vite で作る「しまえなが」テーマの Minecraft サーバーダッシュボード。現状はフロントのみで、モックデータをスタブ API として返します（本番は Go API / RCON を想定）。

## 主な機能

- サーバーステータス表示（オンライン/オフライン、MOTD、バージョン、人数）
- オンライン/オフラインプレイヤー一覧
- scoreboard メトリクスのランキング
- プレイヤー詳細（スコア、ログイン履歴、日次プレイ時間）
- 管理画面でのメトリクスモック追加/有効化
- 日次プレイ時間の全プレイヤー推移グラフ（/metrics/playtime）
- 各メトリクスの全プレイヤー推移グラフ（/metrics/:id/history）
- **認証機能**: ログイン/ログアウト、ロールベースのアクセス制御

## モックログインアカウント

`VITE_USE_MOCK=true`（デフォルト）時に使用できるテストアカウント:

| ユーザー名 | パスワード | ロール | 説明                             |
| ---------- | ---------- | ------ | -------------------------------- |
| `admin`    | `admin123` | admin  | 管理者権限（メトリクス管理可能） |
| `user`     | `user123`  | user   | 一般ユーザー（閲覧のみ）         |
| `sun5un`   | `password` | admin  | テスト管理者                     |
| `umi_bird` | `password` | user   | テストユーザー                   |

### ロール別の機能

- **admin**: ダッシュボード、プレイヤー一覧、メトリクス、管理メニュー、プロフィール
- **user**: ダッシュボード、プレイヤー一覧、メトリクス、プロフィール（管理メニューは非表示）

---

## Docker での実行

### 初回ビルド & 起動

```bash
# イメージをビルド
docker build -t minecraft-dashboard-frontend .

# コンテナを起動（ポート 8080 で公開）
docker run -d -p 8080:80 --name mc-dashboard minecraft-dashboard-frontend

# ブラウザでアクセス
open http://localhost:8080
```

### コード変更後の更新手順

```bash
# 1. 既存コンテナを停止・削除
docker stop mc-dashboard && docker rm mc-dashboard

# 2. イメージを再ビルド
docker build -t minecraft-dashboard-frontend .

# 3. 新しいコンテナを起動
docker run -d -p 8080:80 --name mc-dashboard minecraft-dashboard-frontend
```

### ワンライナー（更新時）

```bash
docker stop mc-dashboard; docker rm mc-dashboard; docker build -t minecraft-dashboard-frontend . && docker run -d -p 8080:80 --name mc-dashboard minecraft-dashboard-frontend
```

### 環境変数

| 変数名              | デフォルト | 説明                    |
| ------------------- | ---------- | ----------------------- |
| `VITE_USE_MOCK`     | `true`     | モックモードの有効/無効 |
| `VITE_API_BASE_URL` | `/api`     | バックエンド API の URL |

実 API を使う場合:

```bash
docker run -d -p 8080:80 --name mc-dashboard \
  -e VITE_USE_MOCK=false \
  -e VITE_API_BASE_URL=https://your-api.example.com/api \
  minecraft-dashboard-frontend
```

### クリーンアップ

```bash
# コンテナ停止・削除
docker stop mc-dashboard && docker rm mc-dashboard

# イメージも削除する場合
docker rmi minecraft-dashboard-frontend
```

---

## 開発（ローカル）

```bash
# 依存インストール
npm install

# 開発サーバー起動（ホットリロード対応）
npm run dev

# ビルド
npm run build
```

開発サーバーは http://localhost:5173 で起動します。

---

## ルート一覧

| パス                   | 説明                         |
| ---------------------- | ---------------------------- |
| `/login`               | ログイン画面                 |
| `/dashboard`           | ダッシュボード               |
| `/players`             | プレイヤー一覧               |
| `/players/:id`         | プレイヤー詳細               |
| `/metrics`             | メトリクス一覧               |
| `/metrics/playtime`    | プレイ時間推移グラフ         |
| `/metrics/:id/history` | メトリクス履歴グラフ         |
| `/admin/metrics`       | メトリクス管理（admin のみ） |
| `/profile`             | 自分のプロフィール           |
| `/users/:id`           | ユーザープロフィール         |

---

## モックデータについて

- `src/data/mock.ts` に scoreboard / プレイヤー / プレイ時間 / ログインユーザーのモックを定義
- `VITE_USE_MOCK=true`（デフォルト）の場合、フロント内の API クライアントがモックを返す
- 開発サーバー起動時は Vite プラグインが `/api/*` をスタブレスポンスとして返す

---

## 技術スタック

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: CSS (しまえながテーマ)
- **Router**: React Router v6
- **Container**: Docker + Nginx
