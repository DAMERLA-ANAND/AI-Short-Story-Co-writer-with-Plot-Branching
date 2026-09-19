import React from 'react';
import type { ChoiceDto } from '@plotweaver/shared';
import { Zap, Search, GitBranch, ArrowRight, CheckCircle2, Loader2, Sparkles } from 'lucide-react';

interface ChoiceDeckProps {
  choices: ChoiceDto[];
  onSelectChoice: (choiceId: string) => void;
  isGenerating: boolean;
  generatingChoiceId: string | null;
}

export const ChoiceDeck: React.FC<ChoiceDeckProps> = ({
  choices,
  onSelectChoice,
  isGenerating,
  generatingChoiceId,
}) => {
  const getArchetypeConfig = (archetype: string) => {
    switch (archetype) {
      case 'CONFRONTATION':
        return {
          icon: <Zap size={14} />,
          label: 'CONFRONTATION',
          badgeBg: 'rgba(239, 68, 68, 0.15)',
          badgeColor: '#f87171',
          badgeBorder: 'rgba(239, 68, 68, 0.3)',
        };
      case 'INVESTIGATION':
        return {
          icon: <Search size={14} />,
          label: 'INVESTIGATION',
          badgeBg: 'rgba(56, 189, 248, 0.15)',
          badgeColor: '#38bdf8',
          badgeBorder: 'rgba(56, 189, 248, 0.3)',
        };
      case 'DIVERGENCE':
      default:
        return {
          icon: <GitBranch size={14} />,
          label: 'DIVERGENCE',
          badgeBg: 'rgba(168, 85, 247, 0.15)',
          badgeColor: '#c084fc',
          badgeBorder: 'rgba(168, 85, 247, 0.3)',
        };
    }
  };

  return (
    <div
      style={{
        backgroundColor: 'var(--theme-surface)',
        border: '1px solid var(--theme-border)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.75rem',
        boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--theme-border)',
          paddingBottom: '0.75rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={18} color="var(--theme-accent)" />
          <h2
            style={{
              fontSize: '1.05rem',
              fontWeight: 700,
              fontFamily: 'var(--theme-font-family)',
              letterSpacing: '-0.01em',
              color: 'var(--theme-text)',
            }}
          >
            What Happens Next?
          </h2>
        </div>

        <span
          style={{
            fontSize: '0.78rem',
            color: 'var(--theme-muted)',
          }}
        >
          {choices.length} distinct plot directions
        </span>
      </div>

      {/* Choices Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1rem',
        }}
      >
        {choices.map((choice) => {
          const arch = getArchetypeConfig(choice.archetype);
          const isExplored = Boolean(choice.childSceneId);
          const isThisGenerating = isGenerating && generatingChoiceId === choice.id;

          return (
            <div
              key={choice.id}
              onClick={() => {
                if (!isGenerating) {
                  onSelectChoice(choice.id);
                }
              }}
              style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '1.15rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--theme-surface-elevated)',
                border: isThisGenerating
                  ? '2px solid var(--theme-accent)'
                  : isExplored
                  ? '1.5px solid rgba(56, 189, 248, 0.4)'
                  : '1px solid var(--theme-border)',
                boxShadow: isThisGenerating
                  ? '0 0 20px var(--theme-glow)'
                  : '0 2px 8px rgba(0,0,0,0.2)',
                cursor: isGenerating ? 'not-allowed' : 'pointer',
                opacity: isGenerating && !isThisGenerating ? 0.6 : 1,
                transition: 'all var(--transition-fast)',
                gap: '0.85rem',
              }}
              onMouseEnter={(e) => {
                if (!isGenerating) {
                  e.currentTarget.style.borderColor = 'var(--theme-accent)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.4), 0 0 15px var(--theme-glow)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isGenerating) {
                  e.currentTarget.style.borderColor = isExplored
                    ? 'rgba(56, 189, 248, 0.4)'
                    : 'var(--theme-border)';
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
                }
              }}
            >
              {/* Top Archetype Badge */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    padding: '0.2rem 0.5rem',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: arch.badgeBg,
                    color: arch.badgeColor,
                    border: `1px solid ${arch.badgeBorder}`,
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                  }}
                >
                  {arch.icon}
                  {arch.label}
                </span>

                {isExplored ? (
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      color: 'var(--theme-accent)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                    }}
                  >
                    <CheckCircle2 size={12} />
                    EXPLORED
                  </span>
                ) : (
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      color: 'var(--theme-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                    }}
                  >
                    <Sparkles size={11} color="var(--theme-accent)" />
                    NEW PATH
                  </span>
                )}
              </div>

              {/* Choice Action Text */}
              <div
                style={{
                  fontSize: '0.98rem',
                  fontWeight: 600,
                  lineHeight: 1.45,
                  color: 'var(--theme-text)',
                }}
              >
                {choice.text}
              </div>

              {/* Narrative Intent Subtitle */}
              {choice.narrativeIntent && (
                <div
                  style={{
                    fontSize: '0.8rem',
                    color: 'var(--theme-muted)',
                    fontStyle: 'italic',
                    lineHeight: 1.35,
                  }}
                >
                  {choice.narrativeIntent}
                </div>
              )}

              {/* Bottom Action Footer */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderTop: '1px solid rgba(255,255,255,0.06)',
                  paddingTop: '0.65rem',
                  marginTop: '0.25rem',
                  fontSize: '0.8rem',
                  color: 'var(--theme-accent)',
                  fontWeight: 600,
                }}
              >
                {isThisGenerating ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Loader2 size={14} className="animate-spin" />
                    Weaving scene...
                  </span>
                ) : isExplored ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    View Branch Reality
                    <ArrowRight size={13} />
                  </span>
                ) : (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    Branch This Path
                    <ArrowRight size={13} />
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Concurrency / In-Progress Notification */}
      {isGenerating && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            padding: '0.65rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'rgba(56, 189, 248, 0.1)',
            border: '1px solid rgba(56, 189, 248, 0.25)',
            color: 'var(--theme-accent)',
            fontSize: '0.85rem',
            fontWeight: 600,
          }}
        >
          <Loader2 size={16} className="animate-spin" />
          <span>Generating next chapter with Triad Divergence & Consistency Guard...</span>
        </div>
      )}
    </div>
  );
};
