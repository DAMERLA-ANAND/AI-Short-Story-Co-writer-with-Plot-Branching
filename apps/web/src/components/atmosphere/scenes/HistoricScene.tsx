import React from 'react';

export const HistoricScene: React.FC = () => {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {/* Blazing Desert Sky */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(circle at 50% 28%, rgba(255, 214, 120, 0.35), transparent 30%), linear-gradient(180deg, #090604 0%, #241006 32%, #713b13 62%, #d48a32 100%)',
      }} />

      {/* Sun */}
      <div style={{
        position: 'absolute', left: '50%', top: '28%', width: '150px', height: '150px',
        transform: 'translate(-50%, -50%)', borderRadius: '50%',
        background: 'radial-gradient(circle, #fff0b0 0 16%, #ffc85c 43%, #e89224 68%, transparent 70%)',
        boxShadow: '0 0 60px 25px rgba(244, 161, 44, 0.25), 0 0 160px 70px rgba(190, 94, 15, 0.2)',
      }} />

      {/* Distant Mountains */}
      <div style={{
        position: 'absolute', left: '-5%', right: '-5%', bottom: '38%', height: '22%',
        background: '#271107',
        clipPath: 'polygon(0 80%, 8% 48%, 15% 72%, 24% 30%, 32% 66%, 43% 22%, 51% 62%, 62% 35%, 72% 70%, 83% 28%, 92% 62%, 100% 43%, 100% 100%, 0 100%)',
        opacity: 0.8,
      }} />

      {/* Left Pyramid */}
      <div style={{
        position: 'absolute', left: '6%', bottom: '32%', zIndex: 2,
        filter: 'drop-shadow(10px 15px 12px rgba(0,0,0,0.5))',
      }}>
        <div style={{
          width: 0, height: 0,
          borderLeft: '110px solid transparent',
          borderRight: '110px solid transparent',
          borderBottom: '160px solid #8d4b19',
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute', left: '-110px', top: 0,
            borderLeft: '110px solid transparent',
            borderBottom: '160px solid #d18a38',
            opacity: 0.55,
          }} />
        </div>
      </div>

      {/* Right Pyramid */}
      <div style={{
        position: 'absolute', right: '6%', bottom: '33%', zIndex: 2,
        transform: 'scale(0.85)',
        filter: 'drop-shadow(-10px 15px 12px rgba(0,0,0,0.5))',
      }}>
        <div style={{
          width: 0, height: 0,
          borderLeft: '110px solid transparent',
          borderRight: '110px solid transparent',
          borderBottom: '160px solid #8d4b19',
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute', left: '-110px', top: 0,
            borderLeft: '110px solid transparent',
            borderBottom: '160px solid #d18a38',
            opacity: 0.55,
          }} />
        </div>
      </div>

      {/* Center Grand Pyramid */}
      <div style={{
        position: 'absolute', left: '50%', bottom: '29%', zIndex: 3,
        transform: 'translateX(-50%) scale(1.1)',
        filter: 'drop-shadow(0 15px 15px rgba(0,0,0,0.6))',
      }}>
        <div style={{
          width: 0, height: 0,
          borderLeft: '125px solid transparent',
          borderRight: '125px solid transparent',
          borderBottom: '175px solid #704016',
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute', left: '-125px', top: 0,
            borderLeft: '125px solid transparent',
            borderBottom: '175px solid #bd752c',
            opacity: 0.45,
          }} />
        </div>
      </div>

      {/* Rolling Sand Dunes */}
      <div style={{
        position: 'absolute', left: '-10%', right: '-10%', bottom: '-15%', height: '52%', zIndex: 5,
        background: 'radial-gradient(ellipse at 50% 0%, rgba(255, 211, 126, 0.45), transparent 40%), linear-gradient(160deg, #e1a149 0%, #b76520 55%, #663010 100%)',
        borderRadius: '50% 50% 0 0 / 20% 20% 0 0',
      }} />

      {/* Ancient Temple Silhouette */}
      <div style={{
        position: 'absolute', left: '50%', bottom: '27%', width: '380px', height: '160px',
        transform: 'translateX(-50%)', zIndex: 6,
        filter: 'drop-shadow(0 15px 12px rgba(0,0,0,0.6))',
      }}>
        {/* Temple Roof */}
        <div style={{
          position: 'absolute', left: '5px', top: 0, width: '370px', height: '18px',
          background: 'linear-gradient(#d39a4e, #754016)',
          clipPath: 'polygon(4% 0, 96% 0, 100% 100%, 0 100%)',
        }} />
        {/* Columns */}
        {[30, 95, 160, 225, 290].map((left, idx) => (
          <div
            key={idx}
            style={{
              position: 'absolute', bottom: 0, left: `${left}px`, width: '36px', height: '130px',
              background: 'linear-gradient(90deg, #633510, #d39a4d 48%, #714017)',
              borderRadius: '3px 3px 2px 2px',
            }}
          />
        ))}
        {/* Doorway */}
        <div style={{
          position: 'absolute', bottom: 0, left: '145px', width: '90px', height: '105px',
          background: '#120904', borderRadius: '45px 45px 0 0',
          boxShadow: 'inset 0 0 25px #000',
        }}>
          {/* Glowing Artifact inside Doorway */}
          <div style={{
            position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)',
            width: '24px', height: '36px', borderRadius: '50%',
            background: '#ffbd48', filter: 'blur(8px)', opacity: 0.7,
            animation: 'pulseGlow 2.5s ease-in-out infinite',
          }} />
        </div>
      </div>

      {/* Blowing Desert Wind & Dust Streaks */}
      <div style={{
        position: 'absolute', top: '55%', left: '-500px', width: '500px', height: '2px', zIndex: 8,
        background: 'linear-gradient(90deg, transparent, rgba(255, 226, 160, 0.7), transparent)',
        animation: 'dustDrift 4s linear infinite',
      }} />
      <div style={{
        position: 'absolute', top: '65%', left: '-600px', width: '550px', height: '2px', zIndex: 8,
        background: 'linear-gradient(90deg, transparent, rgba(255, 226, 160, 0.6), transparent)',
        animation: 'dustDrift 5.5s linear infinite 1.5s',
      }} />
    </div>
  );
};
