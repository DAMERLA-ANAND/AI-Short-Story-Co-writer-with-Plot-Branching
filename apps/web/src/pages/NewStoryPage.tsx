import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GENRE_REGISTRY, GENRE_IDS, GenreId, TONES, Tone } from '@plotweaver/shared';
import { createStory } from '../api/stories.js';
import { StudioNavbar } from '../components/layout/StudioNavbar.js';
import { CinematicBackground } from '../components/atmosphere/CinematicBackground.js';
import {
  Sparkles,
  Compass,
  ArrowRight,
  Flame,
  Loader2,
  Feather,
} from 'lucide-react';

interface Preset {
  id: string;
  title: string;
  genre: GenreId;
  tone: Tone;
  premise: string;
  tag: string;
}

const BENCHMARK_PRESETS: Preset[] = [
  {
    id: 'mystery-noir',
    title: 'The Hidden Door',
    genre: 'detective',
    tone: 'Noir',
    premise:
      'A detective finds a coded message in an old library book. The sender is someone she thought was dead.',
    tag: 'Official Benchmark #1',
  },
  {
    id: 'scifi-dark',
    title: 'Event Horizon Protocol',
    genre: 'scifi',
    tone: 'Dark',
    premise:
      "An astronaut wakes from cryosleep to find the ship's AI has gone rogue and is heading toward a black hole.",
    tag: 'Official Benchmark #2',
  },
  {
    id: 'fantasy-epic',
    title: 'Whispers of the Amulet',
    genre: 'fantasy',
    tone: 'Epic',
    premise:
      'A thief discovers a magical amulet in a pawn shop. It whispers secrets that are destroying her peace of mind.',
    tag: 'Official Benchmark #3',
  },
  {
    id: 'horror-suspense',
    title: 'Through the Drywall',
    genre: 'horror',
    tone: 'Suspenseful',
    premise:
      'A woman moves into a new apartment and realizes her neighbor has been watching her through the walls.',
    tag: 'Official Benchmark #4',
  },
];

export const NewStoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<GenreId>('detective');
  const [selectedTone, setSelectedTone] = useState<string>('Noir');
  const [premise, setPremise] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const activeGenreMeta = GENRE_REGISTRY[selectedGenre];

  const handleApplyPreset = (preset: Preset) => {
    setTitle(preset.title);
    setSelectedGenre(preset.genre);
    setSelectedTone(preset.tone);
    setPremise(preset.premise);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { setError('Please enter a story title.'); return; }
    if (!premise.trim() || premise.trim().length < 10) { setError('Please enter a premise of at least 10 characters.'); return; }
    setIsLoading(true);
    setError(null);
    try {
      const workspace = await createStory({
        title: title.trim(),
        genre: selectedGenre,
        tone: selectedTone.trim() || 'Suspenseful',
        premise: premise.trim(),
      });
      navigate(`/workspace/${workspace.story.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to create story. Please try again.');
      setIsLoading(false);
    }
  };

  // CSS helper
  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.85rem 1.1rem',
    borderRadius: 'var(--radius-md)',
    backgroundColor: 'rgba(10, 13, 20, 0.85)',
    border: '1.5px solid rgba(255, 255, 255, 0.15)',
    fontSize: '0.95rem',
    color: '#ffffff',
    outline: 'none',
    transition: 'all 0.25s ease',
    letterSpacing: '0.01em',
    boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.4)',
  };

  return (
    <div data-genre={selectedGenre} style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <CinematicBackground genreId={selectedGenre} dimmerOpacity={0.84} />
      <StudioNavbar />

      <div style={{
        position: 'relative',
        zIndex: 10,
        width: '100%',
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        padding: '2.5rem 1.5rem 4rem',
      }}>
        <div style={{ maxWidth: '780px', width: '100%', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>

          {/* ── Brand Header ── */}
          <div style={{ textAlign: 'center', animation: 'fadeInUp 0.6s ease-out forwards' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.3rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              color: 'var(--theme-accent)',
              fontSize: '0.7rem',
              fontWeight: 700,
              letterSpacing: '0.05em',
              marginBottom: '1.25rem',
              textTransform: 'uppercase',
            }}>
              <Sparkles size={12} />
              <span>AI Short Story Co-Writer with Plot Branching</span>
            </div>

            <h1 style={{
              fontSize: 'clamp(2rem, 5vw, 3.2rem)',
              fontWeight: 800,
              fontFamily: 'var(--theme-font-family)',
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              marginBottom: '0.75rem',
              background: `linear-gradient(135deg, var(--theme-text) 40%, var(--theme-accent) 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              PlotWeaver Studio
            </h1>

            <p style={{
              color: 'var(--theme-muted)',
              fontSize: '1rem',
              maxWidth: '55ch',
              margin: '0 auto',
              lineHeight: 1.6,
              opacity: 0.8,
            }}>
              Brainstorm, branch, and navigate your narrative multiverse.
              Never face a blank page again.
            </p>
          </div>

          {/* ── Benchmark Presets ── */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem',
            animation: 'fadeInUp 0.6s ease-out 0.1s both',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Flame size={14} color="var(--theme-accent)" />
                <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--theme-text)' }}>
                  Quick-Start Presets
                </span>
              </div>
              <span style={{ fontSize: '0.65rem', color: 'var(--theme-muted)', fontWeight: 500 }}>
                1-Click Setup
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(165px, 1fr))', gap: '0.6rem' }}>
              {BENCHMARK_PRESETS.map((p, idx) => {
                const genreData = GENRE_REGISTRY[p.genre];
                const isSelected = title === p.title && selectedGenre === p.genre;
                return (
                  <button
                    type="button"
                    key={p.id}
                    onClick={() => handleApplyPreset(p)}
                    style={{
                      padding: '0.75rem',
                      borderRadius: 'var(--radius-md)',
                      background: isSelected ? 'rgba(var(--theme-accent), 0.08)' : 'rgba(255, 255, 255, 0.02)',
                      border: isSelected ? '1.5px solid var(--theme-accent)' : '1px solid rgba(255, 255, 255, 0.07)',
                      boxShadow: isSelected ? '0 0 20px var(--theme-glow)' : 'none',
                      textAlign: 'left',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.35rem',
                      transition: 'all 0.25s ease',
                      cursor: 'pointer',
                      animation: `fadeIn 0.4s ease-out ${0.05 * (idx + 1)}s both`,
                    }}
                    onMouseEnter={e => {
                      if (!isSelected) {
                        e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.15)';
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }
                    }}
                    onMouseLeave={e => {
                      if (!isSelected) {
                        e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.07)';
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '1.15rem' }}>{genreData.icon}</span>
                      <span style={{
                        fontSize: '0.58rem',
                        fontWeight: 700,
                        color: 'var(--theme-accent)',
                        background: 'rgba(255, 255, 255, 0.05)',
                        padding: '0.1rem 0.35rem',
                        borderRadius: 'var(--radius-sm)',
                      }}>
                        {p.tone}
                      </span>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--theme-text)' }}>{p.title}</div>
                    <div style={{
                      fontSize: '0.68rem', color: 'var(--theme-muted)', lineHeight: 1.35,
                      overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                    }}>
                      {p.premise}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Story Configuration Form ── */}
          <form
            onSubmit={handleSubmit}
            style={{
              background: 'rgba(255, 255, 255, 0.025)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.4rem',
              animation: 'fadeInUp 0.6s ease-out 0.2s both',
            }}
          >
            {/* Error */}
            {error && (
              <div style={{
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#fca5a5',
                fontSize: '0.82rem',
              }}>
                {error}
              </div>
            )}

            {/* Story Title */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.72rem',
                fontWeight: 700,
                marginBottom: '0.45rem',
                color: 'var(--theme-accent)',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}>
                Story Title
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. The Riverside Asylum, The Broken Constellation..."
                style={inputStyle}
                required
              />
            </div>

            {/* Genre Selection Grid */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <label style={{
                  fontSize: '0.72rem', fontWeight: 700, color: 'var(--theme-accent)',
                  letterSpacing: '0.06em', textTransform: 'uppercase',
                }}>
                  Genre World
                </label>
                <span style={{ fontSize: '0.68rem', color: 'var(--theme-muted)', fontWeight: 500 }}>
                  Active: <strong style={{ color: 'var(--theme-text)' }}>{activeGenreMeta.displayName}</strong>
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(135px, 1fr))', gap: '0.4rem' }}>
                {GENRE_IDS.map(gid => {
                  const g = GENRE_REGISTRY[gid];
                  const isSelected = selectedGenre === gid;
                  return (
                    <button
                      type="button"
                      key={gid}
                      onClick={() => setSelectedGenre(gid)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        padding: '0.55rem 0.7rem',
                        borderRadius: 'var(--radius-md)',
                        background: isSelected ? 'var(--theme-accent)' : 'rgba(255, 255, 255, 0.03)',
                        color: isSelected ? 'var(--theme-accent-contrast)' : 'var(--theme-text)',
                        border: isSelected ? '1px solid var(--theme-accent)' : '1px solid rgba(255, 255, 255, 0.07)',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        textAlign: 'left',
                        transition: 'all 0.2s ease',
                        boxShadow: isSelected ? '0 0 15px var(--theme-glow)' : 'none',
                      }}
                      onMouseEnter={e => {
                        if (!isSelected) {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                        }
                      }}
                      onMouseLeave={e => {
                        if (!isSelected) {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.07)';
                        }
                      }}
                    >
                      <span>{g.icon}</span>
                      <span>{g.displayName}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tone Selection */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.72rem', fontWeight: 700, marginBottom: '0.45rem',
                color: 'var(--theme-accent)', letterSpacing: '0.06em', textTransform: 'uppercase',
              }}>
                Narrative Tone
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.5rem' }}>
                {TONES.map(t => {
                  const isSel = selectedTone === t;
                  return (
                    <button
                      type="button"
                      key={t}
                      onClick={() => setSelectedTone(t)}
                      style={{
                        padding: '0.3rem 0.65rem',
                        borderRadius: 'var(--radius-full)',
                        background: isSel ? 'var(--theme-accent)' : 'rgba(255, 255, 255, 0.04)',
                        color: isSel ? 'var(--theme-accent-contrast)' : 'var(--theme-muted)',
                        border: isSel ? '1px solid var(--theme-accent)' : '1px solid rgba(255, 255, 255, 0.08)',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <span style={{ fontSize: '0.68rem', color: 'var(--theme-muted)', fontWeight: 500 }}>
                  Custom Tone Specification:
                </span>
                <input
                  type="text"
                  value={selectedTone}
                  onChange={e => setSelectedTone(e.target.value)}
                  placeholder="Or enter custom tone (e.g. Gritty, Melancholy, Surreal)..."
                  style={{ ...inputStyle, fontSize: '0.85rem', padding: '0.65rem 0.9rem' }}
                />
              </div>
            </div>

            {/* Premise */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
                <label style={{
                  fontSize: '0.72rem', fontWeight: 700, color: 'var(--theme-accent)',
                  letterSpacing: '0.06em', textTransform: 'uppercase',
                }}>
                  Opening Premise
                </label>
                <span style={{ fontSize: '0.65rem', color: 'var(--theme-muted)', fontWeight: 500 }}>
                  {premise.length} characters
                </span>
              </div>
              <textarea
                value={premise}
                onChange={e => setPremise(e.target.value)}
                rows={4}
                placeholder="Describe the inciting incident, key protagonist, and immediate mystery or danger..."
                style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
                required
              />
            </div>

            {/* AI Guidance Preview */}
            <div style={{
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(0, 0, 0, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              fontSize: '0.75rem',
              color: 'var(--theme-muted)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.5rem',
            }}>
              <Compass size={14} color="var(--theme-accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <span style={{ fontWeight: 700, color: 'var(--theme-text)', fontSize: '0.72rem' }}>World Narrative Focus: </span>
                <span style={{ opacity: 0.8 }}>"{activeGenreMeta.aiGuidance}"</span>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                marginTop: '0.25rem',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                background: `linear-gradient(135deg, var(--theme-accent) 0%, color-mix(in srgb, var(--theme-accent) 70%, #a855f7) 100%)`,
                color: 'var(--theme-accent-contrast)',
                fontSize: '0.95rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.6rem',
                boxShadow: '0 0 30px var(--theme-glow), 0 8px 25px rgba(0, 0, 0, 0.3)',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.75 : 1,
                transition: 'all 0.3s ease',
                border: 'none',
                letterSpacing: '0.01em',
              }}
              onMouseEnter={e => {
                if (!isLoading) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 0 40px var(--theme-glow), 0 12px 30px rgba(0, 0, 0, 0.4)';
                }
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 0 30px var(--theme-glow), 0 8px 25px rgba(0, 0, 0, 0.3)';
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Weaving Opening Scene...</span>
                </>
              ) : (
                <>
                  <Feather size={18} />
                  <span>Start Writing & Generate Opening Scene</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
