import React, { useState } from 'react';
import type { StoryDto, GenreId } from '@plotweaver/shared';
import { GENRE_REGISTRY, GENRE_IDS } from '@plotweaver/shared';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Sparkles,
  Palette,
  Download,
  Bookmark,
  Layers,
  ChevronDown,
} from 'lucide-react';

interface WorkspaceHeaderProps {
  story: StoryDto;
  totalScenes: number;
  totalBranches: number;
  onSelectGenreTheme: (genre: GenreId) => void;
  currentThemeGenre: GenreId;
  onOpenExport?: () => void;
  onStoreSnapshot?: () => void;
}

export const WorkspaceHeader: React.FC<WorkspaceHeaderProps> = ({
  story,
  totalScenes,
  totalBranches,
  onSelectGenreTheme,
  currentThemeGenre,
  onOpenExport,
  onStoreSnapshot,
}) => {
  const [showThemePicker, setShowThemePicker] = useState(false);
  const currentGenreMeta = GENRE_REGISTRY[currentThemeGenre] || GENRE_REGISTRY[story.genre];

  const headerBtn: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.35rem',
    padding: '0.4rem 0.75rem',
    borderRadius: 'var(--radius-md)',
    background: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    color: 'var(--theme-text)',
    fontSize: '0.75rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textDecoration: 'none',
  };

  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.65rem 1.5rem',
        background: 'rgba(7, 8, 11, 0.8)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      {/* Left */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        <Link
          to="/"
          style={{
            ...headerBtn,
            color: 'var(--theme-muted)',
          }}
        >
          <ArrowLeft size={14} />
          <span>Studio</span>
        </Link>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h1 style={{
              fontSize: '1.1rem', fontWeight: 700, fontFamily: 'var(--theme-font-family)',
              color: 'var(--theme-text)', margin: 0, letterSpacing: '-0.01em',
            }}>
              {story.title}
            </h1>

            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
              padding: '0.15rem 0.45rem', borderRadius: 'var(--radius-sm)',
              background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)',
              fontSize: '0.68rem', fontWeight: 600, color: 'var(--theme-accent)',
            }}>
              {currentGenreMeta.icon} {currentGenreMeta.displayName}
            </span>

            <span style={{
              fontSize: '0.68rem', padding: '0.15rem 0.4rem',
              borderRadius: 'var(--radius-sm)', background: 'rgba(255, 255, 255, 0.03)',
              color: 'var(--theme-muted)',
            }}>
              {story.tone}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.68rem', color: 'var(--theme-muted)', marginTop: '0.15rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
              <Layers size={11} /> {totalScenes} scenes
            </span>
            <span>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
              <Sparkles size={11} color="var(--theme-accent)" /> {totalBranches} branches
            </span>
          </div>
        </div>
      </div>

      {/* Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', position: 'relative' }}>
        {/* Theme Switcher */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowThemePicker(p => !p)}
            style={headerBtn}
          >
            <Palette size={13} color="var(--theme-accent)" />
            <span>Theme</span>
            <ChevronDown size={12} />
          </button>

          {showThemePicker && (
            <>
              <div
                onClick={() => setShowThemePicker(false)}
                style={{ position: 'fixed', inset: 0, zIndex: 99 }}
              />
              <div style={{
                position: 'absolute', top: '115%', right: 0, width: '220px',
                background: 'rgba(15, 18, 28, 0.95)', border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 'var(--radius-md)', boxShadow: '0 15px 40px rgba(0, 0, 0, 0.6)',
                padding: '0.4rem', zIndex: 100, backdropFilter: 'blur(20px)',
                animation: 'fadeIn 0.15s ease-out forwards',
              }}>
                <div style={{
                  fontSize: '0.62rem', fontWeight: 700, color: 'var(--theme-muted)',
                  padding: '0.3rem 0.5rem', letterSpacing: '0.06em', textTransform: 'uppercase',
                }}>
                  10 Genre Atmospheres
                </div>
                {GENRE_IDS.map(gid => {
                  const g = GENRE_REGISTRY[gid];
                  const isCur = gid === currentThemeGenre;
                  return (
                    <button
                      key={gid}
                      onClick={() => { onSelectGenreTheme(gid); setShowThemePicker(false); }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '0.4rem', width: '100%',
                        padding: '0.35rem 0.5rem', borderRadius: 'var(--radius-sm)',
                        background: isCur ? 'rgba(255, 255, 255, 0.06)' : 'transparent',
                        color: isCur ? 'var(--theme-accent)' : 'var(--theme-text)',
                        border: isCur ? '1px solid var(--theme-accent)' : '1px solid transparent',
                        fontSize: '0.75rem', textAlign: 'left', fontWeight: isCur ? 700 : 500,
                        cursor: 'pointer', transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={e => { if (!isCur) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)'; }}
                      onMouseLeave={e => { if (!isCur) e.currentTarget.style.background = 'transparent'; }}
                    >
                      <span>{g.icon}</span>
                      <span>{g.displayName}</span>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>

        <Link to="/library" style={headerBtn} title="Multiverse Vault">
          <Bookmark size={13} color="var(--theme-accent)" />
          <span>Vault</span>
        </Link>

        <button onClick={onStoreSnapshot} style={headerBtn} title="Store Snapshot">
          <Sparkles size={13} color="var(--theme-accent)" />
          <span>Store</span>
        </button>

        <button
          onClick={onOpenExport}
          style={{
            ...headerBtn,
            background: 'var(--theme-accent)',
            color: 'var(--theme-accent-contrast)',
            border: '1px solid var(--theme-accent)',
            fontWeight: 700,
            boxShadow: '0 0 12px var(--theme-glow)',
          }}
          title="Export Draft"
        >
          <Download size={13} />
          <span>Export</span>
        </button>
      </div>
    </header>
  );
};
