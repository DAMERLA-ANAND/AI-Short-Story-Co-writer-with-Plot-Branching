import React, { useMemo } from 'react';
import { GenreId } from '@plotweaver/shared';

interface CinematicBackgroundProps {
  genreId: GenreId;
  dimmerOpacity?: number;
}

/*
 * Rich animated CSS-only atmospheric backgrounds per genre.
 * Uses layered radial gradients, animated color shifts, and
 * floating particle pseudo-elements for depth.
 */

const GENRE_BG_CONFIGS: Record<GenreId, {
  gradient: string;
  orb1: string;
  orb2: string;
  orb3: string;
  particleColor: string;
}> = {
  detective: {
    gradient: 'linear-gradient(135deg, #0c0d10 0%, #14161c 40%, #1a1510 70%, #0c0d10 100%)',
    orb1: 'radial-gradient(circle at 20% 30%, rgba(245, 158, 11, 0.12) 0%, transparent 50%)',
    orb2: 'radial-gradient(circle at 75% 70%, rgba(217, 119, 6, 0.08) 0%, transparent 45%)',
    orb3: 'radial-gradient(circle at 50% 90%, rgba(180, 83, 9, 0.06) 0%, transparent 40%)',
    particleColor: 'rgba(245, 158, 11, 0.3)',
  },
  scifi: {
    gradient: 'linear-gradient(135deg, #050a15 0%, #0a1628 30%, #0e1a30 60%, #050a15 100%)',
    orb1: 'radial-gradient(circle at 30% 20%, rgba(0, 229, 255, 0.15) 0%, transparent 50%)',
    orb2: 'radial-gradient(circle at 70% 60%, rgba(139, 92, 246, 0.1) 0%, transparent 45%)',
    orb3: 'radial-gradient(circle at 90% 10%, rgba(6, 182, 212, 0.08) 0%, transparent 35%)',
    particleColor: 'rgba(0, 229, 255, 0.35)',
  },
  horror: {
    gradient: 'linear-gradient(135deg, #090507 0%, #150f12 35%, #1a0a0e 65%, #090507 100%)',
    orb1: 'radial-gradient(circle at 50% 40%, rgba(239, 68, 68, 0.12) 0%, transparent 50%)',
    orb2: 'radial-gradient(circle at 20% 80%, rgba(127, 29, 29, 0.1) 0%, transparent 45%)',
    orb3: 'radial-gradient(circle at 80% 20%, rgba(185, 28, 28, 0.06) 0%, transparent 35%)',
    particleColor: 'rgba(239, 68, 68, 0.25)',
  },
  fantasy: {
    gradient: 'linear-gradient(135deg, #060d0a 0%, #0a1a14 35%, #0d1f18 65%, #060d0a 100%)',
    orb1: 'radial-gradient(circle at 40% 25%, rgba(168, 85, 247, 0.15) 0%, transparent 50%)',
    orb2: 'radial-gradient(circle at 70% 65%, rgba(234, 179, 8, 0.1) 0%, transparent 45%)',
    orb3: 'radial-gradient(circle at 15% 75%, rgba(52, 211, 153, 0.07) 0%, transparent 35%)',
    particleColor: 'rgba(234, 179, 8, 0.3)',
  },
  love: {
    gradient: 'linear-gradient(135deg, #0f080b 0%, #1a0d13 35%, #200f18 65%, #0f080b 100%)',
    orb1: 'radial-gradient(circle at 35% 35%, rgba(244, 63, 94, 0.14) 0%, transparent 50%)',
    orb2: 'radial-gradient(circle at 65% 70%, rgba(219, 39, 119, 0.09) 0%, transparent 45%)',
    orb3: 'radial-gradient(circle at 80% 20%, rgba(251, 113, 133, 0.06) 0%, transparent 35%)',
    particleColor: 'rgba(244, 63, 94, 0.3)',
  },
  adventure: {
    gradient: 'linear-gradient(135deg, #0b0a07 0%, #18140e 35%, #1d1810 65%, #0b0a07 100%)',
    orb1: 'radial-gradient(circle at 45% 30%, rgba(249, 115, 22, 0.14) 0%, transparent 50%)',
    orb2: 'radial-gradient(circle at 20% 70%, rgba(16, 185, 129, 0.09) 0%, transparent 45%)',
    orb3: 'radial-gradient(circle at 75% 85%, rgba(234, 179, 8, 0.06) 0%, transparent 35%)',
    particleColor: 'rgba(249, 115, 22, 0.3)',
  },
  thriller: {
    gradient: 'linear-gradient(135deg, #080808 0%, #121212 35%, #181818 65%, #080808 100%)',
    orb1: 'radial-gradient(circle at 60% 30%, rgba(234, 179, 8, 0.13) 0%, transparent 50%)',
    orb2: 'radial-gradient(circle at 30% 75%, rgba(239, 68, 68, 0.08) 0%, transparent 45%)',
    orb3: 'radial-gradient(circle at 85% 60%, rgba(234, 179, 8, 0.05) 0%, transparent 35%)',
    particleColor: 'rgba(234, 179, 8, 0.3)',
  },
  comedy: {
    gradient: 'linear-gradient(135deg, #0a0d10 0%, #101820 35%, #14202c 65%, #0a0d10 100%)',
    orb1: 'radial-gradient(circle at 30% 40%, rgba(6, 182, 212, 0.13) 0%, transparent 50%)',
    orb2: 'radial-gradient(circle at 70% 25%, rgba(234, 179, 8, 0.1) 0%, transparent 45%)',
    orb3: 'radial-gradient(circle at 55% 80%, rgba(52, 211, 153, 0.06) 0%, transparent 35%)',
    particleColor: 'rgba(6, 182, 212, 0.3)',
  },
  historical: {
    gradient: 'linear-gradient(135deg, #0c0a08 0%, #171310 35%, #1e1914 65%, #0c0a08 100%)',
    orb1: 'radial-gradient(circle at 50% 30%, rgba(217, 119, 6, 0.12) 0%, transparent 50%)',
    orb2: 'radial-gradient(circle at 25% 70%, rgba(180, 83, 9, 0.08) 0%, transparent 45%)',
    orb3: 'radial-gradient(circle at 80% 50%, rgba(146, 64, 14, 0.06) 0%, transparent 35%)',
    particleColor: 'rgba(217, 119, 6, 0.3)',
  },
  drama: {
    gradient: 'linear-gradient(135deg, #080a10 0%, #0f1320 35%, #141a2c 65%, #080a10 100%)',
    orb1: 'radial-gradient(circle at 40% 35%, rgba(99, 102, 241, 0.13) 0%, transparent 50%)',
    orb2: 'radial-gradient(circle at 70% 65%, rgba(56, 189, 248, 0.08) 0%, transparent 45%)',
    orb3: 'radial-gradient(circle at 20% 80%, rgba(139, 92, 246, 0.05) 0%, transparent 35%)',
    particleColor: 'rgba(99, 102, 241, 0.3)',
  },
};

export const CinematicBackground: React.FC<CinematicBackgroundProps> = ({
  genreId,
  dimmerOpacity = 0.78,
}) => {
  const config = GENRE_BG_CONFIGS[genreId] || GENRE_BG_CONFIGS.detective;

  const particles = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 6 + 4,
      delay: Math.random() * 5,
      opacity: Math.random() * 0.4 + 0.1,
    }));
  }, []);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      pointerEvents: 'none',
      zIndex: 0,
      overflow: 'hidden',
      userSelect: 'none',
    }}>
      {/* Base Gradient Layer */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: config.gradient,
        backgroundSize: '400% 400%',
        animation: 'gradientShift 20s ease infinite',
        transition: 'background 1.5s ease',
      }} />

      {/* Animated Orb Layers */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: config.orb1,
        animation: 'breathe 8s ease-in-out infinite',
        transition: 'background 1.5s ease',
      }} />
      <div style={{
        position: 'absolute',
        inset: 0,
        background: config.orb2,
        animation: 'breathe 12s ease-in-out infinite 2s',
        transition: 'background 1.5s ease',
      }} />
      <div style={{
        position: 'absolute',
        inset: 0,
        background: config.orb3,
        animation: 'breathe 10s ease-in-out infinite 4s',
        transition: 'background 1.5s ease',
      }} />

      {/* Floating Particles */}
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
            backgroundColor: config.particleColor,
            opacity: p.opacity,
            animation: `float ${p.duration}s ease-in-out ${p.delay}s infinite`,
            transition: 'background-color 1.5s ease',
          }}
        />
      ))}

      {/* Grain Noise Texture */}
      <div style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.03,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
        mixBlendMode: 'overlay',
        pointerEvents: 'none',
      }} />

      {/* Dimmer Overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: `rgba(7, 8, 11, ${dimmerOpacity})`,
        pointerEvents: 'none',
        transition: 'background-color 0.5s ease',
      }} />

      {/* Radial Vignette */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at center, transparent 35%, rgba(5, 5, 8, 0.7) 100%)',
        pointerEvents: 'none',
      }} />
    </div>
  );
};
