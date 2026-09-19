import React, { useMemo } from 'react';

export const ComedyScene: React.FC = () => {
  const confetti = useMemo(() => {
    const colors = ['#f43f5e', '#06b6d4', '#f59e0b', '#10b981', '#a855f7'];
    return Array.from({ length: 25 }, (_, i) => ({
      id: i,
      left: `${(i * 4) % 100}%`,
      color: colors[i % colors.length],
      duration: `${3 + ((i % 3) * 0.8)}s`,
      delay: `-${(i * 0.3) % 4}s`,
    }));
  }, []);

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {/* Cartoon Sky */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, rgba(6, 182, 212, 0.25) 0%, rgba(14, 165, 233, 0.15) 50%, rgba(16, 185, 129, 0.1) 100%), #04080c',
      }} />

      {/* Sun */}
      <div style={{
        position: 'absolute', right: '10%', top: '8%', width: '90px', height: '90px',
        borderRadius: '50%', background: '#ffd64a',
        boxShadow: '0 0 50px #ffe47a, 0 0 100px rgba(255, 214, 74, 0.3)',
        animation: 'pulseGlow 3s ease-in-out infinite',
      }} />

      {/* Cartoon Clouds */}
      <div style={{
        position: 'absolute', left: '-200px', top: '15%', width: '180px', height: '50px',
        borderRadius: '50px', background: 'rgba(255, 255, 255, 0.4)',
        filter: 'blur(2px)', animation: 'cloudDrift 28s linear infinite',
      }} />
      <div style={{
        position: 'absolute', left: '-150px', top: '24%', width: '140px', height: '40px',
        borderRadius: '40px', background: 'rgba(255, 255, 255, 0.3)',
        filter: 'blur(3px)', animation: 'cloudDrift 36s linear infinite -10s',
      }} />

      {/* City Skyline */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: '26%', height: '32%',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around',
        opacity: 0.75,
      }}>
        <div style={{ width: '11%', height: '68%', background: '#f08b6f', borderRadius: '4px 4px 0 0', border: '2px solid rgba(0,0,0,0.3)', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '20%', left: '25%', width: '12px', height: '16px', background: '#fff0a0', boxShadow: '0 0 6px #fff0a0' }} />
          <div style={{ position: 'absolute', top: '45%', left: '60%', width: '12px', height: '16px', background: '#fff0a0' }} />
        </div>
        <div style={{ width: '10%', height: '90%', background: '#efc75b', borderRadius: '4px 4px 0 0', border: '2px solid rgba(0,0,0,0.3)', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '18%', left: '20%', width: '12px', height: '16px', background: '#bde8f0' }} />
          <div style={{ position: 'absolute', top: '45%', left: '55%', width: '12px', height: '16px', background: '#fff0a0' }} />
        </div>
        <div style={{ width: '14%', height: '62%', background: '#80b9d2', borderRadius: '4px 4px 0 0', border: '2px solid rgba(0,0,0,0.3)', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '25%', left: '30%', width: '12px', height: '16px', background: '#fff0a0' }} />
          <div style={{ position: 'absolute', top: '50%', left: '60%', width: '12px', height: '16px', background: '#fff0a0' }} />
        </div>
        <div style={{ width: '12%', height: '82%', background: '#e69cbd', borderRadius: '4px 4px 0 0', border: '2px solid rgba(0,0,0,0.3)', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '22%', left: '25%', width: '12px', height: '16px', background: '#fff0a0' }} />
          <div style={{ position: 'absolute', top: '55%', left: '55%', width: '12px', height: '16px', background: '#fff0a0' }} />
        </div>
        <div style={{ width: '10%', height: '92%', background: '#e9bc61', borderRadius: '4px 4px 0 0', border: '2px solid rgba(0,0,0,0.3)', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '15%', left: '25%', width: '12px', height: '16px', background: '#fff0a0' }} />
          <div style={{ position: 'absolute', top: '40%', left: '55%', width: '12px', height: '16px', background: '#fff0a0' }} />
        </div>
        <div style={{ width: '11%', height: '65%', background: '#81c4a1', borderRadius: '4px 4px 0 0', border: '2px solid rgba(0,0,0,0.3)', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '30%', left: '35%', width: '12px', height: '16px', background: '#fff0a0' }} />
        </div>
      </div>

      {/* Road */}
      <div style={{
        position: 'absolute', left: '-5%', right: '-5%', bottom: '-4%', height: '32%',
        background: '#202422', borderTop: '5px solid #4a4f4c',
        transform: 'perspective(500px) rotateX(4deg)',
      }}>
        {/* Animated Lane Stripes */}
        <div style={{
          position: 'absolute', bottom: '35%', width: '110%', height: '8px',
          background: 'repeating-linear-gradient(90deg, #f8e9a8 0 70px, transparent 70px 140px)',
          animation: 'synthGridMove 1.6s linear infinite',
        }} />
      </div>

      {/* Cartoon Delivery Van Looping Across */}
      <div style={{
        position: 'absolute', zIndex: 6, left: '-350px', bottom: '20%',
        width: '320px', height: '150px',
        animation: 'trainLoop 14s linear infinite',
        filter: 'drop-shadow(0 15px 15px rgba(0,0,0,0.5))',
      }}>
        <div style={{
          position: 'absolute', left: '15px', bottom: '20px', width: '280px', height: '95px',
          borderRadius: '24px 30px 10px 10px', background: 'linear-gradient(#ff6957, #ef463d)',
          border: '5px solid #9d302b',
        }}>
          {/* Van Roof */}
          <div style={{
            position: 'absolute', left: '55px', top: '-10px', width: '160px', height: '15px',
            borderRadius: '10px', background: '#ffd052', border: '4px solid #9d302b',
          }} />
          {/* Windows */}
          <div style={{
            position: 'absolute', right: '25px', top: '18px', width: '68px', height: '42px',
            borderRadius: '8px 14px 4px 4px', background: 'linear-gradient(135deg, #b9ecf5, #5aa7bf)',
            border: '4px solid #6f2b29',
          }} />
          <div style={{
            position: 'absolute', left: '38px', top: '20px', width: '75px', height: '40px',
            borderRadius: '6px', background: '#b9ecf5', border: '4px solid #6f2b29',
          }} />
          {/* Headlight */}
          <div style={{
            position: 'absolute', right: '8px', bottom: '35px', width: '14px', height: '14px',
            borderRadius: '50%', background: '#fff6a9', boxShadow: '0 0 16px 6px #fff2a0',
          }} />
        </div>
        {/* Wheels */}
        <div style={{
          position: 'absolute', left: '48px', bottom: '4px', width: '48px', height: '48px',
          borderRadius: '50%', background: '#1e2221', border: '7px solid #111',
          animation: 'spin 0.6s linear infinite',
        }} />
        <div style={{
          position: 'absolute', right: '55px', bottom: '4px', width: '48px', height: '48px',
          borderRadius: '50%', background: '#1e2221', border: '7px solid #111',
          animation: 'spin 0.6s linear infinite',
        }} />
      </div>

      {/* Comic Impact Starburst */}
      <div style={{
        position: 'absolute', left: '60%', bottom: '35%', fontSize: '42px',
        color: '#ffd83d', textShadow: '2px 2px #e44b3d',
        animation: 'pulseGlow 4s infinite',
      }}>
        ★
      </div>

      {/* Falling Confetti */}
      {confetti.map(c => (
        <div
          key={c.id}
          style={{
            position: 'absolute',
            left: c.left,
            top: '-5%',
            width: '6px',
            height: '10px',
            background: c.color,
            borderRadius: '2px',
            opacity: 0.6,
            animation: `rainDrop ${c.duration} linear infinite ${c.delay}`,
          }}
        />
      ))}
    </div>
  );
};
