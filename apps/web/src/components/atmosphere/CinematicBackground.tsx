import React, { useState, useEffect } from 'react';
import type { GenreId } from '@plotweaver/shared';

import { AdventureScene } from './scenes/AdventureScene.js';
import { LoveScene } from './scenes/LoveScene.js';
import { ComedyScene } from './scenes/ComedyScene.js';
import { DramaScene } from './scenes/DramaScene.js';
import { HorrorScene } from './scenes/HorrorScene.js';
import { HistoricScene } from './scenes/HistoricScene.js';
import { ScifiScene } from './scenes/ScifiScene.js';
import { DetectiveScene } from './scenes/DetectiveScene.js';
import { ThrillerScene } from './scenes/ThrillerScene.js';
import { FantasyScene } from './scenes/FantasyScene.js';

interface CinematicBackgroundProps {
  genreId: GenreId;
  dimmerOpacity?: number;
}

function renderGenreScene(genre: GenreId): React.ReactNode {
  switch (genre) {
    case 'adventure':
      return <AdventureScene />;
    case 'love':
      return <LoveScene />;
    case 'comedy':
      return <ComedyScene />;
    case 'drama':
      return <DramaScene />;
    case 'horror':
      return <HorrorScene />;
    case 'historical':
      return <HistoricScene />;
    case 'scifi':
      return <ScifiScene />;
    case 'detective':
      return <DetectiveScene />;
    case 'thriller':
      return <ThrillerScene />;
    case 'fantasy':
    default:
      return <FantasyScene />;
  }
}

export const CinematicBackground: React.FC<CinematicBackgroundProps> = ({
  genreId,
  dimmerOpacity = 0.78,
}) => {
  const [currentGenre, setCurrentGenre] = useState<GenreId>(genreId);
  const [prevGenre, setPrevGenre] = useState<GenreId | null>(null);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    if (genreId !== currentGenre) {
      setPrevGenre(currentGenre);
      setCurrentGenre(genreId);
      setIsFading(true);

      const timer = setTimeout(() => {
        setPrevGenre(null);
        setIsFading(false);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [genreId, currentGenre]);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      pointerEvents: 'none',
      zIndex: 0,
      overflow: 'hidden',
      userSelect: 'none',
    }}>
      {/* Previous Scene (Cross-fading out) */}
      {prevGenre && (
        <div style={{
          position: 'absolute',
          inset: 0,
          opacity: isFading ? 0 : 1,
          transition: 'opacity 0.5s ease-in-out',
        }}>
          {renderGenreScene(prevGenre)}
        </div>
      )}

      {/* Current Active Scene (Cross-fading in) */}
      <div style={{
        position: 'absolute',
        inset: 0,
        opacity: 1,
        transition: 'opacity 0.5s ease-in-out',
      }}>
        {renderGenreScene(currentGenre)}
      </div>

      {/* Atmospheric Contrast Dimmer Layer */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `rgba(0, 0, 0, ${dimmerOpacity})`,
        backdropFilter: 'blur(1px)',
        transition: 'background 0.5s ease',
      }} />

      {/* Cinematic Vignette */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at center, transparent 35%, rgba(0, 0, 0, 0.55) 75%, rgba(0, 0, 0, 0.92) 100%)',
      }} />
    </div>
  );
};
