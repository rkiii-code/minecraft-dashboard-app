import React, { useMemo } from 'react';
import type { PlaytimeSeries } from '../lib/types';

type Props = {
  series: PlaytimeSeries[];
  height?: number;
  loading?: boolean;
};

const COLORS = ['#2c7be5', '#8b6b4a', '#4fb3ff', '#10b981', '#f59e0b', '#ef4444', '#6366f1', '#f97316'];

function formatShort(date: string) {
  return new Intl.DateTimeFormat('ja-JP', { month: 'numeric', day: 'numeric' }).format(new Date(date));
}

export function MultiPlaytimeChart({ series, height = 220, loading }: Props) {
  const dates = useMemo(() => {
    const allDates = new Set<string>();
    series.forEach((row) => row.samples.forEach((s) => allDates.add(s.date)));
    return Array.from(allDates).sort();
  }, [series]);

  const max = useMemo(() => {
    if (dates.length === 0) return 0;
    return Math.max(
      ...series.flatMap((row) => row.samples.map((s) => s.minutes)),
      1,
    );
  }, [dates.length, series]);

  if (loading) return <div className="muted">読み込み中...</div>;
  if (!series || series.length === 0) return <div className="muted">まだプレイ時間の履歴がありません</div>;
  if (dates.length === 0) return <div className="muted">日付データがありません</div>;

  const renderLine = (samples: Record<string, number>) => {
    const points = dates.map((date, idx) => {
      const value = samples[date] ?? 0;
      const x = dates.length === 1 ? 100 : (idx / (dates.length - 1)) * 100;
      const y = 100 - (value / max) * 90;
      return `${x},${y}`;
    });
    return points;
  };

  return (
    <div className="playtime-chart" style={{ gap: 12 }}>
      <div className="chart-meta" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
        <div>
          <div className="muted label">期間</div>
          <div className="chart-value">{formatShort(dates[0])} → {formatShort(dates[dates.length - 1])}</div>
          <div className="hint">日次プレイ分数</div>
        </div>
        <div>
          <div className="muted label">プレイヤー</div>
          <div className="chart-value">{series.length} 人</div>
          <div className="hint">凡例を参照</div>
        </div>
        <div>
          <div className="muted label">最大値</div>
          <div className="chart-value">{max.toLocaleString()} min</div>
          <div className="hint">期間内の 1 日あたり</div>
        </div>
      </div>

      <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: '100%', height }}>
        <defs>
          {series.map((row, idx) => (
            <linearGradient key={row.player.id} id={`mp-fill-${row.player.id}`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={COLORS[idx % COLORS.length]} stopOpacity="0.25" />
              <stop offset="100%" stopColor={COLORS[idx % COLORS.length]} stopOpacity="0.05" />
            </linearGradient>
          ))}
        </defs>
        {series.map((row, idx) => {
          const samplesByDate: Record<string, number> = {};
          row.samples.forEach((s) => {
            samplesByDate[s.date] = s.minutes;
          });
          const points = renderLine(samplesByDate);
          const color = COLORS[idx % COLORS.length];
          return (
            <g key={row.player.id}>
              <path
                d={`M0,100 L ${points.join(' ')} L100,100 Z`}
                fill={`url(#mp-fill-${row.player.id})`}
                opacity={0.8}
              />
              <polyline
                points={points.join(' ')}
                fill="none"
                stroke={color}
                strokeWidth={1.4}
                strokeLinejoin="round"
              />
              {points.map((point, i) => {
                const [x, y] = point.split(',').map(Number);
                return <circle key={`${row.player.id}-${i}`} cx={x} cy={y} r={1.5} fill={color} opacity={0.9} />;
              })}
            </g>
          );
        })}
      </svg>

      <div className="inline-list" style={{ flexWrap: 'wrap', rowGap: 6 }}>
        {series.map((row, idx) => {
          const latest = row.samples[row.samples.length - 1];
          return (
            <span key={row.player.id} className="pill" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span
                aria-hidden="true"
                style={{
                  width: 10,
                  height: 10,
                  background: COLORS[idx % COLORS.length],
                  borderRadius: 999,
                  display: 'inline-block',
                }}
              />
              {row.player.name} ({latest ? `${latest.minutes} min` : 'データなし'})
            </span>
          );
        })}
      </div>
    </div>
  );
}
