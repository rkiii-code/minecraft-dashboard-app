import React from 'react';

type LogoMarkProps = {
  size?: number;
};

export function LogoMark({ size = 44 }: LogoMarkProps) {
  const bodySize = size * 0.62;
  const branchHeight = Math.max(4, size * 0.1);

  return (
    <div
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: 'linear-gradient(145deg, #ffffff, #eaf5ff)',
        border: '2px solid #d7eaff',
        position: 'relative',
        boxShadow: '0 10px 28px rgba(55, 110, 164, 0.18)',
        display: 'grid',
        placeItems: 'center',
      }}
    >
      <div
        style={{
          width: bodySize,
          height: bodySize,
          borderRadius: '46% 54% 52% 48%',
          background: 'linear-gradient(160deg, #fdfdfd, #eef5ff)',
          border: '2px solid #d7eaff',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: bodySize * 0.3,
            left: bodySize * 0.58,
            width: bodySize * 0.22,
            height: bodySize * 0.18,
            borderRadius: '50%',
            background: '#1f2937',
            boxShadow: `-${bodySize * 0.42}px 0 0 #1f2937`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: bodySize * 0.12,
            right: bodySize * 0.18,
            width: bodySize * 0.35,
            height: bodySize * 0.12,
            borderRadius: '999px',
            background: '#8b6b4a',
            opacity: 0.2,
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -bodySize * 0.1,
            left: bodySize * 0.45,
            width: bodySize * 0.35,
            height: bodySize * 0.18,
            background: 'linear-gradient(180deg, #8b6b4a, #d7bda1)',
            clipPath: 'polygon(0 0, 100% 40%, 100% 100%, 0 60%)',
            opacity: 0.7,
          }}
        />
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: size * 0.1,
          left: size * 0.14,
          right: size * 0.14,
          height: branchHeight,
          background: '#8b6b4a',
          borderRadius: '999px',
          boxShadow: '0 3px 0 rgba(0,0,0,0.08)',
        }}
      />
    </div>
  );
}
