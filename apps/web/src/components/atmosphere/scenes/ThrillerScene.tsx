import React, { useMemo } from 'react';

export const ThrillerScene: React.FC = () => {
  const rainDrops = useMemo(() => {
    return Array.from({ length: 40 }, (_, i) => ({
      id: i,
      left: `${(i * 2.7) % 105}%`,
      duration: `${0.35 + ((i % 4) * 0.12)}s`,
      delay: `-${(i * 0.1) % 2}s`,
      height: `${35 + ((i % 4) * 8)}px`,
      opacity: 0.2 + ((i % 4) * 0.15),
    }));
  }, []);

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {/* Night Atmosphere */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at 50% 34%, rgba(48, 61, 57, 0.18), transparent 45%), linear-gradient(180deg, #030708 0%, #070c0d 45%, #020405 100%)',
      }} />

      {/* Distant Pale Moon */}
      <div style={{
        position: 'absolute', right: '16%', top: '10%', width: '65px', height: '65px',
        borderRadius: '50%',
        background: 'radial-gradient(circle at 35% 30%, #aeb5aa, #555d57 62%, #222824)',
        boxShadow: '0 0 50px 10px rgba(180, 195, 176, 0.1)',
        opacity: 0.25,
      }} />

      {/* Dark Mountain Forest Silhouettes */}
      <div style={{
        position: 'absolute', zIndex: 2, bottom: '28%', left: 0, right: 0, height: '32%',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around',
        opacity: 0.85,
      }}>
        {[180, 240, 170, 220, 200, 250, 190].map((h, i) => (
          <div
            key={i}
            style={{
              width: '4px', height: `${h}px`, background: '#010202', position: 'relative',
            }}
          >
            <div style={{ position: 'absolute', top: '25%', left: 0, width: '60px', height: '3px', background: '#010202', transform: 'rotate(-38deg)' }} />
            <div style={{ position: 'absolute', top: '48%', left: 0, width: '60px', height: '3px', background: '#010202', transform: 'rotate(35deg)' }} />
          </div>
        ))}
      </div>

      {/* Railroad Ground */}
      <div style={{
        position: 'absolute', zIndex: 4, left: 0, right: 0, bottom: 0, height: '35%',
        background: 'linear-gradient(180deg, #0c0f0d 0%, #050706 45%, #010202 100%)',
      }}>
        {/* Steel Rail Lines */}
        <div style={{
          position: 'absolute', left: '-5%', width: '110%', height: '4px', bottom: '28%',
          background: 'linear-gradient(90deg, #22251f, #62645a, #242720)',
          boxShadow: '0 2px 7px #000',
        }} />
      </div>

      {/* Blinking Railroad Signal Lamps */}
      <div style={{
        position: 'absolute', zIndex: 12, left: '12%', bottom: '30%',
        width: '8px', height: '8px', borderRadius: '50%', background: '#b8a86d',
        boxShadow: '0 0 14px 4px rgba(209, 181, 101, 0.4)',
        animation: 'pulseGlow 2.5s steps(1) infinite',
      }}>
        <div style={{ position: 'absolute', left: '3px', top: '-42px', width: '2px', height: '42px', background: '#242720' }} />
      </div>
      <div style={{
        position: 'absolute', zIndex: 12, left: '75%', bottom: '32%',
        width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444',
        boxShadow: '0 0 14px 4px rgba(239, 68, 68, 0.4)',
        animation: 'pulseGlow 3s steps(1) infinite 1s',
      }}>
        <div style={{ position: 'absolute', left: '3px', top: '-42px', width: '2px', height: '42px', background: '#242720' }} />
      </div>

      {/* Looping Night Train Express */}
      <div style={{
        position: 'absolute', zIndex: 6, left: '-400px', bottom: '15%', height: '160px', width: '900px',
        animation: 'trainLoop 16s linear infinite',
        filter: 'drop-shadow(0 18px 16px rgba(0,0,0,0.8))',
      }}>
        {/* Locomotive */}
        <div style={{
          position: 'absolute', left: 0, bottom: '20px', width: '180px', height: '90px',
          borderRadius: '10px 4px 2px 2px',
          background: 'linear-gradient(#171b18, #292c25 48%, #0b0d0b)',
          border: '3px solid #3d4036', borderBottom: '6px solid #070907',
        }}>
          {/* Headlight & Conic Beam */}
          <div style={{
            position: 'absolute', right: '10px', bottom: '15px', width: '22px', height: '22px',
            borderRadius: '50%', background: '#d0c997',
            boxShadow: '0 0 25px 8px rgba(213, 205, 139, 0.45)',
          }} />
          <div style={{
            position: 'absolute', left: '160px', bottom: '2px', width: '420px', height: '140px',
            background: 'conic-gradient(from 180deg at 0 100%, rgba(206, 211, 166, 0.12), transparent 28deg, transparent 150deg, rgba(206, 211, 166, 0.05))',
            filter: 'blur(8px)',
          }} />
          {/* Windows */}
          <div style={{ position: 'absolute', left: '25px', top: '18px', width: '25px', height: '26px', background: '#090c0b', border: '2px solid #080a08', boxShadow: 'inset 0 0 8px rgba(176,187,147,0.3)' }} />
          <div style={{ position: 'absolute', left: '60px', top: '18px', width: '25px', height: '26px', background: '#090c0b', border: '2px solid #080a08', boxShadow: 'inset 0 0 8px rgba(176,187,147,0.3)' }} />
        </div>

        {/* Train Passenger Cars */}
        {[190, 340, 490].map((left, idx) => (
          <div
            key={idx}
            style={{
              position: 'absolute', left: `${left}px`, bottom: '20px', width: '140px', height: '90px',
              borderRadius: '4px',
              background: 'linear-gradient(#171b18, #292c25 48%, #0b0d0b)',
              border: '3px solid #3d4036', borderBottom: '6px solid #070907',
            }}
          >
            <div style={{ position: 'absolute', left: '15px', top: '22px', width: '24px', height: '26px', background: '#090c0b', border: '2px solid #080a08', boxShadow: 'inset 0 0 8px rgba(176,187,147,0.25)' }} />
            <div style={{ position: 'absolute', left: '55px', top: '22px', width: '24px', height: '26px', background: '#090c0b', border: '2px solid #080a08', boxShadow: 'inset 0 0 8px rgba(176,187,147,0.25)' }} />
            <div style={{ position: 'absolute', left: '95px', top: '22px', width: '24px', height: '26px', background: '#090c0b', border: '2px solid #080a08', boxShadow: 'inset 0 0 8px rgba(176,187,147,0.25)' }} />
          </div>
        ))}
      </div>

      {/* Cold Rain */}
      {rainDrops.map(r => (
        <div
          key={r.id}
          style={{
            position: 'absolute',
            left: r.left,
            top: '-5%',
            width: '1px',
            height: r.height,
            background: 'linear-gradient(transparent, rgba(171, 190, 178, 0.4))',
            transform: 'rotate(12deg)',
            opacity: r.opacity,
            animation: `rainDrop ${r.duration} linear infinite ${r.delay}`,
          }}
        />
      ))}
    </div>
  );
};
