import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogoMark } from '../components/LogoMark';

export function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setTimeout(() => {
      setLoading(false);
      if (!username || !password) {
        setError('ユーザー名とパスワードを入力してください');
        return;
      }
      navigate('/dashboard');
    }, 300);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        padding: '32px 20px',
      }}
    >
      <div className="card" style={{ width: 'min(960px, 100%)', padding: 0 }}>
        <div className="hero" style={{ gridTemplateColumns: '1.1fr 0.9fr' }}>
          <div>
            <div className="nav-brand" style={{ marginBottom: 14 }}>
              <LogoMark size={52} />
              <div>
                <div style={{ fontSize: 18, fontWeight: 800 }}>Shimaenaga Ops</div>
                <p className="tagline">Minecraft Server Monitor</p>
              </div>
            </div>
            <h1 className="page-title">いったんフロントだけ作ろう</h1>
            <p className="page-subtitle">
              ログインするとサーバー状況やプレイヤーのスコアをリアルタイムで確認できます。
              Cloudflare Pages から Go API を叩くシンプル構成です。
            </p>
            <ul className="inline-list" style={{ marginTop: 16 }}>
              <li className="chip">JWT / admin, user ロール</li>
              <li className="chip">RCON 経由で scoreboard 取得</li>
              <li className="chip">しまえながテーマ</li>
            </ul>
          </div>
          <div className="glass-card" style={{ padding: 18 }}>
            <form onSubmit={handleSubmit} className="grid" style={{ gap: 12 }}>
              <div>
                <label className="label" htmlFor="username">
                  ユーザー名
                </label>
                <input
                  id="username"
                  className="input"
                  placeholder="sun5un"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                />
              </div>
              <div>
                <label className="label" htmlFor="password">
                  パスワード
                </label>
                <input
                  id="password"
                  className="input"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </div>
              {error && (
                <div className="surface-muted" style={{ color: '#8b6b4a', fontWeight: 600 }}>
                  {error}
                </div>
              )}
              <button className="btn btn-primary" type="submit" disabled={loading}>
                {loading ? '接続中...' : 'ログイン'}
              </button>
              <div className="hint">
                モックログインです。任意のユーザー名/パスワードでダッシュボードに遷移します。
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
