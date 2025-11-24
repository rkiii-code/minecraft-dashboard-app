import React from 'react';
import clsx from 'clsx';

type AvatarProps = {
  name: string;
  url?: string;
  size?: number;
  badge?: React.ReactNode;
  bordered?: boolean;
};

const DEFAULT_AVATAR = '/assets/default.jpg';

function stringToHue(input: string) {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = input.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % 360;
}

export function Avatar({ name, url, size = 48, badge, bordered = true }: AvatarProps) {
  const hue = stringToHue(name);
  const outline = `linear-gradient(135deg, hsl(${hue}, 65%, 78%), hsl(${(hue + 30) % 360}, 70%, 68%))`;
  const imageSize = size - 6;

  return (
    <div
      className={clsx('avatar', bordered && 'avatar-bordered')}
      style={{
        position: 'relative',
        width: size,
        height: size,
        borderRadius: '18%',
        padding: bordered ? 3 : 0,
        background: bordered ? outline : undefined,
        boxShadow: bordered ? '0 6px 18px rgba(17, 24, 39, 0.12)' : undefined,
      }}
    >
      <img
        src={url || DEFAULT_AVATAR}
        alt={name}
        style={{
          width: imageSize,
          height: imageSize,
          borderRadius: '16%',
          objectFit: 'cover',
          border: '1px solid rgba(226, 232, 240, 0.85)',
          background: '#fff',
        }}
      />
      {badge && (
        <span
          style={{
            position: 'absolute',
            bottom: -2,
            right: -2,
            transform: 'translate(10%, 10%)',
          }}
        >
          {badge}
        </span>
      )}
    </div>
  );
}
