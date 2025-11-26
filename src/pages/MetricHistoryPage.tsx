import React, { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Card } from '../components/Card';
import { MultiSeriesBarChart } from '../components/MultiSeriesBarChart';
import { useAsync } from '../hooks/useAsync';
import { getMetricHistory, getMetrics } from '../lib/api';
import type { Metric, MetricHistorySeries } from '../lib/types';

type Resolution = 'day' | 'week' | 'month';
const DAYS_BY_RESOLUTION: Record<Resolution, number> = {
  day: 14,
  week: 90,
  month: 365,
};

function aggregate(samples: { date: string; value: number }[], resolution: Resolution) {
  if (resolution === 'day') return samples;
  const buckets = new Map<string, number>();
  samples.forEach((s) => {
    const d = new Date(s.date);
    let key: string;
    if (resolution === 'week') {
      const monday = new Date(d);
      const day = monday.getDay();
      const diff = (day === 0 ? -6 : 1) - day;
      monday.setDate(d.getDate() + diff);
      key = monday.toISOString().slice(0, 10);
    } else {
      key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
    }
    buckets.set(key, (buckets.get(key) ?? 0) + s.value);
  });
  return Array.from(buckets.entries())
    .map(([date, value]) => ({ date, value }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function MetricHistoryPage({ objectiveName }: { objectiveName?: string }) {
  const params = useParams();
  const metricKey = params.id;
  const [resolution, setResolution] = useState<Resolution>('day');
  const { data: metrics } = useAsync(getMetrics, []);

  const targetMetric: Metric | undefined = useMemo(() => {
    if (!metrics) return undefined;
    const key = objectiveName || metricKey;
    if (!key) return undefined;
    const numeric = Number(key);
    if (Number.isFinite(numeric)) {
      return metrics.find((m) => m.id === numeric);
    }
    return metrics.find((m) => m.objectiveName === key);
  }, [metrics, metricKey, objectiveName]);

  const metricId = targetMetric?.id;
  const days = DAYS_BY_RESOLUTION[resolution];
  const { data: series, loading } = useAsync<MetricHistorySeries[]>(
    () => (metricId ? getMetricHistory(metricId, days) : Promise.resolve([])),
    [metricId, days],
  );

  const handleResolutionChange = (next: Resolution) => {
    if (next === resolution) return;
    setResolution(next);
  };

  const aggregated = useMemo(
    () =>
      (series || []).map((row) => ({
        name: row.player.name,
        samples: aggregate(
          row.samples.map((s) => ({ date: s.date, value: s.value })),
          resolution,
        ),
      })),
    [series, resolution],
  );

  return (
    <div className="grid" style={{ gap: 16 }}>
      <div style={{ textAlign: 'center' }}>
        <h1 className="page-title">{targetMetric ? `${targetMetric.displayName} の履歴` : 'メトリクス履歴'}</h1>
        <p className="page-subtitle">プレイヤーごとの推移をまとめて表示します。</p>
        <div className="inline-list" style={{ marginTop: 10, justifyContent: 'center' }}>
          <Link to="/dashboard" className="pill">
            ダッシュボードへ戻る
          </Link>
          <Link to="/metrics/playtime" className="pill">
            プレイ時間全体
          </Link>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Card
          title={targetMetric ? `${targetMetric.displayName} / ${targetMetric.unit}` : 'メトリクス履歴'}
          subtitle={`${resolution === 'day' ? '日次(2週)' : resolution === 'week' ? '週次(3ヶ月)' : '月次(1年)'}`}
          action={
            <div className="inline-list">
              {(['day', 'week', 'month'] as Resolution[]).map((value) => (
                <button
                  key={value}
                  className={`btn ${resolution === value ? 'btn-primary' : 'btn-ghost'}`}
                  type="button"
                  onClick={() => handleResolutionChange(value)}
                >
                  {value === 'day' ? '日次' : value === 'week' ? '週次' : '月次'}
                </button>
              ))}
            </div>
          }
          className="glass-card"
        >
          <MultiSeriesBarChart
            series={aggregated}
            loading={loading}
            height={360}
            unit={targetMetric?.unit}
          />
        </Card>
      </div>
    </div>
  );
}
