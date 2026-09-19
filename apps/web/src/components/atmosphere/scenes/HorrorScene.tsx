import React from 'react';

export const HorrorScene: React.FC = () => {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {/* Dark Abyss Sky */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at 50% 35%, rgba(65, 20, 25, 0.25), transparent 45%), linear-gradient(180deg, #07080a 0%, #030103 55%, #000 100%)',
      }} />

      {/* Moon Halo & Moon */}
      <div style={{
        position: 'absolute', right: '18%', top: '10%', width: '180px', height: '180px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(239, 68, 68, 0.15), rgba(180, 185, 180, 0.04) 40%, transparent 70%)',
        filter: 'blur(8px)',
      }} />
      <div style={{
        position: 'absolute', right: '20%', top: '13%', width: '90px', height: '90px',
        borderRadius: '50%',
        background: 'radial-gradient(circle at 38% 34%, #e3e2d5, #a8a89e 63%, #73736d 100%)',
        boxShadow: '0 0 50px rgba(220, 220, 205, 0.15)',
        opacity: 0.8,
      }} />

      {/* Distant Jagged Pine Forest Silhouette */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: '18%', height: '32%',
        background: '#020303',
        clipPath: 'polygon(0 100%, 0 62%, 4% 48%, 7% 57%, 10% 38%, 13% 55%, 16% 45%, 19% 59%, 22% 42%, 25% 54%, 28% 37%, 31% 56%, 34% 44%, 37% 58%, 40% 39%, 43% 52%, 46% 43%, 49% 57%, 52% 36%, 55% 53%, 58% 41%, 61% 58%, 64% 44%, 67% 54%, 70% 38%, 73% 57%, 76% 42%, 79% 55%, 82% 37%, 85% 54%, 88% 43%, 91% 57%, 94% 39%, 97% 51%, 100% 43%, 100% 100%)',
      }} />

      {/* Gnarled Foreground Trees */}
      <div style={{
        position: 'absolute', left: '8%', bottom: '15%', width: '120px', height: '260px',
        opacity: 0.85, filter: 'drop-shadow(6px 0 6px rgba(0,0,0,0.8))',
      }}>
        <div style={{
          position: 'absolute', bottom: 0, left: '40%', width: '18px', height: '100%',
          background: 'linear-gradient(90deg, #010101, #0d0d0d 45%, #020202)',
          borderRadius: '40% 60% 8% 8%', transform: 'rotate(-3deg)',
        }} />
        <div style={{ position: 'absolute', left: '40%', top: '25%', width: '60px', height: '5px', background: '#050505', transform: 'rotate(-40deg)' }} />
        <div style={{ position: 'absolute', left: '45%', top: '45%', width: '55px', height: '5px', background: '#050505', transform: 'rotate(35deg)' }} />
      </div>

      <div style={{
        position: 'absolute', right: '12%', bottom: '15%', width: '130px', height: '280px',
        opacity: 0.85, filter: 'drop-shadow(-6px 0 6px rgba(0,0,0,0.8))',
      }}>
        <div style={{
          position: 'absolute', bottom: 0, left: '45%', width: '20px', height: '100%',
          background: 'linear-gradient(90deg, #010101, #0d0d0d 45%, #020202)',
          borderRadius: '45% 55% 8% 8%', transform: 'rotate(4deg)',
        }} />
        <div style={{ position: 'absolute', left: '20%', top: '30%', width: '65px', height: '5px', background: '#050505', transform: 'rotate(-35deg)' }} />
        <div style={{ position: 'absolute', left: '45%', top: '50%', width: '60px', height: '5px', background: '#050505', transform: 'rotate(30deg)' }} />
      </div>

      {/* Flying Witch Silhouette */}
      <div style={{
        position: 'absolute', zIndex: 10, left: '-10%', top: '28%', width: '120px', height: '80px',
        animation: 'witchFly 20s linear infinite',
        filter: 'drop-shadow(0 0 5px rgba(0,0,0,0.8))',
      }}>
        {/* Broom */}
        <div style={{ position: 'absolute', left: '5px', top: '55px', width: '110px', height: '4px', background: '#1a100a', transform: 'rotate(-5deg)' }} />
        {/* Bristles */}
        <div style={{ position: 'absolute', left: '0', top: '48px', width: '25px', height: '18px', background: '#0a0705', clipPath: 'polygon(100% 20%, 75% 55%, 100% 88%, 0 100%, 25% 52%, 0 0)' }} />
        {/* Hat & Body */}
        <div style={{ position: 'absolute', left: '55px', top: '15px', width: '32px', height: '18px', background: '#000', clipPath: 'polygon(0 100%, 100% 100%, 64% 70%, 45% 0, 27% 70%)' }} />
        <div style={{ position: 'absolute', left: '60px', top: '28px', width: '16px', height: '16px', borderRadius: '50%', background: '#000' }} />
        <div style={{ position: 'absolute', left: '56px', top: '40px', width: '25px', height: '32px', background: '#000', clipPath: 'polygon(45% 0, 65% 0, 100% 100%, 0 100%)' }} />
      </div>

      {/* Flying Bats */}
      <div style={{
        position: 'absolute', zIndex: 9, width: '45px', height: '22px',
        animation: 'batFly 12s linear infinite 2s',
      }}>
        <div style={{ position: 'absolute', left: '19px', top: '6px', width: '7px', height: '12px', borderRadius: '50%', background: '#000' }} />
        <div style={{ position: 'absolute', left: 0, top: '2px', width: '22px', height: '16px', background: '#000', clipPath: 'polygon(100% 55%, 72% 0, 54% 42%, 0 8%, 14% 100%, 53% 68%)' }} />
        <div style={{ position: 'absolute', right: 0, top: '2px', width: '22px', height: '16px', background: '#000', clipPath: 'polygon(0 55%, 28% 0, 46% 42%, 100% 8%, 86% 100%, 47% 68%)' }} />
      </div>

      <div style={{
        position: 'absolute', zIndex: 9, width: '35px', height: '18px',
        animation: 'batFly 15s linear infinite 7s',
      }}>
        <div style={{ position: 'absolute', left: '15px', top: '5px', width: '6px', height: '10px', borderRadius: '50%', background: '#000' }} />
        <div style={{ position: 'absolute', left: 0, top: '2px', width: '18px', height: '13px', background: '#000', clipPath: 'polygon(100% 55%, 72% 0, 54% 42%, 0 8%, 14% 100%, 53% 68%)' }} />
        <div style={{ position: 'absolute', right: 0, top: '2px', width: '18px', height: '13px', background: '#000', clipPath: 'polygon(0 55%, 28% 0, 46% 42%, 100% 8%, 86% 100%, 47% 68%)' }} />
      </div>

      {/* Lightning Flash */}
      <div style={{
        position: 'absolute', zIndex: 8, left: '50%', top: '8%', width: '120px', height: '55%',
        animation: 'sirenFlash 8s infinite 4s', opacity: 0,
        filter: 'drop-shadow(0 0 10px #adcfff)',
      }}>
        <div style={{
          position: 'absolute', inset: 0, background: '#f2f5ff',
          clipPath: 'polygon(60% 0, 0 30%, 45% 29%, 15% 60%, 58% 57%, 32% 100%, 85% 51%, 52% 52%, 88% 20%, 52% 22%)',
        }} />
      </div>

      {/* Rolling Ground Fog */}
      <div style={{
        position: 'absolute', left: '-20%', bottom: '5%', width: '140%', height: '25%', zIndex: 11,
        background: 'radial-gradient(ellipse at 20% 50%, rgba(180, 185, 185, 0.08), transparent 35%), radial-gradient(ellipse at 65% 45%, rgba(180, 185, 185, 0.06), transparent 40%), radial-gradient(ellipse at 90% 58%, rgba(180, 185, 185, 0.07), transparent 32%)',
        filter: 'blur(16px)', animation: 'float 14s ease-in-out infinite alternate',
      }} />
    </div>
  );
};
