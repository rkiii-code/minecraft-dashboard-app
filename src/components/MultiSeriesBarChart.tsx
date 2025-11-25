import React, { useMemo } from 'react';

type Sample = { date: string; value: number };
export type Series = { name: string; samples: Sample[] };

type Props = {
  series: Series[];
  height?: number;
  loading?: boolean;
  unit?: string;
};

const COLORS = ['#2c7be5', '#8b6b4a', '#4fb3ff', '#10b981', '#f59e0b', '#ef4444', '#6366f1', '#f97316'];

function formatShort(date: string) {
  return new Intl.DateTimeFormat('ja-JP', { month: 'numeric', day: 'numeric' }).format(new Date(date));
}

export function MultiSeriesBarChart({ series, height = 260, loading, unit = '' }: Props) {
  const dates = useMemo(() => {
    const allDates = new Set<string>();
    series.forEach((row) => row.samples.forEach((s) => allDates.add(s.date)));
    return Array.from(allDates).sort();
  }, [series]);

  const max = useMemo(() => {
    if (dates.length === 0) return 0;
    return Math.max(...series.flatMap((row) => row.samples.map((s) => s.value)), 1);
  }, [dates.length, series]);

  const yTicks = useMemo(() => {
    const tickCount = 5;
    return Array.from({ length: tickCount }, (_, i) => {
      const ratio = i / Math.max(1, tickCount - 1);
      const value = Math.round(max * ratio);
      const y = 100 - ratio * 90;
      return { value, y };
    });
  }, [max]);

  const xLabels = useMemo(() => {
    const labelCount = Math.min(5, dates.length);
    if (labelCount === 0) return [];
    return Array.from({ length: labelCount }, (_, i) => {
      const idx = labelCount === 1 ? 0 : Math.round((dates.length - 1) * (i / (labelCount - 1)));
      return { date: dates[idx], label: formatShort(dates[idx]) };
    });
  }, [dates]);

  if (loading) return <div className="muted">読み込み中...</div>;
  if (!series || series.length === 0) return <div className="muted">まだデータがありません</div>;
  if (dates.length === 0) return <div className="muted">日付データがありません</div>;

  const bandWidth = 100 / dates.length;
  const barWidth = bandWidth / (series.length + 1);

  const bars = dates.flatMap((date, dateIdx) =>
    series.map((row, seriesIdx) => {
      const value = row.samples.find((s) => s.date === date)?.value ?? 0;
      const x = dateIdx * bandWidth + seriesIdx * barWidth + barWidth * 0.2;
      const heightPct = (value / max) * 90;
      const y = 100 - heightPct;
      return {
        key: `${row.name}-${date}`,
        x,
        y,
        width: barWidth * 0.6,
        height: heightPct,
        color: COLORS[seriesIdx % COLORS.length],
        value,
        date,
      };
    }),
  );

  return (
    <div className="playtime-chart" style={{ gap: 12 }}>
      <div className="chart-meta" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
        <div>
          <div className="muted label">期間</div>
          <div className="chart-value">
            {formatShort(dates[0])} → {formatShort(dates[dates.length - 1])}
          </div>
          <div className="hint">日次サンプル</div>
        </div>
        <div>
          <div className="muted label">シリーズ</div>
          <div className="chart-value">{series.length} 件</div>
          <div className="hint">凡例を参照</div>
        </div>
        <div>
          <div className="muted label">最大値</div>
          <div className="chart-value">
            {max.toLocaleString()} {unit}
          </div>
          <div className="hint">期間内の 1 日あたり</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '64px 1fr', gap: 8, alignItems: 'stretch' }}>
        <div
          style={{
            display: 'grid',
            alignContent: 'space-between',
            height,
            fontSize: 12,
            color: '#6b7280',
          }}
        >
          {yTicks
            .slice()
            .reverse()
            .map((tick) => (
              <div key={tick.value} style={{ textAlign: 'right' }}>
                {tick.value.toLocaleString()}
                {unit ? ` ${unit}` : ''}
              </div>
            ))}
        </div>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: '100%', height }}>
          <line x1="0" y1="100" x2="100" y2="100" stroke="#e5e7eb" strokeWidth="0.6" />
          {yTicks.map((tick) => (
            <line
              key={`grid-${tick.value}`}
              x1="0"
              y1={tick.y}
              x2="100"
              y2={tick.y}
              stroke="#e5e7eb"
              strokeWidth="0.3"
              opacity={0.6}
            />
          ))}
          {bars.map((bar) => (
            <g key={bar.key}>
              <rect x={bar.x} y={bar.y} width={bar.width} height={bar.height} fill={bar.color} opacity={0.82} rx="0.8" />
            </g>
          ))}
        </svg>
      </div>

      {xLabels.length > 0 && (
        <div className="chart-footer" style={{ justifyContent: 'space-between' }}>
          {xLabels.map((label) => (
            <span key={label.date}>{label.label}</span>
          ))}
        </div>
      )}

      <div className="inline-list" style={{ flexWrap: 'wrap', rowGap: 6 }}>
        {series.map((row, idx) => {
          const latest = row.samples[row.samples.length - 1];
          return (
            <span key={row.name} className="pill" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
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
              {row.name} {latest ? `(${latest.value.toLocaleString()}${unit ? ` ${unit}` : ''})` : ''}
            </span>
          );
        })}
      </div>
    </div>
  );
}
