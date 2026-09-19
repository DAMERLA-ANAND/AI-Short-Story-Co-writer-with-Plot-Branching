import React, { useMemo } from 'react';

export const DetectiveScene: React.FC = () => {
  const rainDrops = useMemo(() => {
    return Array.from({ length: 45 }, (_, i) => ({
      id: i,
      left: `${(i * 2.5) % 105}%`,
      duration: `${0.35 + ((i % 4) * 0.1)}s`,
      delay: `-${(i * 0.15) % 2}s`,
      height: `${30 + ((i % 5) * 8)}px`,
      opacity: 0.2 + ((i % 4) * 0.15),
    }));
  }, []);

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {/* Dark Rainy Sky */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at 50% 70%, rgba(55, 65, 72, 0.18), transparent 45%), linear-gradient(180deg, #020304 0%, #07090b 58%, #020304 100%)',
      }} />

      {/* Pale Moon */}
      <div style={{
        position: 'absolute', top: '8%', right: '15%', width: '70px', height: '70px',
        borderRadius: '50%',
        background: 'radial-gradient(circle at 38% 35%, #e6e6df, #8b8d8b 68%, #4a4b4a)',
        boxShadow: '0 0 45px rgba(220, 225, 220, 0.15)',
        opacity: 0.75,
      }} />

      {/* City Buildings with Flickering Windows */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: '18%', height: '45%',
        display: 'flex', alignItems: 'flex-end', gap: '1.2vw', padding: '0 2vw',
        opacity: 0.85,
      }}>
        {[60, 82, 52, 94, 66, 86, 56, 76, 48, 72].map((height, idx) => (
          <div
            key={idx}
            style={{
              position: 'relative', flex: 1, minWidth: '32px', height: `${height}%`,
              background: 'linear-gradient(90deg, #050607, #111416, #050607)',
              borderTop: '1px solid #171b1d',
              boxShadow: 'inset 0 0 25px rgba(0,0,0,0.8)',
            }}
          >
            {/* Small yellow flickering windows */}
            <div style={{
              position: 'absolute', top: '25%', left: '30%', width: '4px', height: '7px',
              background: '#b29b67', boxShadow: '0 0 5px rgba(190, 160, 80, 0.3)',
              opacity: (idx % 2 === 0) ? 0.6 : 0.2,
            }} />
            <div style={{
              position: 'absolute', top: '50%', left: '60%', width: '4px', height: '7px',
              background: '#b29b67', boxShadow: '0 0 5px rgba(190, 160, 80, 0.3)',
              opacity: (idx % 3 === 0) ? 0.7 : 0.15,
            }} />
          </div>
        ))}
      </div>

      {/* Street & Wet Reflection */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, height: '20%',
        background: 'linear-gradient(180deg, #0b0d0e 0%, #020304 100%)',
        borderTop: '1px solid #141718',
      }}>
        <div style={{
          position: 'absolute', left: 0, right: 0, top: '48%', height: '2px',
          background: 'repeating-linear-gradient(90deg, transparent 0 70px, #9a9a8c 70px 125px, transparent 125px 190px)',
          opacity: 0.15,
          animation: 'synthGridMove 2s linear infinite',
        }} />
      </div>

      {/* Classic Noir Streetlamp */}
      <div style={{
        position: 'absolute', bottom: '18%', left: '16%', width: '5px', height: '38%',
        background: '#16191a',
      }}>
        {/* Lamp Fixture & Warm Light Cone */}
        <div style={{
          position: 'absolute', top: '-8px', left: '-10px', width: '25px', height: '9px',
          borderRadius: '50%', background: '#77705c',
          boxShadow: '0 0 20px 6px rgba(210, 185, 105, 0.3)',
        }} />
        <div style={{
          position: 'absolute', top: 0, left: '-120px', width: '250px', height: '200px',
          background: 'radial-gradient(ellipse at top, rgba(200, 180, 120, 0.08), transparent 70%)',
          pointerEvents: 'none',
        }} />
      </div>

      {/* Alternating Red & Blue Police Siren Beams */}
      <div style={{
        position: 'absolute', top: '-10%', left: '-20%', width: '55vw', height: '120%',
        background: 'radial-gradient(ellipse, rgba(255, 0, 25, 0.55), transparent 65%)',
        filter: 'blur(35px)', mixBlendMode: 'screen',
        animation: 'sirenFlash 3.2s ease-in-out infinite',
      }} />
      <div style={{
        position: 'absolute', top: '-10%', right: '-20%', width: '55vw', height: '120%',
        background: 'radial-gradient(ellipse, rgba(20, 70, 255, 0.55), transparent 65%)',
        filter: 'blur(35px)', mixBlendMode: 'screen',
        animation: 'sirenFlash 3.2s ease-in-out infinite 1.6s',
      }} />

      {/* Sweeping Searchlight Beam */}
      <div style={{
        position: 'absolute', left: '50%', top: '-10%', width: '3px', height: '120%',
        transformOrigin: '50% 0',
        background: 'linear-gradient(transparent, rgba(220, 225, 215, 0.12), transparent)',
        filter: 'blur(8px)',
        animation: 'float 8s ease-in-out infinite alternate',
      }} />

      {/* Falling Rain */}
      {rainDrops.map(r => (
        <div
          key={r.id}
          style={{
            position: 'absolute',
            left: r.left,
            top: '-5%',
            width: '1px',
            height: r.height,
            background: 'linear-gradient(transparent, rgba(190, 205, 215, 0.45))',
            transform: 'rotate(12deg)',
            opacity: r.opacity,
            animation: `rainDrop ${r.duration} linear infinite ${r.delay}`,
          }}
        />
      ))}

      {/* Low Ground Fog */}
      <div style={{
        position: 'absolute', left: '-15%', bottom: '6%', width: '130%', height: '26%',
        background: 'radial-gradient(ellipse at 20% 50%, rgba(150, 160, 165, 0.08), transparent 40%), radial-gradient(ellipse at 60% 40%, rgba(150, 160, 165, 0.07), transparent 40%), radial-gradient(ellipse at 90% 60%, rgba(150, 160, 165, 0.07), transparent 35%)',
        filter: 'blur(16px)', animation: 'float 12s ease-in-out infinite alternate',
      }} />
    </div>
  );
};
