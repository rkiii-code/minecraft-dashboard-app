import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/Card';
import { Avatar } from '../components/Avatar';
import { StatusBadge } from '../components/StatusBadge';
import { useAsync } from '../hooks/useAsync';
import { getMetrics, getPlayers } from '../lib/api';
import type { Player } from '../lib/types';

function formatDateTime(value?: string) {
  if (!value) return '--';
  return new Intl.DateTimeFormat('ja-JP', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(
    new Date(value),
  );
}

export function PlayersPage() {
  const { data: players } = useAsync(getPlayers, []);
  const { data: metrics } = useAsync(getMetrics, []);

  return (
    <div className="grid" style={{ gap: 16 }}>
      <div>
        <h1 className="page-title">プレイヤー一覧</h1>
        <p className="page-subtitle">オンライン状況とプロフィール。カードを押すと詳細ダッシュボードへ移動します。</p>
      </div>
      <Card title="一覧" subtitle={`有効メトリクス: ${metrics?.filter((m) => m.isEnabled).length ?? 0} 件`}>
        <div className="card-grid">
          {(players || []).map((player: Player) => (
            <Link
              to={`/players/${player.id}`}
              key={player.id}
              className="glass-card"
              style={{ display: 'grid', gap: 8, padding: 14 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Avatar name={player.name} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800 }}>{player.name}</div>
                  <div className="hint">{player.uuid}</div>
                </div>
                <StatusBadge online={player.online} />
              </div>
              <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 8 }}>
                <div className="surface-muted">
                  <div className="muted">最終ログイン</div>
                  <div style={{ fontWeight: 700 }}>{formatDateTime(player.lastSeenAt)}</div>
                </div>
                <div className="surface-muted">
                  <div className="muted">初回ログイン</div>
                  <div style={{ fontWeight: 700 }}>{formatDateTime(player.firstSeenAt)}</div>
                </div>
              </div>
            </Link>
          ))}
          {(players || []).length === 0 && <div className="muted">まだプレイヤーがいません</div>}
        </div>
      </Card>
    </div>
  );
}
