import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Avatar } from '../components/Avatar';
import { Card } from '../components/Card';
import { MetricBar } from '../components/MetricBar';
import { PlaytimeChart } from '../components/PlaytimeChart';
import { StatusBadge } from '../components/StatusBadge';
import { useAsync } from '../hooks/useAsync';
import { getMetrics, getPlayer, getPlayerPlaytimeDaily, getPlayerScores } from '../lib/api';
import type { Metric, PlayerScore, PlaytimeDaily } from '../lib/types';

function formatDateTime(value?: string) {
  if (!value) return '--';
  return new Intl.DateTimeFormat('ja-JP', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function buildSpark(value: number) {
  const parts = 9;
  const base = Math.max(2, Math.min(18, Math.round((value / 20) % 18)));
  const items: number[] = [];
  for (let i = 0; i < parts; i += 1) {
    const variance = (i % 2 === 0 ? 1 : -1) * (i + 1);
    items.push(Math.max(3, Math.min(32, base + variance)));
  }
  return items;
}

export function PlayerDetailPage() {
  const { id } = useParams();
  const playerId = Number(id);
  const { data: player } = useAsync(() => getPlayer(playerId), [playerId]);
  const { data: scores } = useAsync(() => getPlayerScores(playerId), [playerId]);
  const { data: metrics } = useAsync(getMetrics, []);
  const { data: playtime, loading: playtimeLoading } = useAsync<PlaytimeDaily | null>(
    () => (Number.isFinite(playerId) ? getPlayerPlaytimeDaily(playerId, 14) : Promise.resolve(null)),
    [playerId],
  );

  const scoreCards = useMemo(() => {
    const metricById: Record<number, Metric> = {};
    (metrics || []).forEach((metric) => {
      metricById[metric.id] = metric;
    });
    return (scores || []).map((s: PlayerScore) => ({
      ...s,
      metric: metricById[s.metricId],
    }));
  }, [metrics, scores]);

  if (!Number.isFinite(playerId)) {
    return <div className="muted">無効なプレイヤー ID</div>;
  }

  if (!player) {
    return <div className="muted">読み込み中...</div>;
  }

  return (
    <div className="grid" style={{ gap: 16 }}>
      <div className="card" style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 12, alignItems: 'center' }}>
        <Avatar name={player.name} size={72} />
        <div>
          <h1 className="page-title" style={{ margin: 0 }}>
            {player.name}
          </h1>
          <p className="page-subtitle">{player.uuid}</p>
        </div>
        <StatusBadge online={player.online} />
      </div>

      <div className="card-grid">
        <Card title="プロフィール" subtitle="ログイン履歴 / 基本情報">
          <div className="grid" style={{ gap: 10 }}>
            <div className="surface-muted">
              <div className="muted">最終ログイン</div>
              <div style={{ fontWeight: 700 }}>{formatDateTime(player.lastSeenAt)}</div>
            </div>
            <div className="surface-muted">
              <div className="muted">初回ログイン</div>
              <div style={{ fontWeight: 700 }}>{formatDateTime(player.firstSeenAt)}</div>
            </div>
          </div>
        </Card>

        <Card title="スコア" subtitle="scoreboard の最新値">
          <div className="grid" style={{ gap: 12 }}>
            {scoreCards.map((score) =>
              score.metric ? (
                <div key={`${score.metricId}-${score.playerId}`} className="glass-card" style={{ padding: 12 }}>
                  <MetricBar
                    label={score.metric.displayName}
                    value={score.value}
                    unit={score.metric.unit}
                    percent={Math.min(100, (score.value / 1500) * 100)}
                    caption={`更新: ${formatDateTime(score.collectedAt)}`}
                  />
                </div>
              ) : null,
            )}
            {scoreCards.length === 0 && <div className="muted">scoreboard データがまだありません</div>}
          </div>
        </Card>

        <Card title="簡易履歴" subtitle="スパークバーでざっくり傾向">
          <div className="grid" style={{ gap: 10 }}>
            {scoreCards.map((score) =>
              score.metric ? (
                <div key={`spark-${score.metric.id}`} className="glass-card" style={{ padding: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ fontWeight: 700 }}>{score.metric.displayName}</div>
                    <div className="muted">{score.value.toLocaleString()}</div>
                  </div>
                  <div className="spark-bars">
                    {buildSpark(score.value).map((height, idx) => (
                      <div
                        key={idx}
                        className="spark-bar"
                        style={{
                          height,
                          opacity: 0.8 - idx * 0.04,
                        }}
                      />
                    ))}
                  </div>
                </div>
              ) : null,
            )}
          </div>
        </Card>

        <Card title="プレイ時間の推移" subtitle="scoreboard play_time から日次集計 (14 日間)">
          <PlaytimeChart samples={playtime?.samples ?? []} loading={playtimeLoading} />
        </Card>
      </div>
    </div>
  );
}
