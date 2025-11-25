API Endpoints (frontend contract / mock対応)
===========================================

主要エンドポイントと返却形をまとめています。新規追加や変更時はこのファイルも更新してください。

公開系
- `GET /api/server/status` … サーバーオンライン状況、MOTD、version、playersOnline/maxPlayers、lastCheckedAt
- `GET /api/players` … プレイヤー一覧 (id, name, uuid, online, firstSeenAt, lastSeenAt, avatarUrl)
- `GET /api/players/{id}` … プレイヤー詳細
- `GET /api/players/{id}/scores` … scoreboard 最新値一覧
- `GET /api/players/{id}/playtime/daily?days=14` … プレイヤーの日次プレイ時間 (minutes)
- `GET /api/playtime/daily?days=30` … 全プレイヤーの日次プレイ時間（`PlaytimeSeries[]`）
- `GET /api/metrics` … メトリクス一覧 (objectiveName, displayName, description, unit, isEnabled)
- `GET /api/metrics/{id|objective}/leaderboard` … メトリクスのランキング（player, value, collectedAt）
- `GET /api/metrics/{id|objective}/history?days=30` … メトリクスの履歴（全プレイヤー系列 `MetricHistorySeries[]`）※フロントで日/週/月に再集計
- `GET /api/users/{id}/profile` … 公開プロフィール
- `GET /api/profile/me` … 自分のプロフィール

認証系
- `POST /api/auth/login` … JWT 取得
- `GET /api/auth/me` … ログイン情報取得

管理系（将来の実APIを想定。モックはフロント内で完結）
- `POST /api/admin/metrics` … メトリクス追加（objectiveName, displayName, description, unit, isEnabled）
- `PATCH /api/admin/metrics/{id}` … 更新
- `DELETE /api/admin/metrics/{id}` … 削除

パラメータメモ
- `days` は 30/90/180/360 を想定（playtime と history）。未指定時は 30 などフロント側デフォルト。
- `id|objective` … 数値IDか objectiveName 文字列で解決できるようにする。

レスポンス型（抜粋）
- `MetricHistorySeries`: `{ player: Player; samples: { date: string; value: number }[] }`
- `PlaytimeSeries`: `{ player: Player; samples: { date: string; minutes: number }[] }`
