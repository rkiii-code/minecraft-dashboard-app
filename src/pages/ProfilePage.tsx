import React, { useEffect, useState } from 'react';
import { Avatar } from '../components/Avatar';
import { Card } from '../components/Card';
import { useAsync } from '../hooks/useAsync';
import { getProfileMe } from '../lib/api';
import type { Profile } from '../lib/types';

type FormState = Pick<Profile, 'displayName' | 'bio' | 'avatarUrl'>;

export function ProfilePage() {
  const { data: profile } = useAsync(getProfileMe, []);
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
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!profile) return <div className="muted">読み込み中...</div>;

  return (
    <div className="grid" style={{ gap: 16 }}>
      <div>
        <h1 className="page-title">Profile</h1>
        <p className="page-subtitle">公開プロフィールとアバター。未設定ならデフォルトのしまえながを使用します。</p>
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
                ひとこと (140 文字)
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
                アバター URL (未入力ならデフォルト)
              </label>
              <input
                id="avatar"
                className="input"
                placeholder="https://example.com/avatar.png"
                value={form.avatarUrl}
                onChange={(e) => setForm((f) => ({ ...f, avatarUrl: e.target.value }))}
              />
            </div>
            {saved && <div className="surface-muted">保存しました（モック）</div>}
            <button className="btn btn-primary" type="submit">
              保存
            </button>
          </form>
        </Card>

        <Card title="プレビュー" subtitle="公開プロフィールの見え方">
          <div className="glass-card" style={{ padding: 16, display: 'grid', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Avatar name={form.displayName || profile.username} url={form.avatarUrl} size={70} />
              <div>
                <div style={{ fontWeight: 800 }}>{form.displayName || profile.username}</div>
                <div className="hint">@{profile.username}</div>
              </div>
            </div>
            <div className="surface-muted">{form.bio || 'ひとこと未設定。デフォルトアバターが表示されます。'}</div>
            <div className="chip">role: {profile.role}</div>
          </div>
        </Card>
      </div>
    </div>
  );
}
