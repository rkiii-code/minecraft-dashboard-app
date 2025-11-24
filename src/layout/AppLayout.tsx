import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { LogoMark } from '../components/LogoMark';
import { Avatar } from '../components/Avatar';
import { StatusBadge } from '../components/StatusBadge';

type AppLayoutProps = {
  children: React.ReactNode;
};

const NAV_LINKS = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/players', label: 'Players' },
  { to: '/admin/metrics', label: 'Admin' },
  { to: '/profile', label: 'Profile' },
];

export function AppLayout({ children }: AppLayoutProps) {
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
          {NAV_LINKS.map((item) => (
            <NavLink
              key={item.to}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              to={item.to}
            >
              {item.label}
            </NavLink>
          ))}
        </div>
        <Link to="/profile" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <StatusBadge online label="online" />
          <Avatar name="admin" size={42} />
        </Link>
      </nav>
      {children}
    </div>
  );
}
