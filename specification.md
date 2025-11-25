Minecraft Server Monitoring Dashboard
仕様書 (Draft v1.6 / 日本語)

## 1. 概要と目的
日本語での利用を考えたアプリケーション。
Docker 上の Minecraft Java Vanilla サーバーを監視。Go + SQLite バックエンドが RCON からサーバーステータス・プレイヤー・scoreboard メトリクスを取得し、REST API を提供。React フロントは Cloudflare Pages に配置し、Cloudflare Tunnel 経由で同一ドメインの `/api/*` にリバースプロキシ (CORS 不要)。ロールは `user` (閲覧) / `admin` (メトリクス管理)。

## 2. 全体構成 (テキスト図)
- Cloudflare Pages (React)
  - HTTPS -> `/api/*`
  - Cloudflare Tunnel
  - Backend API (Go) -> SQLite (ファイル)
  - RCON -> Minecraft Java Server (Docker / itzg/minecraft-server)

## 3. 機能要件
### 3.1 サーバーステータス
- オンライン/オフライン、現在/最大プレイヤー数、MOTD、サーバーバージョンを表示。
- デフォルト 30 秒間隔でポーリング (環境変数で変更可)。最終取得時刻を返す。失敗時は offline と扱う。

### 3.2 プレイヤー
- プレイヤー名・UUID、オンライン/オフライン、first_seen_at / last_seen_at を保持。オンライン検知時に更新。
- scoreboard の値をプレイヤー別に表示・ランキング可能。

### 3.3 scoreboard メトリクス
- admin が objective を追加/無効化/削除。例: `death_count`, `play_time`。
- 単位・説明を保持。`is_enabled` が false のものはポーリング対象外。
- メトリクスごとのランキングを提供。

### 3.4 認証・認可
- JWT (`Authorization: Bearer <token>`)、ロールは `user` / `admin`。
- パスワードは bcrypt または argon2。トークン有効期限は環境変数で設定。

### 3.5 プロフィール
- 項目: display_name, bio(<=140 文字), avatar_url。avatar 未設定時は `default.jpg` (ゲーム風ドット絵)。
- 他ユーザーのプロフィールは閲覧可 (メールなど機微情報は含めない)。自分のプロフィールは編集可 (レートリミット前提)。
- プロフィールから自分のプレイヤーダッシュボード (`/players/:id`) へ遷移でき、スコア・ログイン履歴・プレイ時間の詳細を閲覧できる。

### 3.6 プレイ時間の推移 (新規)
- 人ごとに日次のプレイ時間をグラフ表示。「その日に何分プレイしたか」を 14〜30 日分返す API を用意し、プロフィール画面などで表示。
- scoreboard `play_time` (tick) の差分を分に換算し、日次で永続化。オフラインでも履歴を参照可能。
- 全プレイヤーの推移を 1 枚のグラフで比較するビューを用意し、ダッシュボードのプレイ時間カードから遷移できる。

## 4. 非機能要件
- 想定ユーザー少数、軽量ポーリング (デフォルト 30 秒)。
- HTTPS (Cloudflare)、秘密情報は環境変数。ログインはレートリミット。admin API はロールチェック必須。
- SQLite ファイルは外部へバックアップ。RCON パスワード等は環境変数で供給。

## 5. Minecraft 側セットアップ
```yaml
environment:
  ENABLE_RCON: "true"
  RCON_PORT: 25575
  RCON_PASSWORD: "changeme" # 環境変数で上書き
```
scoreboard objective 例:
```
scoreboard objectives add death_count deathCount "Death Count"
scoreboard objectives add play_time minecraft.custom:minecraft.play_time "Play Time"
```

## 6. DB 設計 (SQLite)
### users
| column        | type     | note                    |
|---------------|----------|-------------------------|
| id            | integer  | PK                      |
| username      | string   | unique                  |
| display_name  | string   | optional                |
| bio           | string   | optional, <=140         |
| avatar_url    | string   | optional                |
| email         | string   | optional                |
| password_hash | string   | bcrypt/argon2           |
| role          | string   | `user` / `admin`        |
| created_at    | datetime |                         |
| updated_at    | datetime |                         |

### metrics (scoreboard 定義)
| column         | type     | note                                |
|----------------|----------|-------------------------------------|
| id             | integer  | PK                                  |
| objective_name | string   | scoreboard objective 名 (unique)    |
| display_name   | string   | 表示名                              |
| description    | string   | optional                             |
| unit           | string   | min / times / pt など                |
| is_enabled     | bool     | false ならポーリング除外            |
| created_at     | datetime |                                      |
| updated_at     | datetime |                                      |

### players
| column        | type     | note            |
|---------------|----------|-----------------|
| id            | integer  | PK              |
| uuid          | string   | unique          |
| name          | string   | unique          |
| first_seen_at | datetime |                 |
| last_seen_at  | datetime |                 |
| created_at    | datetime |                 |
| updated_at    | datetime |                 |

### player_scores
| column       | type     | note                               |
|--------------|----------|------------------------------------|
| id           | integer  | PK                                 |
| player_id    | integer  | FK -> players.id                   |
| metric_id    | integer  | FK -> metrics.id                   |
| value        | integer  | scoreboard 生値                    |
| collected_at | datetime | 取得時刻                           |
| created_at   | datetime |                                    |
| updated_at   | datetime |                                    |
推奨インデックス: `players.uuid`, `players.name`, `player_scores (player_id, metric_id, collected_at)`。

### player_playtime_daily (新設)
| column     | type     | note                                               |
|------------|----------|----------------------------------------------------|
| id         | integer  | PK                                                 |
| player_id  | integer  | FK -> players.id                                   |
| date       | date     | 基準日 (UTC or JST で統一)                         |
| minutes    | integer  | その日のプレイ分数 (play_time の増分を分換算)      |
| created_at | datetime |                                                     |
| updated_at | datetime |                                                     |
ユニーク制約: `(player_id, date)`。play_time が巻き戻った場合は当日分を 0 以上にクランプ。

## 7. RCON ポーリングフロー
1. `/list` でオンラインプレイヤー取得。
2. サーバーステータス (online/offline, counts, MOTD, version, last_checked_at) 更新。
3. `is_enabled = true` の metrics を取得。
4. プレイヤー×objective で `/scoreboard players get <player> <objective_name>` を実行。
5. `player_scores` に保存し、成功時は `players.last_seen_at` を更新。
6. `play_time` の場合は前回値との差分を取り、tick->分 (ticks/20/60) に換算し、`player_playtime_daily` の当日レコードに加算。
7. 失敗時: サーバー接続失敗は offline 扱い。個別失敗は該当スコアをスキップしログ出力。

## 8. REST API
- 認証: `POST /api/auth/login`, `GET /api/auth/me`
- サーバー: `GET /api/server/status`
- プレイヤー: `GET /api/players`, `GET /api/players/{id}/scores`
- プレイ時間: `GET /api/players/{id}/playtime/daily?days=14` 返却例
```json
{
  "playerId": 1,
  "rangeDays": 14,
  "samples": [
    { "date": "2025-11-11", "minutes": 42 },
    { "date": "2025-11-12", "minutes": 0 }
  ]
}
```
- プレイ時間 (全体比較): `GET /api/playtime/daily?days=14` 返却例
```json
[
  {
    "player": { "id": 1, "name": "sun5un", "uuid": "...", "online": true, "lastSeenAt": "", "firstSeenAt": "" },
    "samples": [
      { "date": "2025-11-11", "minutes": 42 },
      { "date": "2025-11-12", "minutes": 0 }
    ]
  }
]
```
- メトリクス (admin): `GET /api/metrics`, `POST /api/admin/metrics`, `PATCH /api/admin/metrics/{id}`, `DELETE /api/admin/metrics/{id}`
- メトリクス履歴: `GET /api/metrics/{id}/history?days=30` 返却例
```json
[
  {
    "player": { "id": 1, "name": "sun5un", "uuid": "...", "online": true, "lastSeenAt": "", "firstSeenAt": "" },
    "samples": [
      { "date": "2025-11-11", "value": 1240 },
      { "date": "2025-11-12", "value": 1260 }
    ]
  }
]
```
- プロフィール: `GET /api/profile/me`, `PATCH /api/profile/me`, `GET /api/users/{id}/profile`, `GET /api/profile/me/playtime/daily?days=14` (自分用エイリアス)

- ルート: `/login`, `/dashboard`, `/players/:id`, `/metrics`, `/metrics/:id/history`, `/admin/metrics`, `/profile`, `/users/:id`
- ダッシュボード: ステータスカード、オンラインプレイヤー、主要メトリクスのランキング。各メトリクスカードから日次推移グラフへリンク。
- メトリクス一覧: `/metrics` で objective/単位/説明をカード表示し、履歴リンクを提供。
- プレイ時間全体比較: `/metrics/playtime` で 30 / 90 / 180 / 360 日を取得し、日/週/月単位に再集計して表示。
- メトリクス履歴: `/metrics/:id/history` で任意メトリクスの推移を表示（全プレイヤーを一枚に、日/週/月単位切替）。
- プレイヤー詳細: プロフィール/ログイン履歴、scoreboard 値、プレイ時間グラフ。
- プロフィール: 表示名・ひとこと・アバター編集 + プレイ時間スパークライン (読み取り専用)。
- デフォルトアバターは `default.jpg`。テーマは明るめ + 空色(#b7e1ff) と枝色(#8b6b4a)、角丸大きめ、影は控えめ。

## 10. Cloudflare Tunnel / 配置
- 同一オリジン: `https://example.com/api/*` -> `http://localhost:8080/*` (Tunnel)。
- React は build して Cloudflare Pages に `dist/` を配置。

## 11. 環境変数 / 運用
- Backend: `PORT=8080`, `DB_PATH=./data/app.db`, `JWT_SECRET=...`, `JWT_EXPIRES_IN=24h`, `RCON_HOST`, `RCON_PORT=25575`, `RCON_PASSWORD`, `RCON_POLL_INTERVAL_SEC=30`, `DEFAULT_AVATAR_URL=/assets/default.jpg`。
- Frontend: `VITE_API_BASE_URL=http://localhost:8080/api` (本番はドメイン), `VITE_PORT=5173`。
- `.env` は git に含めない。`data/app.db` を定期バックアップ。

## 12. 動作確認チェックリスト
- RCON `/list` 取得できる。
- `POST /api/auth/login` -> `GET /api/auth/me` が通る。ロールチェックが有効。
- `/api/server/status` が online/offline を正しく返す。
- メトリクス追加/無効/削除が反映される。
- プロフィール更新が反映され、未設定時はデフォルトアバターが返る。
- プレイ時間日次 API が 14〜30 日分返り、フロントのグラフに表示される。

## 13. Docker / Compose
- `.env.example` をコピーして `.env` を用意。`JWT_SECRET` と `RCON_PASSWORD` を必ず設定。
- frontend: Vite build を Nginx で配信 (デフォルト 80)。
- backend: Go (`./cmd/server`)、`./data:/app/data` をマウント、`/healthz` でヘルスチェック。
- minecraft: itzg/minecraft-server:java21、RCON 有効、ボリューム `mc_data`。
- 実行例: `docker compose up -d minecraft backend frontend`。停止は `docker compose down` (リセット時は `-v`)。
