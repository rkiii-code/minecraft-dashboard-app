import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/Card';
import { useAsync } from '../hooks/useAsync';
import { getMetrics } from '../lib/api';
import type { Metric } from '../lib/types';

export function MetricsOverviewPage() {
  const { data: metrics, loading } = useAsync(getMetrics, []);

  return (
    <div className="grid" style={{ gap: 16 }}>
      <div>
        <h1 className="page-title">メトリクス一覧</h1>
        <p className="page-subtitle">scoreboard objective と単位、説明を確認し、カードを押して日次履歴へ移動できます。</p>
      </div>

      <Card title="メトリクス" subtitle={loading ? '読み込み中...' : `${metrics?.length ?? 0} 件`}>
        <div className="card-grid">
          {(metrics || []).map((metric: Metric) => (
            <Link
              key={metric.id}
              to={`/metrics/${metric.objectiveName}/history`}
              className="glass-card"
              style={{ padding: 14, textDecoration: 'none' }}
            >
              <div className="card-header" style={{ marginBottom: 6 }}>
                <div>
                  <div className="label" style={{ marginBottom: 2 }}>
                    {metric.displayName}
                  </div>
                  <div className="hint">{metric.description}</div>
                </div>
                <span className={`pill ${metric.isEnabled ? 'status-online' : 'status-offline'}`}>
                  {metric.isEnabled ? '有効' : '無効'}
                </span>
              </div>
              <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 8 }}>
                <div className="surface-muted">
                  <div className="muted">objective</div>
                  <div style={{ fontWeight: 700 }}>{metric.objectiveName}</div>
                </div>
                <div className="surface-muted">
                  <div className="muted">単位</div>
                  <div style={{ fontWeight: 700 }}>{metric.unit}</div>
                </div>
                <div className="surface-muted">
                  <div className="muted">最終更新</div>
                  <div className="hint">{metric.updatedAt ? new Date(metric.updatedAt).toLocaleString('ja-JP') : '---'}</div>
                </div>
              </div>
              <div className="muted" style={{ marginTop: 8, fontSize: 12 }}>
                クリックで履歴（バーグラフ）へ
              </div>
            </Link>
          ))}
          {(metrics || []).length === 0 && <div className="muted">まだメトリクスがありません</div>}
        </div>
      </Card>
    </div>
  );
}
