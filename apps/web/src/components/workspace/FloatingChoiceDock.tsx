import React, { useEffect } from 'react';
import type { ChoiceDto } from '@plotweaver/shared';
import { Zap, Search, GitBranch, ArrowRight, Loader2, Sparkles } from 'lucide-react';

interface FloatingChoiceDockProps {
  choices: ChoiceDto[];
  onSelectChoice: (choiceId: string) => void;
  isGenerating: boolean;
  generatingChoiceId: string | null;
}

const ARCHETYPE_CONFIGS: Record<string, {
  icon: React.ReactNode;
  label: string;
  accentColor: string;
  bgColor: string;
  borderColor: string;
}> = {
  CONFRONTATION: {
    icon: <Zap size={13} />,
    label: 'CONFRONTATION',
    accentColor: '#fb7185',
    bgColor: 'rgba(244, 63, 94, 0.06)',
    borderColor: 'rgba(244, 63, 94, 0.15)',
  },
  INVESTIGATION: {
    icon: <Search size={13} />,
    label: 'INVESTIGATION',
    accentColor: '#22d3ee',
    bgColor: 'rgba(6, 182, 212, 0.06)',
    borderColor: 'rgba(6, 182, 212, 0.15)',
  },
  DIVERGENCE: {
    icon: <GitBranch size={13} />,
    label: 'DIVERGENCE',
    accentColor: '#c084fc',
    bgColor: 'rgba(168, 85, 247, 0.06)',
    borderColor: 'rgba(168, 85, 247, 0.15)',
  },
};

export const FloatingChoiceDock: React.FC<FloatingChoiceDockProps> = ({
  choices,
  onSelectChoice,
  isGenerating,
  generatingChoiceId,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      if (isGenerating) return;
      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= choices.length) {
        const selected = choices.find(c => c.ordinal === num) || choices[num - 1];
        if (selected) { e.preventDefault(); onSelectChoice(selected.id); }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [choices, isGenerating, onSelectChoice]);

  if (choices.length === 0) return null;

  return (
    <div style={{ width: '100%', marginTop: '0.5rem', animation: 'fadeInUp 0.5s ease-out 0.2s both' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', padding: '0 0.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Sparkles size={14} color="var(--theme-accent)" />
          <h3 style={{
            fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.04em',
            textTransform: 'uppercase', color: '#fff', margin: 0,
          }}>
            Choose Path Forward
          </h3>
          <span style={{
            fontSize: '0.62rem', fontFamily: 'monospace', color: 'var(--theme-muted)',
            padding: '0.15rem 0.4rem', borderRadius: 'var(--radius-sm)',
            background: 'rgba(255, 255, 255, 0.03)',
          }}>
            Press 1, 2, 3
          </span>
        </div>
        <span style={{ fontSize: '0.68rem', color: 'var(--theme-muted)' }}>
          {choices.length} directions
        </span>
      </div>

      {/* Choice Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${Math.min(choices.length, 3)}, 1fr)`,
        gap: '0.75rem',
      }}>
        {choices.map((choice, idx) => {
          const config = ARCHETYPE_CONFIGS[choice.archetype] || ARCHETYPE_CONFIGS.DIVERGENCE;
          const isThisGenerating = generatingChoiceId === choice.id;
          const isExplored = choice.state === 'EXPLORED';

          return (
            <button
              key={choice.id}
              onClick={() => onSelectChoice(choice.id)}
              disabled={isGenerating}
              style={{
                position: 'relative',
                textAlign: 'left',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                background: isThisGenerating
                  ? 'rgba(6, 182, 212, 0.06)'
                  : 'rgba(255, 255, 255, 0.02)',
                border: isThisGenerating
                  ? '1.5px solid rgba(6, 182, 212, 0.4)'
                  : '1px solid rgba(255, 255, 255, 0.06)',
                cursor: isGenerating ? 'not-allowed' : 'pointer',
                opacity: isGenerating && !isThisGenerating ? 0.5 : 1,
                transition: 'all 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '0.5rem',
                animation: `fadeInUp 0.4s ease-out ${0.1 * idx}s both`,
                boxShadow: isThisGenerating ? `0 0 20px rgba(6, 182, 212, 0.15)` : 'none',
              }}
              onMouseEnter={e => {
                if (!isGenerating) {
                  e.currentTarget.style.borderColor = config.borderColor;
                  e.currentTarget.style.background = config.bgColor;
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = `0 8px 25px rgba(0, 0, 0, 0.3)`;
                }
              }}
              onMouseLeave={e => {
                if (!isThisGenerating) {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
            >
              {/* Top: Badge & Shortcut */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  padding: '0.2rem 0.5rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.6rem',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  color: config.accentColor,
                  background: config.bgColor,
                  border: `1px solid ${config.borderColor}`,
                }}>
                  {config.icon}
                  {config.label}
                </span>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  {isExplored && (
                    <span style={{
                      fontSize: '0.58rem', color: 'var(--theme-muted)', fontFamily: 'monospace',
                      padding: '0.1rem 0.35rem', borderRadius: 'var(--radius-sm)',
                      background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.06)',
                    }}>
                      Explored
                    </span>
                  )}
                  <span style={{
                    fontSize: '0.6rem', fontFamily: 'monospace',
                    padding: '0.15rem 0.35rem', borderRadius: 'var(--radius-sm)',
                    background: 'rgba(0, 0, 0, 0.3)', border: '1px solid rgba(255, 255, 255, 0.08)',
                    color: 'var(--theme-muted)',
                  }}>
                    [{choice.ordinal}]
                  </span>
                </div>
              </div>

              {/* Choice Text */}
              <p style={{
                fontSize: '0.85rem', fontWeight: 500, color: 'rgba(255, 255, 255, 0.9)',
                lineHeight: 1.5, margin: '0.25rem 0',
              }}>
                "{choice.text}"
              </p>

              {/* Footer: Intent + Arrow */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                paddingTop: '0.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.04)',
                width: '100%',
              }}>
                <span style={{
                  fontSize: '0.65rem', fontStyle: 'italic', color: 'var(--theme-muted)',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  maxWidth: '80%',
                }}>
                  {choice.narrativeIntent}
                </span>

                {isThisGenerating ? (
                  <Loader2 size={14} style={{ color: '#22d3ee', animation: 'spin 1s linear infinite', flexShrink: 0 }} />
                ) : (
                  <ArrowRight size={13} style={{ color: 'var(--theme-muted)', flexShrink: 0, transition: 'all 0.2s ease' }} />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
