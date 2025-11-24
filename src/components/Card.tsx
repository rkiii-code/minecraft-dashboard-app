import React from 'react';
import clsx from 'clsx';

type CardProps = {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

export function Card({ title, subtitle, action, children, className }: CardProps) {
  return (
    <section className={clsx('card', className)}>
      {(title || subtitle || action) && (
        <header className="card-header">
          <div>
            {title && <h3 className="card-title">{title}</h3>}
            {subtitle && <p className="card-meta">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </header>
      )}
      <div>{children}</div>
    </section>
  );
}
