import React, { useEffect, useState } from 'react';
import { Card } from '../components/Card';
import { useAsync } from '../hooks/useAsync';
import { getMetrics } from '../lib/api';
import type { Metric } from '../lib/types';

type DraftMetric = Metric & { temporary?: boolean };

export function AdminMetricsPage() {
  const { data: metrics, loading } = useAsync(getMetrics, []);
  const [rows, setRows] = useState<DraftMetric[]>([]);
  const [form, setForm] = useState({ objectiveName: 'new_objective', displayName: '新しいメトリクス', unit: 'pt' });

  useEffect(() => {
    if (metrics) setRows(metrics);
  }, [metrics]);

  const toggleEnabled = (id: number) => {
    setRows((current) => current.map((row) => (row.id === id ? { ...row, isEnabled: !row.isEnabled } : row)));
  };

  const handleAdd = (event: React.FormEvent) => {
    event.preventDefault();
    setRows((current) => [
      ...current,
      {
        id: Date.now(),
        objectiveName: form.objectiveName,
        displayName: form.displayName,
        description: 'プレビュー用に追加されたモックメトリクス',
        unit: form.unit,
        isEnabled: true,
        updatedAt: new Date().toISOString(),
        temporary: true,
      },
    ]);
  };

  return (
    <div className="grid" style={{ gap: 16 }}>
      <div>
        <h1 className="page-title">管理 / メトリクス</h1>
        <p className="page-subtitle">scoreboard objective の追加・無効化。バックエンド接続まではモック操作です。</p>
      </div>

      <Card title="追加" subtitle="objective は英小文字とアンダースコアのみを想定">
        <form onSubmit={handleAdd} className="grid" style={{ gap: 10 }}>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10 }}>
            <div>
              <label className="label" htmlFor="objective">
                objective_name
              </label>
              <input
                id="objective"
                className="input"
                value={form.objectiveName}
                onChange={(e) => setForm((f) => ({ ...f, objectiveName: e.target.value }))}
              />
            </div>
            <div>
              <label className="label" htmlFor="displayName">
                表示名
              </label>
              <input
                id="displayName"
                className="input"
                value={form.displayName}
                onChange={(e) => setForm((f) => ({ ...f, displayName: e.target.value }))}
              />
            </div>
            <div>
              <label className="label" htmlFor="unit">
                単位
              </label>
              <input id="unit" className="input" value={form.unit} onChange={(e) => setForm((f) => ({ ...f, unit: e.target.value }))} />
            </div>
          </div>
          <button className="btn btn-primary" type="submit">
            モック追加
          </button>
          <div className="hint">実際の API につなぐ前はプレビューのみ。最終的には POST /api/admin/metrics を呼び出す想定です。</div>
        </form>
      </Card>

      <Card title="メトリクス一覧" subtitle={loading ? '読み込み中...' : `${rows.length} 件`}>
        <table className="table">
          <thead>
            <tr>
              <th>objective</th>
              <th>表示名</th>
              <th>単位</th>
              <th>状態</th>
              <th>最終更新</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td style={{ fontWeight: 700 }}>{row.objectiveName}</td>
                <td>{row.displayName}</td>
                <td>{row.unit}</td>
                <td>
                  <span className={`pill ${row.isEnabled ? 'status-online' : 'status-offline'}`}>
                    {row.isEnabled ? '有効' : '無効'}
                  </span>
                </td>
                <td className="muted">{row.updatedAt ? new Date(row.updatedAt).toLocaleString('ja-JP') : '—'}</td>
                <td>
                  <button className="btn btn-ghost" type="button" onClick={() => toggleEnabled(row.id)}>
                    {row.isEnabled ? '無効化' : '有効化'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && <div className="muted">データがありません</div>}
      </Card>
    </div>
  );
}
