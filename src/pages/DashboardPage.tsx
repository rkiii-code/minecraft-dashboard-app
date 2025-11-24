import React, { useEffect, useMemo, useState } from 'react';
import { Card } from '../components/Card';
import { StatusBadge } from '../components/StatusBadge';
import { Avatar } from '../components/Avatar';
import { MetricBar } from '../components/MetricBar';
import { LogoMark } from '../components/LogoMark';
import { useAsync } from '../hooks/useAsync';
import { getLeaderboard, getMetrics, getPlayers, getServerStatus } from '../lib/api';
import type { Metric, Player } from '../lib/types';

type LeaderRow = {
  player: Player;
  value: number;
  collectedAt: string;
  metric: Metric;
};

function formatDateTime(value?: string) {
  if (!value) return '—';
  return new Intl.DateTimeFormat('ja-JP', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export function DashboardPage() {
  const { data: status } = useAsync(getServerStatus, []);
  const { data: players } = useAsync(getPlayers, []);
  const { data: metrics } = useAsync(getMetrics, []);
  const [leaders, setLeaders] = useState<Record<number, LeaderRow[]>>({});

  useEffect(() => {
    if (!metrics || metrics.length === 0) return;
    (async () => {
      const entries = await Promise.all(
        metrics
          .filter((m) => m.isEnabled)
          .slice(0, 3)
          .map(async (metric) => [metric.id, await getLeaderboard(metric.id)] as const),
      );
      setLeaders(Object.fromEntries(entries));
    })();
  }, [metrics]);

  const onlinePlayers = useMemo(
    () => (players || []).filter((p) => p.online).sort((a, b) => a.name.localeCompare(b.name)),
    [players],
  );

  const offlinePlayers = useMemo(
    () => (players || []).filter((p) => !p.online).sort((a, b) => a.name.localeCompare(b.name)),
    [players],
  );

  return (
    <div className="grid" style={{ gap: 18 }}>
      <section className="hero">
        <div>
          <p className="pill status-online" style={{ width: 'fit-content', marginBottom: 10 }}>
            <span className="badge-dot" style={{ background: '#12a150' }} />
            {status?.online ? 'オンライン' : 'オフライン'}
          </p>
          <h1 className="page-title">サーバーのようす</h1>
          <p className="page-subtitle">
            RCON から scoreboard をポーリングし、Cloudflare Pages で可視化。
            モックデータで UI を先行実装しています。
          </p>
          <ul className="inline-list" style={{ marginTop: 14 }}>
            <li className="chip">ポーリング間隔 30 秒</li>
            <li className="chip">JWT 認証 / admin・user</li>
            <li className="chip">しまえながテーマ</li>
          </ul>
        </div>
        <div className="hero-illustration">
          <LogoMark size={80} />
          <div className="hint" style={{ marginTop: 10 }}>
            Cloudflare Pages → /api/* → Go API → RCON
          </div>
        </div>
      </section>

      <div className="card-grid">
        <Card title="サーバーステータス" subtitle={status ? `最終取得: ${formatDateTime(status.lastCheckedAt)}` : undefined}>
          {status ? (
            <div className="grid" style={{ gap: 10 }}>
              <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10 }}>
                <div className="surface-muted">
                  <div className="muted">MOTD</div>
                  <div style={{ fontWeight: 700 }}>{status.motd}</div>
                </div>
                <div className="surface-muted">
                  <div className="muted">バージョン</div>
                  <div style={{ fontWeight: 700 }}>{status.version}</div>
                </div>
                <div className="surface-muted">
                  <div className="muted">プレイヤー</div>
                  <div style={{ fontWeight: 800 }}>
                    {status.playersOnline} / {status.maxPlayers}
                  </div>
                </div>
              </div>
              <div className="meter" aria-hidden="true">
                <div
                  className="meter-fill"
                  style={{ width: `${Math.min(100, (status.playersOnline / status.maxPlayers) * 100)}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="muted">読み込み中...</div>
          )}
        </Card>

        <Card title="オンラインプレイヤー" subtitle="オンライン優先で並び替え">
          <div className="grid" style={{ gap: 10 }}>
            {onlinePlayers.map((player) => (
              <div
                key={player.id}
                className="glass-card"
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12 }}
              >
                <Avatar name={player.name} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700 }}>{player.name}</div>
                  <div className="hint">{player.uuid}</div>
                </div>
                <StatusBadge online label="online" />
              </div>
            ))}
            {onlinePlayers.length === 0 && <div className="muted">オンラインのプレイヤーはいません</div>}
            {offlinePlayers.length > 0 && (
              <div className="surface-muted">
                <div className="muted" style={{ marginBottom: 6 }}>
                  オフライン
                </div>
                <div className="inline-list">
                  {offlinePlayers.map((player) => (
                    <span key={player.id} className="pill">
                      {player.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>

        <Card title="メトリクスランキング" subtitle="scoreboard をもとにした上位プレイヤー">
          {metrics ? (
            <div className="grid" style={{ gap: 12 }}>
              {metrics
                .filter((m) => m.isEnabled)
                .slice(0, 3)
                .map((metric) => (
                  <div key={metric.id} className="glass-card" style={{ padding: 12 }}>
                    <div className="card-header" style={{ marginBottom: 6 }}>
                      <div>
                        <div className="label" style={{ marginBottom: 2 }}>
                          {metric.displayName}
                        </div>
                        <div className="hint">{metric.description}</div>
                      </div>
                      <span className="pill">{metric.unit}</span>
                    </div>
                    <div className="grid" style={{ gap: 8 }}>
                      {(leaders[metric.id] || []).slice(0, 3).map((row, index) => (
                        <div key={row.player.id} style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 10 }}>
                          <span className="pill" style={{ background: '#eff7ff', borderColor: '#d7eaff' }}>
                            #{index + 1}
                          </span>
                          <div>
                            <div style={{ fontWeight: 700 }}>{row.player.name}</div>
                            <div className="hint">{formatDateTime(row.collectedAt)}</div>
                          </div>
                          <div style={{ fontWeight: 800 }}>
                            {row.value.toLocaleString()} {metric.unit}
                          </div>
                        </div>
                      ))}
                      {(leaders[metric.id] || []).length === 0 && <div className="muted">データなし</div>}
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="muted">読み込み中...</div>
          )}
        </Card>
      </div>
    </div>
  );
}
