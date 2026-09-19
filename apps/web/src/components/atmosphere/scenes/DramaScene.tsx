import React, { useMemo } from 'react';

export const DramaScene: React.FC = () => {
  const dustMotes = useMemo(() => {
    return Array.from({ length: 28 }, (_, i) => ({
      id: i,
      left: `${40 + ((i * 3.7) % 25)}%`,
      top: `${20 + ((i * 4.3) % 65)}%`,
      size: `${1.5 + (i % 3)}px`,
      duration: `${4 + (i % 4)}s`,
      delay: `${(i * 0.3) % 3}s`,
    }));
  }, []);

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {/* Theater Atmosphere Background */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at 50% 40%, rgba(106, 20, 35, 0.25), transparent 45%), radial-gradient(ellipse at 50% 65%, rgba(219, 143, 66, 0.12), transparent 40%), linear-gradient(180deg, #030203 0%, #100407 42%, #1a060a 75%, #030102 100%)',
      }} />

      {/* Architectural Proscenium Arch */}
      <div style={{
        position: 'absolute', left: '10%', right: '10%', top: '6%', bottom: '20%',
        border: '2px solid rgba(196, 143, 67, 0.16)', borderRadius: '50% 50% 0 0 / 25% 25% 0 0',
        boxShadow: 'inset 0 0 50px rgba(219, 143, 66, 0.05)',
      }} />

      {/* Golden Inner Arc Line */}
      <div style={{
        position: 'absolute', left: '20%', right: '20%', top: '12%', height: '40%',
        borderTop: '1px solid rgba(242, 193, 104, 0.12)', borderRadius: '50%',
      }} />

      {/* Swaying Spotlight Beam */}
      <div style={{
        position: 'absolute', left: '50%', top: '-10%', width: '400px', height: '110%',
        transform: 'translateX(-50%)',
        background: 'conic-gradient(from 180deg at 50% 0%, transparent 160deg, rgba(255, 232, 182, 0.12) 175deg, rgba(255, 215, 145, 0.18) 180deg, rgba(255, 232, 182, 0.12) 185deg, transparent 200deg)',
        filter: 'blur(10px)',
        animation: 'float 7s ease-in-out infinite alternate',
      }}>
        {/* Spotlight Stage Pool */}
        <div style={{
          position: 'absolute', bottom: '15%', left: '50%', transform: 'translateX(-50%)',
          width: '320px', height: '80px', borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(255, 191, 90, 0.15) 0%, transparent 70%)',
          filter: 'blur(8px)',
        }} />
      </div>

      {/* Perspective Stage Wooden Floorboards */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, height: '28%',
        background: 'linear-gradient(180deg, #3d1e0d 0%, #1f0e05 35%, #080302 100%)',
        borderTop: '1px solid rgba(211, 155, 78, 0.2)',
      }}>
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.12,
          backgroundImage: 'repeating-linear-gradient(90deg, transparent 0 60px, rgba(211, 155, 78, 0.6) 61px 62px, transparent 63px 120px)',
          transform: 'perspective(300px) rotateX(25deg)',
        }} />
      </div>

      {/* Velvet Red Curtains (Left Drapery) */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: '22vw', minWidth: '180px',
        background: 'linear-gradient(90deg, #090103 0%, #3b0610 20%, #160205 40%, #610914 60%, #210205 80%, #50070f 100%)',
        clipPath: 'polygon(0 0, 100% 0, 85% 35%, 95% 65%, 80% 100%, 0 100%)',
        boxShadow: '10px 0 35px rgba(0, 0, 0, 0.8)',
        opacity: 0.9,
      }} />

      {/* Velvet Red Curtains (Right Drapery) */}
      <div style={{
        position: 'absolute', right: 0, top: 0, bottom: 0, width: '22vw', minWidth: '180px',
        background: 'linear-gradient(270deg, #090103 0%, #3b0610 20%, #160205 40%, #610914 60%, #210205 80%, #50070f 100%)',
        clipPath: 'polygon(0 0, 100% 0, 100% 100%, 20% 100%, 5% 65%, 15% 35%)',
        boxShadow: '-10px 0 35px rgba(0, 0, 0, 0.8)',
        opacity: 0.9,
      }} />

      {/* Floating Golden Dust Particles */}
      {dustMotes.map(d => (
        <div
          key={d.id}
          style={{
            position: 'absolute',
            left: d.left,
            top: d.top,
            width: d.size,
            height: d.size,
            borderRadius: '50%',
            background: '#ffdf96',
            boxShadow: '0 0 6px #ffbe59',
            opacity: 0.6,
            animation: `float ${d.duration} ease-in-out infinite ${d.delay}`,
          }}
        />
      ))}
    </div>
  );
};
