import React, { useMemo } from 'react';

export const LoveScene: React.FC = () => {
  const stars = useMemo(() => {
    return Array.from({ length: 40 }, (_, i) => ({
      id: i,
      left: `${(i * 23) % 100}%`,
      top: `${(i * 13) % 100}%`,
      delay: `${(i * 0.25) % 3}s`,
    }));
  }, []);

  const bursts = useMemo(() => {
    return Array.from({ length: 16 }, (_, i) => {
      const angle = (i / 16) * Math.PI * 2;
      const dist = 90 + ((i % 3) * 35);
      return {
        id: i,
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist,
        delay: `${(i * 0.15) % 2}s`,
      };
    });
  }, []);

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {/* Rose & Magenta Atmospheric Glow */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(circle at 50% 50%, rgba(255, 30, 100, 0.18), transparent 30%), radial-gradient(circle at 25% 45%, rgba(255, 0, 90, 0.1), transparent 35%), radial-gradient(circle at 75% 55%, rgba(180, 0, 100, 0.1), transparent 35%), #060104',
      }} />

      {/* Breathing Core Glow */}
      <div style={{
        position: 'absolute', left: '50%', top: '50%', width: '45vmin', height: '45vmin',
        transform: 'translate(-50%, -50%)', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255, 20, 95, 0.28), rgba(255, 0, 70, 0.08), transparent 70%)',
        filter: 'blur(20px)', animation: 'breathe 4.5s ease-in-out infinite',
      }} />

      {/* Stars */}
      {stars.map(s => (
        <div
          key={s.id}
          style={{
            position: 'absolute',
            left: s.left,
            top: s.top,
            width: '2px',
            height: '2px',
            borderRadius: '50%',
            background: '#ffd1df',
            boxShadow: '0 0 8px #ff6b9d',
            animation: `twinkle 2.5s ease-in-out infinite ${s.delay}`,
          }}
        />
      ))}

      {/* Concentric Celestial Orbit Rings */}
      <div style={{
        position: 'absolute', left: '50%', top: '50%', width: 'min(75vw, 850px)', height: 'min(75vw, 850px)',
        transform: 'translate(-50%, -50%)', border: '1px solid rgba(255, 70, 130, 0.12)',
        borderRadius: '50%', animation: 'spin 22s linear infinite',
      }}>
        <div style={{
          position: 'absolute', left: 0, top: '50%', width: '8px', height: '8px', borderRadius: '50%',
          background: '#ff5b91', boxShadow: '0 0 16px 6px rgba(255, 45, 110, 0.7)',
        }} />
      </div>

      <div style={{
        position: 'absolute', left: '50%', top: '50%', width: 'min(50vw, 550px)', height: 'min(50vw, 550px)',
        transform: 'translate(-50%, -50%)', border: '1px dashed rgba(255, 100, 160, 0.15)',
        borderRadius: '50%', animation: 'spin 14s linear infinite reverse',
      }}>
        <div style={{
          position: 'absolute', right: 0, top: '50%', width: '6px', height: '6px', borderRadius: '50%',
          background: '#ff85b2', boxShadow: '0 0 12px 4px rgba(255, 100, 160, 0.6)',
        }} />
      </div>

      {/* Pulsating Core */}
      <div style={{
        position: 'absolute', left: '50%', top: '50%', width: '14px', height: '14px', borderRadius: '50%',
        transform: 'translate(-50%, -50%)', background: '#fff',
        boxShadow: '0 0 15px 5px #ff9fbd, 0 0 50px 20px rgba(255, 0, 90, 0.6)',
        animation: 'pulseGlow 2s ease-in-out infinite',
      }} />

      {/* Traversing Lover Light Trails */}
      <div style={{
        position: 'absolute', top: '50%', left: '5%', width: '40vw', height: '2px',
        transform: 'translateY(-50%)',
        background: 'linear-gradient(90deg, transparent, #ff3e78, transparent)',
        filter: 'blur(1px)', opacity: 0.5,
      }} />
      <div style={{
        position: 'absolute', top: '50%', right: '5%', width: '40vw', height: '2px',
        transform: 'translateY(-50%)',
        background: 'linear-gradient(90deg, transparent, #ff3e78, transparent)',
        filter: 'blur(1px)', opacity: 0.5,
      }} />

      {/* Blooming 3D Heart */}
      <div style={{
        position: 'absolute', left: '50%', top: '50%', width: '150px', height: '150px',
        transform: 'translate(-50%, -50%) rotate(-45deg)',
        animation: 'heartBloom 6s ease-in-out infinite',
        filter: 'drop-shadow(0 0 16px #ff1459) drop-shadow(0 0 45px rgba(255, 0, 80, 0.7))',
      }}>
        <div style={{
          position: 'absolute', left: '30px', top: '30px', width: '90px', height: '90px',
          background: 'linear-gradient(135deg, #ff003f, #ff2166, #ff719b)',
          borderRadius: '10px',
        }}>
          {/* Top circle lobes */}
          <div style={{
            position: 'absolute', left: 0, top: '-45px', width: '90px', height: '90px',
            borderRadius: '50%', background: 'inherit',
          }} />
          <div style={{
            position: 'absolute', left: '45px', top: 0, width: '90px', height: '90px',
            borderRadius: '50%', background: 'inherit',
          }} />
        </div>
      </div>

      {/* Heart Spark Bursts */}
      {bursts.map(b => (
        <div
          key={b.id}
          style={{
            position: 'absolute',
            left: `calc(50% + ${b.x}px)`,
            top: `calc(50% + ${b.y}px)`,
            width: '4px',
            height: '4px',
            borderRadius: '50%',
            background: '#ffb0c8',
            boxShadow: '0 0 10px 3px #ff286d',
            animation: `breathe 3s ease-out infinite ${b.delay}`,
          }}
        />
      ))}
    </div>
  );
};
