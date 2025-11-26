import React from 'react';
import { useParams } from 'react-router-dom';
import { Avatar } from '../components/Avatar';
import { Card } from '../components/Card';
import { useAsync } from '../hooks/useAsync';
import { getUserProfile } from '../lib/api';

export function UserProfilePage() {
  const { id } = useParams();
  const profileId = Number(id);
  const { data: profile, loading } = useAsync(() => getUserProfile(profileId), [profileId]);

  if (!Number.isFinite(profileId)) return <div className="muted">無効な ID</div>;
  if (loading) return <div className="muted">読み込み中...</div>;
  if (!profile) return <div className="muted">プロフィールが見つかりません</div>;

  return (
    <div className="grid" style={{ gap: 16 }}>
      <div>
        <h1 className="page-title">{profile.displayName || profile.username}</h1>
        <p className="page-subtitle">公開プロフィール（他ユーザー視点）</p>
      </div>
      <Card title="プロフィール">
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Avatar name={profile.displayName || profile.username} url={profile.avatarUrl} size={70} />
          <div>
            <div style={{ fontWeight: 800 }}>{profile.displayName || profile.username}</div>
            <div className="hint">@{profile.username}</div>
          </div>
        </div>
        <div className="divider" />
        <div className="surface-muted">{profile.bio || 'ひとこと未設定'}</div>
      </Card>
    </div>
  );
}
