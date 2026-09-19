import React, { useMemo } from 'react';

export const ScifiScene: React.FC = () => {
  const stars = useMemo(() => {
    return Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: `${(i * 19) % 100}%`,
      top: `${(i * 11) % 95}%`,
      delay: `${(i * 0.2) % 3}s`,
      opacity: 0.3 + ((i % 5) * 0.15),
    }));
  }, []);

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {/* Deep Space Background */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(circle at 52% 48%, rgba(15, 74, 130, 0.25), transparent 35%), radial-gradient(circle at 15% 70%, rgba(100, 20, 180, 0.15), transparent 35%), linear-gradient(180deg, #01030a 0%, #020713 55%, #010207 100%)',
      }} />

      {/* Rotating Conic Nebula */}
      <div style={{
        position: 'absolute', left: '50%', top: '45%', width: '90vmin', height: '90vmin',
        transform: 'translate(-50%, -50%)', borderRadius: '50%',
        background: 'conic-gradient(from 0deg, transparent, rgba(0, 217, 255, 0.12), transparent, rgba(139, 53, 255, 0.12), transparent)',
        filter: 'blur(35px)', animation: 'spin 25s linear infinite',
      }} />

      {/* Textured Deep Space Planet */}
      <div style={{
        position: 'absolute', right: '-8vw', top: '5vh', width: '25vw', height: '25vw',
        minWidth: '220px', minHeight: '220px', borderRadius: '50%', zIndex: 2,
        background: 'radial-gradient(circle at 32% 27%, #617994, #263b56 42%, #0a111e 72%, #02040a 100%)',
        boxShadow: '-25px 10px 100px rgba(55, 160, 255, 0.2), inset 25px -25px 80px #000',
        opacity: 0.85,
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
            background: '#d8faff',
            boxShadow: '0 0 8px #42dfff',
            opacity: s.opacity,
            animation: `twinkle 2.5s ease-in-out infinite ${s.delay}`,
          }}
        />
      ))}

      {/* Cyber 3D Perspective Synth Grid */}
      <div style={{
        position: 'absolute', left: '-25%', bottom: '-30%', width: '150%', height: '65%', zIndex: 3,
        backgroundImage: 'linear-gradient(rgba(0, 210, 255, 0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 210, 255, 0.12) 1px, transparent 1px)',
        backgroundSize: '75px 38px',
        transform: 'perspective(360px) rotateX(62deg)',
        maskImage: 'linear-gradient(to top, black, transparent 80%)',
        WebkitMaskImage: 'linear-gradient(to top, black, transparent 80%)',
        animation: 'synthGridMove 2.5s linear infinite',
      }} />

      {/* Central Singularity Core & Concentric Energy Rings */}
      <div style={{
        position: 'absolute', left: '50%', top: '48%', width: '28px', height: '28px',
        transform: 'translate(-50%, -50%)', borderRadius: '50%', background: '#efffff', zIndex: 5,
        boxShadow: '0 0 18px 6px #48eaff, 0 0 90px 35px rgba(0, 160, 255, 0.65)',
        animation: 'pulseGlow 2.5s ease-in-out infinite',
      }} />

      <div style={{
        position: 'absolute', left: '50%', top: '48%', width: '240px', height: '240px',
        transform: 'translate(-50%, -50%)', borderRadius: '50%', zIndex: 4,
        border: '1px solid rgba(50, 220, 255, 0.25)', animation: 'spin 8s linear infinite',
      }} />
      <div style={{
        position: 'absolute', left: '50%', top: '48%', width: '380px', height: '380px',
        transform: 'translate(-50%, -50%)', borderRadius: '50%', zIndex: 4,
        border: '1px dashed rgba(50, 220, 255, 0.15)', animation: 'spin 14s linear infinite reverse',
      }} />

      {/* Procedural Spacecraft Flying Across */}
      <div style={{
        position: 'absolute', zIndex: 10, width: '180px', height: '75px',
        animation: 'fly 16s linear infinite',
        filter: 'drop-shadow(0 0 12px rgba(50, 210, 255, 0.4))',
      }}>
        {/* Cockpit & Hull */}
        <div style={{
          position: 'absolute', left: '25px', top: '22px', width: '105px', height: '32px',
          background: 'linear-gradient(180deg, #bfcbd3 0%, #4e6472 20%, #17252e 58%, #080d12 100%)',
          clipPath: 'polygon(0 50%, 13% 17%, 68% 5%, 100% 50%, 68% 95%, 13% 83%)',
        }} />
        <div style={{
          position: 'absolute', left: '60px', top: '19px', width: '40px', height: '15px',
          background: 'linear-gradient(145deg, #dffaff, #1599c7 35%, #041a2b 80%)',
          clipPath: 'polygon(0 50%, 18% 0, 80% 8%, 100% 50%, 80% 92%, 18% 100%)',
          boxShadow: '0 0 10px rgba(30, 210, 255, 0.6)',
        }} />
        {/* Cyan Plasma Exhaust */}
        <div style={{
          position: 'absolute', left: '-60px', top: '30px', width: '85px', height: '10px',
          background: 'linear-gradient(90deg, transparent, rgba(30, 140, 255, 0.1), #25dfff, #fff, #25dfff, transparent)',
          filter: 'blur(3px)',
          animation: 'pulseGlow 0.4s ease-in-out infinite alternate',
        }} />
      </div>
    </div>
  );
};
