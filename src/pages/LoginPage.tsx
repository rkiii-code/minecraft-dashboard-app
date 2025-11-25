import React, { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { LogoMark } from '../components/LogoMark';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // リダイレクト元のパスを取得
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';

  // 既にログイン済みの場合はリダイレクト
  if (authLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
        <div className="card" style={{ textAlign: 'center', padding: 32 }}>
          <div className="spinner" style={{ marginBottom: 16 }} />
          <p>読み込み中...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(username, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ログインに失敗しました');
    } finally {
      setLoading(false);
    }
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
            <h1 className="page-title">フロントのデモログイン</h1>
            <p className="page-subtitle">
              ログインするとサーバー状況やプレイヤーのスコアを確認できます。
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
                モックログインです。任意のユーザー名とパスワードでダッシュボードに遷移します。
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
