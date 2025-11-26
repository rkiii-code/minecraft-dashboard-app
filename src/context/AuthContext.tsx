import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { findMockUser } from '../data/mock';

export type AuthUser = {
  id: number;
  username: string;
  displayName: string;
  role: 'user' | 'admin';
  avatarUrl?: string;
};

type AuthContextType = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 初期化時にローカルストレージから認証情報を復元
  useEffect(() => {
    const storedUser = localStorage.getItem(USER_KEY);
    const storedToken = localStorage.getItem(TOKEN_KEY);
    
    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser) as AuthUser;
        setUser(parsedUser);
      } catch {
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(TOKEN_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    // API_BASE_URL から実際のログインAPIを呼び出す
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
    const USE_MOCK = (import.meta.env.VITE_USE_MOCK ?? 'true') !== 'false';

    if (USE_MOCK) {
      // モックログイン
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      if (!username || !password) {
        throw new Error('ユーザー名とパスワードを入力してください');
      }

      // mock.ts から定義済みユーザーを検索
      const foundUser = findMockUser(username, password);
      
      if (!foundUser) {
        throw new Error('ユーザー名またはパスワードが正しくありません');
      }

      // 認証ユーザーデータを作成
      const authUser: AuthUser = {
        id: foundUser.id,
        username: foundUser.username,
        displayName: foundUser.displayName,
        role: foundUser.role,
        avatarUrl: foundUser.avatarUrl || `https://api.dicebear.com/7.x/adventurer/svg?seed=${foundUser.username}`,
      };

      const mockToken = `mock_jwt_token_${Date.now()}`;
      
      localStorage.setItem(TOKEN_KEY, mockToken);
      localStorage.setItem(USER_KEY, JSON.stringify(authUser));
      setUser(authUser);
      return;
    }

    // 実際のAPI呼び出し
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'ログインに失敗しました');
    }

    const data = await response.json();
    const { token, user: userData } = data;

    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    setUser(userData);
  }, []);

  const logout = useCallback(async () => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
    const USE_MOCK = (import.meta.env.VITE_USE_MOCK ?? 'true') !== 'false';
    const token = localStorage.getItem(TOKEN_KEY);

    if (!USE_MOCK && token) {
      try {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      } catch {
        // ログアウトAPIのエラーは無視
      }
    }

    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
    const USE_MOCK = (import.meta.env.VITE_USE_MOCK ?? 'true') !== 'false';
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
      setUser(null);
      return;
    }

    if (USE_MOCK) {
      // モック時は既存のユーザー情報を維持
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('認証が無効です');
      }

      const userData = await response.json();
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
      setUser(userData);
    } catch {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// トークン取得用のヘルパー
export function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

// 認証付きfetchのヘルパー
export async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  const token = getAuthToken();
  const headers = new Headers(options.headers);
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  return fetch(url, {
    ...options,
    headers,
  });
}
