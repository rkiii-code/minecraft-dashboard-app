import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/Card';
import { MultiSeriesBarChart } from '../components/MultiSeriesBarChart';
import { useAsync } from '../hooks/useAsync';
import { getPlaytimeDailyAll } from '../lib/api';
import type { PlaytimeSeries } from '../lib/types';

type Resolution = 'day' | 'week' | 'month';
const DAYS_BY_RESOLUTION: Record<Resolution, number> = {
  day: 14, // 1日単位は約2週間
  week: 90, // 週単位で約3ヶ月分(12〜13週分の日数を取得)
  month: 365, // 月単位で約1年
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
      const diff = (day === 0 ? -6 : 1) - day; // Monday start
      monday.setDate(d.getDate() + diff);
      key = monday.toISOString().slice(0, 10);
    } else {
      // month
      key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
    }
    buckets.set(key, (buckets.get(key) ?? 0) + s.value);
  });
  return Array.from(buckets.entries())
    .map(([date, value]) => ({ date, value }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function PlaytimeOverviewPage() {
  const [resolution, setResolution] = useState<Resolution>('day');
  const days = DAYS_BY_RESOLUTION[resolution];
  const { data: series, loading } = useAsync<PlaytimeSeries[]>(() => getPlaytimeDailyAll(days), [days]);

  const handleResolutionChange = (next: Resolution) => {
    if (next === resolution) return;
    setResolution(next);
  };

  const aggregated = useMemo(
    () =>
      (series || []).map((row) => ({
        name: row.player.name,
        samples: aggregate(
          row.samples.map((s) => ({ date: s.date, value: s.minutes })),
          resolution,
        ),
      })),
    [series, resolution],
  );

  return (
    <div className="grid" style={{ gap: 16 }}>
      <div style={{ textAlign: 'center' }}>
        <h1 className="page-title">プレイ時間の詳細</h1>
        <p className="page-subtitle">全プレイヤーのプレイ時間の推移を確認できます。</p>
        <div className="inline-list" style={{ marginTop: 10, justifyContent: 'center' }}>
          <Link to="/dashboard" className="pill">
            ダッシュボードへ戻る
          </Link>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Card
          title="日次プレイ時間（全体）"
          subtitle={`${resolution === 'day' ? '日' : resolution === 'week' ? '週' : '月'} 単位`}
          action={
            <div className="inline-list">
              {(['day', 'week', 'month'] as Resolution[]).map((value) => (
                <button
                  key={value}
                  className={`btn ${resolution === value ? 'btn-primary' : 'btn-ghost'}`}
                  type="button"
                  onClick={() => handleResolutionChange(value)}
                >
                  {value === 'day' ? '日次 (2週)' : value === 'week' ? '週次 (3ヶ月)' : '月次 (1年)'}
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
            unit="min"
          />
        </Card>
      </div>
    </div>
  );
}
