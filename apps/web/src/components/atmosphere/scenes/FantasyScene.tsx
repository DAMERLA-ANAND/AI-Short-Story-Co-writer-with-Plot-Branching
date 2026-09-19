import React, { useMemo } from 'react';

export const FantasyScene: React.FC = () => {
  const particles = useMemo(() => {
    return Array.from({ length: 35 }, (_, i) => ({
      id: i,
      left: `${(i * 17) % 100}%`,
      top: `${(i * 23) % 100}%`,
      duration: `${4 + ((i % 4) * 1.2)}s`,
      delay: `${(i * 0.2) % 3}s`,
      size: `${2 + (i % 3)}px`,
    }));
  }, []);

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {/* Arcane Forest Sky */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at 50% 30%, rgba(234, 179, 8, 0.18), transparent 45%), radial-gradient(ellipse at 70% 65%, rgba(16, 185, 129, 0.15), transparent 45%), linear-gradient(180deg, #050b08 0%, #0a1812 45%, #040806 100%)',
      }} />

      {/* Mystic Aurora Shimmer */}
      <div style={{
        position: 'absolute', left: '-10%', right: '-10%', top: '5%', height: '35%',
        background: 'radial-gradient(ellipse at 30% 50%, rgba(52, 211, 153, 0.25) 0%, transparent 60%), radial-gradient(ellipse at 70% 50%, rgba(234, 179, 8, 0.2) 0%, transparent 60%)',
        filter: 'blur(30px)', animation: 'breathe 8s ease-in-out infinite alternate',
      }} />

      {/* Floating Fairy Dust / Starlight */}
      {particles.map(p => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background: '#fef08a',
            boxShadow: '0 0 10px 2px #eab308, 0 0 20px 4px rgba(52, 211, 153, 0.5)',
            animation: `float ${p.duration} ease-in-out infinite ${p.delay}`,
          }}
        />
      ))}

      {/* Ancient Standing Monoliths */}
      <div style={{
        position: 'absolute', left: '12%', bottom: '15%', width: '45px', height: '220px',
        background: 'linear-gradient(90deg, #0a1410, #182c22 45%, #09120e)',
        clipPath: 'polygon(20% 0%, 80% 5%, 100% 100%, 0% 100%)',
        boxShadow: '0 0 30px rgba(0, 0, 0, 0.8)',
        opacity: 0.85,
      }}>
        {/* Carved Rune Glow */}
        <div style={{
          position: 'absolute', top: '35%', left: '50%', transform: 'translateX(-50%)',
          width: '12px', height: '40px', background: '#34d399',
          filter: 'blur(3px)', opacity: 0.6,
          animation: 'pulseGlow 3s ease-in-out infinite',
        }} />
      </div>

      <div style={{
        position: 'absolute', right: '14%', bottom: '15%', width: '50px', height: '240px',
        background: 'linear-gradient(90deg, #0a1410, #182c22 45%, #09120e)',
        clipPath: 'polygon(15% 5%, 85% 0%, 100% 100%, 0% 100%)',
        boxShadow: '0 0 30px rgba(0, 0, 0, 0.8)',
        opacity: 0.85,
      }}>
        {/* Carved Rune Glow */}
        <div style={{
          position: 'absolute', top: '30%', left: '50%', transform: 'translateX(-50%)',
          width: '14px', height: '45px', background: '#facc15',
          filter: 'blur(3px)', opacity: 0.6,
          animation: 'pulseGlow 3.5s ease-in-out infinite 1s',
        }} />
      </div>

      {/* Floating Arcane Ring */}
      <div style={{
        position: 'absolute', left: '50%', top: '45%', width: '300px', height: '300px',
        transform: 'translate(-50%, -50%)', borderRadius: '50%',
        border: '1px dashed rgba(234, 179, 8, 0.25)',
        animation: 'spin 20s linear infinite',
      }} />
    </div>
  );
};
