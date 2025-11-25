import React from 'react';
import type { PlaytimeSample } from '../lib/types';

type Props = {
  samples: PlaytimeSample[];
  height?: number;
  loading?: boolean;
};

function formatShort(date: string) {
  return new Intl.DateTimeFormat('ja-JP', { month: 'numeric', day: 'numeric' }).format(new Date(date));
}

export function PlaytimeChart({ samples, height = 140, loading }: Props) {
  if (loading) {
    return <div className="muted">読み込み中...</div>;
  }

  if (!samples || samples.length === 0) {
    return <div className="muted">まだプレイ時間の履歴がありません</div>;
  }

  const max = Math.max(...samples.map((s) => s.minutes), 1);
  const last = samples[samples.length - 1];
  const avg = Math.round(samples.reduce((sum, s) => sum + s.minutes, 0) / samples.length);
  const points = samples.map((s, idx) => {
    const x = samples.length === 1 ? 100 : (idx / (samples.length - 1)) * 100;
    const y = 100 - (s.minutes / max) * 90;
    return `${x},${y}`;
  });
  const areaPath = `M0,100 L ${points.join(' ')} L100,100 Z`;

  return (
    <div className="playtime-chart">
      <div className="chart-meta">
        <div>
          <div className="muted label">最新</div>
          <div className="chart-value">{last.minutes} min</div>
          <div className="hint">{formatShort(last.date)}</div>
        </div>
        <div>
          <div className="muted label">平均</div>
          <div className="chart-value">{avg} min</div>
          <div className="hint">期間内の1日あたり</div>
        </div>
        <div>
          <div className="muted label">最大</div>
          <div className="chart-value">{max} min</div>
          <div className="hint">この期間内</div>
        </div>
      </div>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: '100%', height }}>
        <defs>
          <linearGradient id="playtimeFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#8ac7f6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#b7e1ff" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#playtimeFill)" opacity={0.9} />
        <polyline
          points={points.join(' ')}
          fill="none"
          stroke="#2c7be5"
          strokeWidth={1.4}
          strokeLinejoin="round"
        />
        {samples.map((s, idx) => {
          const x = samples.length === 1 ? 100 : (idx / (samples.length - 1)) * 100;
          const y = 100 - (s.minutes / max) * 90;
          return <circle key={s.date} cx={x} cy={y} r={1.6} fill="#114b8b" opacity={0.9} />;
        })}
      </svg>
      <div className="chart-footer">
        <span>{formatShort(samples[0].date)}</span>
        <span>{formatShort(last.date)}</span>
      </div>
    </div>
  );
}
