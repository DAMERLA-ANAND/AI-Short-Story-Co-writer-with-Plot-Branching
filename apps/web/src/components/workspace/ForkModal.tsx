import React, { useState } from 'react';
import type { StorySnapshotSummaryDto } from '@plotweaver/shared';
import { GENRE_REGISTRY } from '@plotweaver/shared';
import { GitFork, Sparkles, X, ArrowRight, Loader2 } from 'lucide-react';

interface ForkModalProps {
  snapshot: StorySnapshotSummaryDto;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (snapshotId: string) => Promise<void>;
}

export const ForkModal: React.FC<ForkModalProps> = ({
  snapshot,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [isForking, setIsForking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const genreData = GENRE_REGISTRY[snapshot.genre];

  const handleFork = async () => {
    setIsForking(true);
    setError(null);
    try {
      await onConfirm(snapshot.id);
    } catch (err: any) {
      setError(err?.message || 'Failed to fork timeline');
      setIsForking(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(5, 7, 12, 0.75)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        padding: '1.5rem',
        animation: 'fadeIn 0.25s ease-out forwards',
      }}
      onClick={e => {
        if (e.target === e.currentTarget && !isForking) onClose();
      }}
    >
      <div
        style={{
          maxWidth: '520px',
          width: '100%',
          background: 'linear-gradient(135deg, rgba(20, 22, 32, 0.95) 0%, rgba(12, 14, 20, 0.98) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 'var(--radius-lg, 16px)',
          padding: '2rem',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6), 0 0 30px var(--theme-glow, rgba(168, 85, 247, 0.15))',
          animation: 'fadeInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, var(--theme-accent, #a855f7) 0%, #ec4899 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px var(--theme-glow, rgba(168, 85, 247, 0.3))',
              }}
            >
              <GitFork size={18} color="#fff" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', margin: 0, letterSpacing: '-0.01em' }}>
                Fork Timeline Branch
              </h2>
              <span style={{ fontSize: '0.7rem', color: 'var(--theme-muted, #94a3b8)' }}>
                Deep-copy this snapshot into an active parallel multiverse
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isForking}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--theme-muted, #94a3b8)',
              cursor: 'pointer',
              padding: '0.4rem',
              borderRadius: '6px',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--theme-muted, #94a3b8)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Snapshot Summary Box */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>
              {snapshot.title}
            </span>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                fontSize: '0.65rem',
                fontWeight: 600,
                color: 'var(--theme-accent, #c084fc)',
                background: 'rgba(255, 255, 255, 0.06)',
                padding: '0.2rem 0.5rem',
                borderRadius: '999px',
              }}
            >
              <span>{genreData?.icon}</span>
              <span>{genreData?.displayName || snapshot.genre}</span>
              <span>• v{snapshot.version}</span>
            </span>
          </div>

          <p
            style={{
              fontSize: '0.78rem',
              color: 'var(--theme-muted, #94a3b8)',
              lineHeight: 1.5,
              margin: 0,
            }}
          >
            {snapshot.premise}
          </p>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.25rem', fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.5)' }}>
            <span>{snapshot.sceneCount} Chapters</span>
            <span>{snapshot.branchCount} Decision Junctions</span>
          </div>
        </div>

        {/* Explanation */}
        <div
          style={{
            fontSize: '0.78rem',
            color: 'rgba(255, 255, 255, 0.75)',
            lineHeight: 1.55,
            padding: '0.75rem',
            borderRadius: '8px',
            background: 'rgba(168, 85, 247, 0.06)',
            border: '1px solid rgba(168, 85, 247, 0.15)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, color: '#d8b4fe', marginBottom: '0.25rem' }}>
            <Sparkles size={13} />
            <span>Parallel Branching Invariant</span>
          </div>
          Forking creates an isolated working copy of this exact timeline. The original snapshot remains completely locked and preserved in your Vault.
        </div>

        {error && (
          <div
            style={{
              padding: '0.65rem 0.85rem',
              borderRadius: '8px',
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#fca5a5',
              fontSize: '0.78rem',
            }}
          >
            {error}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
          <button
            type="button"
            onClick={onClose}
            disabled={isForking}
            style={{
              padding: '0.65rem 1.1rem',
              borderRadius: '8px',
              background: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: 'var(--theme-muted, #94a3b8)',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: isForking ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--theme-muted, #94a3b8)'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'; }}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleFork}
            disabled={isForking}
            style={{
              padding: '0.65rem 1.3rem',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, var(--theme-accent, #a855f7) 0%, #ec4899 100%)',
              color: '#fff',
              fontSize: '0.82rem',
              fontWeight: 700,
              border: 'none',
              cursor: isForking ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              boxShadow: '0 4px 15px var(--theme-glow, rgba(168, 85, 247, 0.3))',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => {
              if (!isForking) {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 6px 20px var(--theme-glow, rgba(168, 85, 247, 0.45))';
              }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px var(--theme-glow, rgba(168, 85, 247, 0.3))';
            }}
          >
            {isForking ? (
              <>
                <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} />
                <span>Branching Multiverse...</span>
              </>
            ) : (
              <>
                <GitFork size={15} />
                <span>Confirm Fork & Open Workspace</span>
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
