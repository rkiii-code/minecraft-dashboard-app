import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { LogoMark } from '../components/LogoMark';
import { Avatar } from '../components/Avatar';
import { StatusBadge } from '../components/StatusBadge';
import { useAuth } from '../context/AuthContext';

type AppLayoutProps = {
  children: React.ReactNode;
};

const NAV_LINKS = [
  { to: '/dashboard', label: 'ダッシュボード' },
  { to: '/players', label: 'プレイヤー' },
  { to: '/metrics', label: 'メトリクス' },
  { to: '/admin/metrics', label: '管理', requiredRole: 'admin' as const },
  { to: '/profile', label: 'プロフィール' },
];

export function AppLayout({ children }: AppLayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // ユーザーのロールに基づいてナビゲーションリンクをフィルタリング
  const visibleLinks = NAV_LINKS.filter((link) => {
    if (!link.requiredRole) return true;
    return user?.role === link.requiredRole;
  });

  return (
    <div className="app-shell">
      <nav className="navbar">
        <Link className="nav-brand" to="/dashboard" aria-label="Minecraft dashboard home">
          <LogoMark size={40} />
          <div>
            <div style={{ fontSize: 15, lineHeight: 1.1 }}>Shimaenaga Ops</div>
            <div className="tagline">Minecraft monitoring</div>
          </div>
        </Link>
        <div className="nav-links">
          {visibleLinks.map((item) => (
            <NavLink
              key={item.to}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              to={item.to}
            >
              {item.label}
            </NavLink>
          ))}
        </div>
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 4,
              borderRadius: 8,
            }}
            aria-label="ユーザーメニュー"
          >
            <StatusBadge online label="オンライン" />
            <Avatar name={user?.username || 'user'} size={42} />
          </button>
          {showDropdown && (
            <>
              <div
                style={{
                  position: 'fixed',
                  inset: 0,
                  zIndex: 99,
                }}
                onClick={() => setShowDropdown(false)}
              />
              <div
                className="card"
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: 8,
                  minWidth: 180,
                  padding: 0,
                  zIndex: 100,
                  overflow: 'hidden',
                }}
              >
                <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ fontWeight: 600 }}>{user?.displayName || user?.username}</div>
                  <div className="text-muted" style={{ fontSize: 12 }}>
                    {user?.role === 'admin' ? '管理者' : 'ユーザー'}
                  </div>
                </div>
                <Link
                  to="/profile"
                  className="dropdown-item"
                  style={{
                    display: 'block',
                    padding: '10px 16px',
                    textDecoration: 'none',
                    color: 'inherit',
                  }}
                  onClick={() => setShowDropdown(false)}
                >
                  プロフィール
                </Link>
                <button
                  onClick={handleLogout}
                  style={{
                    display: 'block',
                    width: '100%',
                    textAlign: 'left',
                    padding: '10px 16px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--accent-brown)',
                    fontWeight: 500,
                  }}
                >
                  ログアウト
                </button>
              </div>
            </>
          )}
        </div>
      </nav>
      {children}
    </div>
  );
}
