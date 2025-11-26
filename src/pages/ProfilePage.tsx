import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar } from '../components/Avatar';
import { Card } from '../components/Card';
import { PlaytimeChart } from '../components/PlaytimeChart';
import { useAsync } from '../hooks/useAsync';
import { getPlayerPlaytimeDaily, getProfileMe } from '../lib/api';
import type { PlaytimeDaily } from '../lib/types';

type FormState = {
  displayName: string;
  bio: string;
  avatarUrl: string;
};

export function ProfilePage() {
  const { data: profile, loading: profileLoading } = useAsync(getProfileMe, []);
  const { data: playtime, loading: playtimeLoading } = useAsync<PlaytimeDaily | null>(
    () => (profile ? getPlayerPlaytimeDaily(profile.id, 14) : Promise.resolve(null)),
    [profile?.id],
  );
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>({ displayName: '', bio: '', avatarUrl: '' });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (profile) {
      setForm({
        displayName: profile.displayName,
        bio: profile.bio || '',
        avatarUrl: profile.avatarUrl || '',
      });
    }
  }, [profile]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // プロフィール更新API呼び出し
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (profileLoading || !profile) return <div className="muted">プロフィールを読み込み中...</div>;

  return (
    <div className="grid" style={{ gap: 16 }}>
      <div>
        <h1 className="page-title">プロフィール</h1>
        <p className="page-subtitle">表示名・ひとこと・アバターを更新できます。</p>
      </div>

      <div className="card-grid">
        <Card title="編集" subtitle="表示名 / ひとこと / アバター URL">
          <form onSubmit={handleSubmit} className="grid" style={{ gap: 12 }}>
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
              <label className="label" htmlFor="bio">
                ひとこと (140 文字まで)
              </label>
              <textarea
                id="bio"
                className="input"
                maxLength={140}
                rows={3}
                value={form.bio}
                onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
              />
              <div className="hint">{form.bio.length} / 140</div>
            </div>
            <div>
              <label className="label" htmlFor="avatar">
                アバター URL (空ならデフォルトを使用)
              </label>
              <input
                id="avatar"
                className="input"
                placeholder="https://example.com/avatar.png"
                value={form.avatarUrl}
                onChange={(e) => setForm((f) => ({ ...f, avatarUrl: e.target.value }))}
              />
            </div>
            {saved && <div className="surface-muted">保存しました (mock)</div>}
            <button className="btn btn-primary" type="submit">
              保存する
            </button>
          </form>
        </Card>

        <Card title="プレビュー" subtitle="公開時の見え方">
          <div className="glass-card" style={{ padding: 16, display: 'grid', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Avatar name={form.displayName || profile.username} url={form.avatarUrl} size={70} />
              <div>
                <div style={{ fontWeight: 800 }}>{form.displayName || profile.username}</div>
                <div className="hint">@{profile.username}</div>
              </div>
            </div>
            <div className="surface-muted">{form.bio || 'ひとこと未設定'}</div>
            <div className="chip">role: {profile.role}</div>
            <button className="btn btn-primary" type="button" onClick={() => navigate(`/players/${profile.id}`)}>
              自分のプレイヤーダッシュボードへ
            </button>
          </div>
        </Card>

        <Card title="プレイ時間の推移" subtitle="scoreboard play_time から日次集計 (14 日間)">
          <PlaytimeChart samples={playtime?.samples ?? []} loading={playtimeLoading} />
        </Card>
      </div>
    </div>
  );
}
