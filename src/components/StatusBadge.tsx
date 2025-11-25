import React from 'react';
import clsx from 'clsx';

type StatusBadgeProps = {
  online: boolean;
  label?: string;
};

export function StatusBadge({ online, label }: StatusBadgeProps) {
  return (
    <span
      className={clsx('pill', online ? 'status-online' : 'status-offline')}
      title={online ? 'オンライン' : 'オフライン'}
    >
      <span
        className="badge-dot"
        style={{
          background: online ? '#12a150' : '#9ca3af',
        }}
      />
      {label || (online ? 'オンライン' : 'オフライン')}
    </span>
  );
}
