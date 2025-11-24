import React from 'react';

type MetricBarProps = {
  label: string;
  value: number;
  unit?: string;
  percent: number;
  caption?: string;
};

export function MetricBar({ label, value, unit, percent, caption }: MetricBarProps) {
  const clamped = Math.min(100, Math.max(0, percent));

  return (
    <div style={{ display: 'grid', gap: 6 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div style={{ fontWeight: 700 }}>{label}</div>
        <div style={{ color: '#0f172a', fontWeight: 800 }}>
          {value.toLocaleString()}
          {unit ? ` ${unit}` : ''}
        </div>
      </div>
      <div className="meter" aria-hidden="true">
        <div className="meter-fill" style={{ width: `${clamped}%` }} />
      </div>
      {caption && <div className="hint">{caption}</div>}
    </div>
  );
}
