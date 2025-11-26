import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

type ProtectedRouteProps = {
  children: React.ReactNode;
  requiredRole?: 'user' | 'admin';
};

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  // 認証状態の読み込み中
  if (isLoading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
        }}
      >
        <div className="card" style={{ textAlign: 'center', padding: 32 }}>
          <div className="spinner" style={{ marginBottom: 16 }} />
          <p>認証を確認中...</p>
        </div>
      </div>
    );
  }

  // 未認証の場合はログインページへリダイレクト
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // ロールが必要な場合のチェック
  if (requiredRole && user?.role !== requiredRole) {
    // admin が必要だが user の場合
    if (requiredRole === 'admin' && user?.role === 'user') {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'grid',
            placeItems: 'center',
          }}
        >
          <div className="card" style={{ textAlign: 'center', padding: 32 }}>
            <h2 style={{ color: 'var(--accent-brown)', marginBottom: 12 }}>
              アクセス権限がありません
            </h2>
            <p className="text-muted">このページは管理者のみアクセスできます。</p>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
}
