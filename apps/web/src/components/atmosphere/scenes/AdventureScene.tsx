import React, { useMemo } from 'react';

export const AdventureScene: React.FC = () => {
  const stars = useMemo(() => {
    return Array.from({ length: 45 }, (_, i) => ({
      id: i,
      left: `${(i * 17) % 100}%`,
      top: `${(i * 7) % 45}%`,
      delay: `${(i * 0.3) % 3}s`,
      opacity: 0.2 + ((i % 5) * 0.15),
    }));
  }, []);

  const rainDrops = useMemo(() => {
    return Array.from({ length: 40 }, (_, i) => ({
      id: i,
      left: `${(i * 2.8) % 105}%`,
      duration: `${0.4 + ((i % 4) * 0.15)}s`,
      delay: `-${(i * 0.1) % 2}s`,
      height: `${6 + (i % 6)}vh`,
      opacity: 0.2 + ((i % 4) * 0.15),
    }));
  }, []);

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {/* Sky Background */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at 50% 30%, rgba(86, 111, 119, 0.18), transparent 45%), linear-gradient(180deg, #010407 0%, #050a0e 42%, #020609 60%, #000102 100%)',
      }} />

      {/* Twinkling Stars */}
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
            background: '#d7e6e7',
            opacity: s.opacity,
            animation: `twinkle 3s ease-in-out infinite ${s.delay}`,
          }}
        />
      ))}

      {/* Moon */}
      <div style={{
        position: 'absolute', right: '14%', top: '10%', width: '72px', height: '72px',
        borderRadius: '50%', opacity: 0.18,
        background: 'radial-gradient(circle at 35% 32%, #9ca8a8, #4a5558 58%, #20282b)',
        boxShadow: '0 0 50px 15px rgba(180, 211, 217, 0.1)',
      }} />

      {/* Storm Clouds */}
      <div style={{
        position: 'absolute', inset: '-10%', filter: 'blur(16px)', opacity: 0.85,
        animation: 'cloudDrift 35s linear infinite',
      }}>
        <div style={{ position: 'absolute', top: '5%', left: '-5%', width: '45vw', height: '14vh', borderRadius: '50%', background: '#020508', boxShadow: '0 0 70px 30px #010305' }} />
        <div style={{ position: 'absolute', top: '12%', left: '35%', width: '50vw', height: '15vh', borderRadius: '50%', background: '#020508', boxShadow: '0 0 70px 30px #010305', transform: 'scale(1.2)' }} />
      </div>

      {/* Horizon & Sea */}
      <div style={{
        position: 'absolute', top: '46%', left: 0, right: 0, height: '10%',
        background: 'linear-gradient(transparent, rgba(35, 57, 63, 0.15), transparent)',
        filter: 'blur(6px)',
      }} />

      <div style={{
        position: 'absolute', inset: '49% -5% -10%',
        background: 'repeating-linear-gradient(175deg, transparent 0 17px, rgba(74, 105, 112, 0.08) 18px 20px, transparent 21px 38px), linear-gradient(180deg, #031016 0%, #02090e 48%, #000204 100%)',
      }}>
        {/* Animated Wave Ridges */}
        <div style={{ position: 'absolute', width: '120%', height: '8vh', left: '-10%', top: '3%', borderTop: '2px solid rgba(92, 125, 130, 0.15)', borderRadius: '50%', animation: 'float 4s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', width: '120%', height: '8vh', left: '-10%', top: '22%', borderTop: '2px solid rgba(92, 125, 130, 0.12)', borderRadius: '50%', animation: 'float 5.5s ease-in-out infinite 1s' }} />
        <div style={{ position: 'absolute', width: '120%', height: '8vh', left: '-10%', top: '48%', borderTop: '2px solid rgba(92, 125, 130, 0.1)', borderRadius: '50%', animation: 'float 6.5s ease-in-out infinite 2s' }} />
      </div>

      {/* Wooden Ship Pitching in Waves */}
      <div style={{
        position: 'absolute', zIndex: 5, left: '50%', top: '56%',
        width: '380px', height: '240px',
        animation: 'shipRock 3.5s ease-in-out infinite',
        filter: 'drop-shadow(0 20px 20px rgba(0, 0, 0, 0.7))',
      }}>
        {/* Hull */}
        <div style={{
          position: 'absolute', left: '20px', bottom: '26px', width: '340px', height: '85px',
          background: 'linear-gradient(180deg, #3c2011 0%, #241209 38%, #0b0604 100%)',
          clipPath: 'polygon(0 0, 100% 0, 91% 30%, 80% 82%, 70% 100%, 17% 100%, 7% 65%)',
          borderTop: '6px solid #5b3219',
        }} />
        {/* Deck */}
        <div style={{
          position: 'absolute', left: '38px', bottom: '100px', width: '300px', height: '14px',
          background: 'linear-gradient(#4c2916, #241209)', borderRadius: '45% 35% 15% 15%',
        }} />
        {/* Cabin */}
        <div style={{
          position: 'absolute', left: '150px', bottom: '112px', width: '95px', height: '55px',
          background: 'linear-gradient(115deg, #2d170c, #100906)',
          border: '4px solid #5a3018', borderBottom: '7px solid #3a1f12',
          clipPath: 'polygon(4% 100%, 4% 27%, 22% 0, 88% 0, 100% 27%, 100% 100%)',
        }} />
        {/* Mast */}
        <div style={{
          position: 'absolute', left: '105px', bottom: '105px', width: '10px', height: '190px',
          background: 'linear-gradient(90deg, #170b06, #4c2813, #160a05)', borderRadius: '4px',
        }} />
        {/* Yardarm Cross */}
        <div style={{
          position: 'absolute', left: '60px', bottom: '240px', width: '160px', height: '7px',
          background: '#32190b', transform: 'rotate(-2deg)',
        }} />
        {/* Billowing Sail */}
        <div style={{
          position: 'absolute', left: '115px', bottom: '145px', width: '145px', height: '110px',
          background: 'linear-gradient(135deg, rgba(140, 135, 115, 0.7), rgba(43, 44, 39, 0.75))',
          clipPath: 'polygon(0 0, 100% 15%, 78% 100%, 0 85%)',
          boxShadow: 'inset 0 0 15px rgba(0,0,0,0.4)',
        }} />
        {/* Flag */}
        <div style={{
          position: 'absolute', left: '109px', bottom: '288px', width: '42px', height: '18px',
          background: '#e07a38', clipPath: 'polygon(0 0, 100% 25%, 75% 50%, 100% 75%, 0 100%)',
        }} />
      </div>

      {/* Lightning Flash */}
      <div style={{
        position: 'absolute', zIndex: 8, left: '46%', top: '3%', width: '140px', height: '40%',
        animation: 'sirenFlash 9s infinite 3s', opacity: 0,
      }}>
        <div style={{
          position: 'absolute', inset: 0, background: '#efffff',
          clipPath: 'polygon(42% 0, 64% 0, 53% 29%, 78% 29%, 38% 59%, 49% 59%, 12% 100%, 29% 55%, 4% 55%, 42% 28%)',
          filter: 'drop-shadow(0 0 12px #e6fbff) drop-shadow(0 0 35px #b7edff)',
        }} />
      </div>

      {/* Rain Drops */}
      {rainDrops.map(r => (
        <div
          key={r.id}
          style={{
            position: 'absolute',
            left: r.left,
            top: '-5%',
            width: '1px',
            height: r.height,
            background: 'linear-gradient(transparent, rgba(140, 185, 200, 0.45))',
            transform: 'rotate(14deg)',
            opacity: r.opacity,
            animation: `rainDrop ${r.duration} linear infinite ${r.delay}`,
          }}
        />
      ))}
    </div>
  );
};
