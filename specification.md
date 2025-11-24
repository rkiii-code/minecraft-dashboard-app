Minecraft Server Monitoring Dashboard
仕様書 (Draft v1.5)

## 1. システム概要と目標
- Docker 上の Minecraft Java Vanilla サーバーから「サーバー稼働状況」「プレイヤー情報」「scoreboard メトリクス（デス数・プレイ時間など）」を取得し、React フロントエンド（Cloudflare Pages）で可視化する。
- 閲覧はログイン必須（JWT）。役割は `user`（閲覧）/`admin`（メトリクス管理）。
- バックエンドは Go + SQLite。Cloudflare Tunnel 経由で公開し、フロントと同一ドメインの `/api/*` にプロキシして CORS 不要とする。

## 2. 全体構成（テキスト図）
Cloudflare Pages (React)
    |
    |  HTTPS `/api/*`
    v
Cloudflare Tunnel
    |
    v
Backend API (Go)  --- SQLite (ファイル)
    |
    |  RCON
    v
Minecraft Java Server (Docker / itzg/minecraft-server)

## 3. 機能要件
### 3.1 サーバーステータス
- オンライン/オフライン、現在/最大プレイヤー数、MOTD、サーバーバージョンを表示。
- 定期ポーリングで取得（デフォルト 30 秒間隔、環境変数で可変）。
- 最終取得時刻を返却し、通信失敗時は「offline」として扱う。

### 3.2 プレイヤー情報
- プレイヤー名・UUID、オンライン/オフライン、最終ログイン時刻を表示。
- scoreboard スコアの一覧/ランキングをユーザー画面で閲覧可能。
- `first_seen_at` と `last_seen_at` を保持し、オンライン検知時に更新する。

### 3.3 scoreboard メトリクス
- 任意の objective（例: `death_count`, `play_time`）を登録・無効化・削除可能（admin）。
- プレイヤー別の値を取得し、ランキング表示をサポート。
- メトリクス定義は DB で管理し、表示名/単位を設定できる。

### 3.4 認証・認可
- JWT 方式。`Authorization: Bearer <token>`。
- ロール: `user`（閲覧のみ）、`admin`（メトリクス CRUD）。
- パスワードは bcrypt もしくは argon2 でハッシュ化。トークン有効期限は環境変数で指定。

### 3.5 ユーザープロフィール
- 各アカウントにプロフィール（表示名、ひとこと、アバター URL）を持たせる。
- ほかのユーザーのプロフィールは閲覧可能（メールなど機微情報は含めない）。
- 自分のプロフィールは編集可能（表示名/ひとこと/アバター URL）。更新頻度はレートリミット。
- ひとことは 140 文字程度を上限にする。
- アバター未設定時はデフォルト画像 `default.jpg`（ゲーム寄りのドット調しまえなが）を返却/表示する。

## 4. 非機能要件
- 想定同時利用: 少人数（〜20 ユーザー）を前提に軽量実装。
- RCON 取得間隔: デフォルト 30 秒（サーバー負荷を考慮し調整可能）。
- 通信は Cloudflare 経由で HTTPS。秘密情報は環境変数で管理。
- ログイン試行はレートリミットをかける。管理系 API はロールチェック。
- バックアップ: SQLite ファイルを定期コピー（外部ストレージ前提）。

## 5. Minecraft 側設定
### 5.1 docker-compose 設定例（RCON 有効化）
```yaml
environment:
  ENABLE_RCON: "true"
  RCON_PORT: 25575
  RCON_PASSWORD: "changeme"  # 環境変数で上書きすること
```

### 5.2 scoreboard objective の例
```
scoreboard objectives add death_count deathCount "Death Count"
scoreboard objectives add play_time minecraft.custom:minecraft.play_time "Play Time"
```

## 6. DB 設計（SQLite）
### users
| column        | type     | note                                  |
|---------------|----------|---------------------------------------|
| id            | integer  | PK                                    |
| username      | string   | unique                                |
| display_name  | string   | optional（表示名）                     |
| bio           | string   | optional（ひとこと、最大 140 文字程度） |
| avatar_url    | string   | optional（アバター画像 URL）           |
| email         | string   | optional                              |
| password_hash | string   | bcrypt/argon2                         |
| role          | string   | `user` / `admin`                      |
| created_at    | datetime |                                       |
| updated_at    | datetime |                                       |

### metrics（scoreboard 定義）
| column         | type     | note                                  |
|----------------|----------|---------------------------------------|
| id             | integer  | PK                                    |
| objective_name | string   | scoreboard の objective 名（unique）   |
| display_name   | string   | 表示名（日本語可）                    |
| description    | string   | optional                               |
| unit           | string   | 例: 回 / 秒 / pt                       |
| is_enabled     | bool     | 無効化すると取得対象から除外          |
| created_at     | datetime |                                        |
| updated_at     | datetime |                                        |

### players
| column        | type     | note                       |
|---------------|----------|----------------------------|
| id            | integer  | PK                         |
| uuid          | string   | unique                     |
| name          | string   | unique                     |
| first_seen_at | datetime |                            |
| last_seen_at  | datetime |                            |
| created_at    | datetime |                            |
| updated_at    | datetime |                            |

### player_scores
| column       | type     | note                                   |
|--------------|----------|----------------------------------------|
| id           | integer  | PK                                     |
| player_id    | integer  | FK -> players.id                       |
| metric_id    | integer  | FK -> metrics.id                       |
| value        | integer  |                                        |
| collected_at | datetime | 取得時刻                               |
| created_at   | datetime |                                        |
| updated_at   | datetime |                                        |

- 推奨インデックス: `players.uuid`, `players.name`, `player_scores (player_id, metric_id, collected_at)`.

## 7. RCON 取得フロー
- ポーリング間隔は環境変数 `RCON_POLL_INTERVAL_SEC`（デフォルト 30）。
- 手順:
  1. RCON に接続し `/list` でオンラインプレイヤー一覧を取得。
  2. サーバーステータス（online/offline、人数、MOTD、バージョン）を更新。
  3. `metrics` テーブルで `is_enabled = true` の objective を取得。
  4. 各プレイヤー × objective で `/scoreboard players get <player> <objective_name>` を実行。
  5. 成功した値を `player_scores` に保存。プレイヤーの `last_seen_at` を更新。
- エラーハンドリング:
  - 接続失敗はサーバー offline とみなしログ出力。
  - 個別コマンド失敗は該当スコアをスキップし、エラーを記録。

## 8. REST API 仕様（/api）
- 認証: `Authorization: Bearer <jwt>`。`/auth/login` のみ不要。

### 8.1 認証
- `POST /api/auth/login`  
  Request: `{ "username": "sun5un", "password": "password123" }`  
  Response: `{ "token": "<jwt>", "user": { "id": 1, "username": "sun5un", "role": "admin" } }`
- `GET /api/auth/me`  
  JWT 必須。ログインユーザー情報を返す。

### 8.2 サーバーステータス
- `GET /api/server/status`  
  Response 例:
  ```json
  {
    "online": true,
    "players_online": 3,
    "max_players": 5,
    "motd": "The World of Vanilla Server",
    "version": "1.21.1",
    "last_checked_at": "2025-11-24T00:00:00+09:00"
  }
  ```

### 8.3 プレイヤー
- `GET /api/players` : プレイヤー一覧（オンラインフラグ含む）。必要ならページング/検索を追加。
- `GET /api/players/{id}/scores` : 指定プレイヤーのスコア履歴/最新値。

### 8.4 メトリクス管理（admin）
- `GET /api/metrics` : 有効/無効を含むメトリクス一覧。
- `POST /api/admin/metrics`  
  Request 例: `{ "objective_name": "mob_kill", "display_name": "Mob キル数", "unit": "回" }`
- `PATCH /api/admin/metrics/{id}` : display_name/unit/is_enabled などを更新。
- `DELETE /api/admin/metrics/{id}` : メトリクス定義を削除。

### 8.5 プロフィール
- `GET /api/profile/me` : 自分のプロフィール取得（認証必須）。`avatar_url` が未設定なら `DEFAULT_AVATAR_URL` を返す。
- `PATCH /api/profile/me` : 自分の表示名/ひとこと/アバター URL を更新（認証必須、レートリミット）。
- `GET /api/users/{id}/profile` : 他ユーザーのプロフィール閲覧（公開用、メールは含めない）。`avatar_url` 未設定時は同じくデフォルトを返す。
- 返却フィールド: `id`, `username`, `display_name`, `bio`, `avatar_url`, `role`（公開閲覧時は role を省略可）。

## 9. フロントエンド（React / Cloudflare Pages）
- ページ: `/login`, `/dashboard`, `/players/:id`, `/admin/metrics`, `/profile`, `/users/:id`。
- `/dashboard`: サーバーステータスカード、オンラインプレイヤー一覧、主要メトリクスのランキングを表示。
- `/players/:id`: プレイヤー情報、メトリクス別スコア一覧/グラフ。
- `/admin/metrics`: メトリクスの追加/編集/無効化。objective 名はユニーク入力チェック。
- `/profile`: 自分の表示名・ひとこと・アバターを編集。デフォルトアバター `default.jpg`（ゲーム寄りのドット調しまえなが）をプレビューで表示し、未設定時に自動適用。
- `/users/:id`: 他ユーザーのプロフィール閲覧用。編集ボタンは非表示、プレイヤー情報とは別に扱う。アバター未設定ならデフォルトを表示。
- 環境変数: `VITE_API_BASE_URL="https://your-domain/api"`。
- UIトーン（しまえなが + ゲーム意識）: 白〜淡いグレーをベースに、アクセントは空色 (#b7e1ff) と薄い木の枝色 (#8b6b4a)。角丸大きめ、余白多め、影は極薄。デフォルトアバター `default.jpg` はゲーム寄り（ドット/ブロック感）のしまえながを使用。フォントは「Noto Sans JP」など癖のないもの。

## 10. Cloudflare Tunnel / 配置
- 目的: React を example.com、Go API を同一ドメインの `/api/*` にマッピング。
- Tunnel 設定例: `https://example.com/api/*` → `http://localhost:8080/*`
- 同一オリジンとして扱えるため追加の CORS 設定は不要。

## 11. 環境・運用（ローカル/本番共通で動くために）
- バックエンド環境変数例:  
  `PORT=8080` / `DB_PATH=./data/app.db` / `JWT_SECRET=...` / `JWT_EXPIRES_IN=24h` / `RCON_HOST=localhost` / `RCON_PORT=25575` / `RCON_PASSWORD=changeme` / `RCON_POLL_INTERVAL_SEC=30` / `DEFAULT_AVATAR_URL=/assets/default.jpg`
- フロント環境変数例:  
  `VITE_API_BASE_URL=http://localhost:8080/api`（ローカル） / `https://example.com/api`（本番） / `VITE_PORT=5173`
- ポート/URL は環境変数で差し替え可能: API `PORT`（デフォルト 8080）、Vite dev 用 `VITE_PORT`（デフォルト 5173）、Tunnel 転送先 `TUNNEL_API_ORIGIN`（例: `http://localhost:8080`）。
- ローカル手順:  
  1) `docker compose up -d minecraft` で MC+RCON を起動（同一ネットワーク）。  
  2) `go run ./cmd/server`（または `make dev` があれば使用）で API を起動。  
  3) `npm install && npm run dev -- --host --port %VITE_PORT%`（PowerShell）でフロントを起動。  
  4) ブラウザで `http://localhost:5173`（または `VITE_PORT`）→ API はローカルの `/api` を参照。
- 本番手順（例）:  
  1) `npm run build` → Cloudflare Pages に `dist` をデプロイ。  
  2) `go build -o bin/server ./cmd/server` → サービス起動（`DB_PATH` を永続ボリュームに）。  
  3) Cloudflare Tunnel で `https://example.com/api/*` → `http://localhost:8080/*` を張る（`PORT` を変える場合は Tunnel 側も更新）。  
  4) `.env` と SQLite の `data/` をバックアップ対象に含める。
- 共通チェック: `.env` の `JWT_SECRET` を空にしない、`RCON_PASSWORD` を環境ごとに分離、`data/app.db` は Git 管理外に置く、`default.jpg` を `src/assets/default.jpg` に配置。

## 12. テスト・運用チェック
- RCON 接続確認（`/list` が取得できるか）。
- `POST /api/auth/login` → `GET /api/auth/me` の JWT 動作確認。
- `/api/server/status` が offline/online で正しく切り替わるか。
- メトリクスの追加/無効化/削除が反映されるか。
- プロフィール: 自分の更新が反映されるか、他ユーザー閲覧で不要な情報が出ないか、デフォルトアバターが適用されるか。
- フロント: ダッシュボード表示、プレイヤー詳細、プロフィール画面、しまえなが系ビジュアル・ゲーム風デフォルトアバターが崩れていないか。
