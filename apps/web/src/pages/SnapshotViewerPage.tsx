import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import type { StorySnapshotWorkspaceDto } from '@plotweaver/shared';
import { GENRE_REGISTRY } from '@plotweaver/shared';
import { getSnapshot, forkSnapshot, getExportUrl } from '../api/snapshots.js';
import { VisualTreeCanvas } from '../components/tree/VisualTreeCanvas.js';
import { StudioNavbar } from '../components/layout/StudioNavbar.js';
import { CinematicBackground } from '../components/atmosphere/CinematicBackground.js';
import { ForkModal } from '../components/workspace/ForkModal.js';
import {
  ArrowLeft,
  GitFork,
  FileDown,
  FileText,
  Clock,
  BookOpen,
  Lock,
  Layers,
  ChevronRight,
  Loader2,
  AlertCircle,
} from 'lucide-react';

export const SnapshotViewerPage: React.FC = () => {
  const { snapshotId } = useParams<{ snapshotId: string }>();
  const navigate = useNavigate();

  const [data, setData] = useState<StorySnapshotWorkspaceDto | null>(null);
  const [selectedSceneId, setSelectedSceneId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isForkModalOpen, setIsForkModalOpen] = useState(false);

  useEffect(() => {
    async function load() {
      if (!snapshotId) return;
      try {
        setIsLoading(false);
        const result = await getSnapshot(snapshotId);
        setData(result);
        setSelectedSceneId(result.snapshot.snapshotActiveId || result.snapshot.snapshotRootId || (result.scenes[0]?.id ?? null));
      } catch (err: any) {
        setError(err?.message || 'Failed to load snapshot');
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [snapshotId]);

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#07080b', color: '#fff' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', color: 'var(--theme-accent, #a855f7)' }} />
          <span style={{ fontSize: '0.9rem', color: 'var(--theme-muted, #94a3b8)' }}>Accessing Vault Snapshot...</span>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#07080b', color: '#fff' }}>
        <div style={{ maxWidth: '440px', textAlign: 'center', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <AlertCircle size={40} color="#f87171" />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Snapshot Not Found</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--theme-muted, #94a3b8)' }}>{error || 'Unable to load snapshot record.'}</p>
          <Link
            to="/library"
            style={{
              padding: '0.6rem 1.2rem',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.08)',
              color: '#fff',
              textDecoration: 'none',
              fontSize: '0.85rem',
            }}
          >
            Return to Vault
          </Link>
        </div>
      </div>
    );
  }

  const { snapshot, scenes, choices, activePathSceneIds } = data;
  const genreMeta = GENRE_REGISTRY[snapshot.genre];
  const activeScene = scenes.find(s => s.id === selectedSceneId) || scenes[0];

  const wordCount = activeScene?.text ? activeScene.text.trim().split(/\s+/).filter(Boolean).length : 0;
  const readingMinutes = Math.max(1, Math.ceil(wordCount / 200));

  const paragraphs = activeScene?.text
    ? activeScene.text.split(/\n\s*\n/).map(p => p.trim()).filter(p => p.length > 0)
    : [];

  const handleDownload = (format: 'markdown' | 'pdf') => {
    const url = getExportUrl(snapshot.sourceStoryId, format);
    const link = document.createElement('a');
    link.href = url;
    link.download = '';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleForkConfirm = async (snapId: string) => {
    const { storyId } = await forkSnapshot(snapId);
    navigate(`/workspace/${storyId}`);
  };

  return (
    <div data-genre={snapshot.genre} style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <CinematicBackground genreId={snapshot.genre} dimmerOpacity={0.82} />
      <StudioNavbar />

      {/* Snapshot Header Bar */}
      <header
        style={{
          position: 'relative',
          zIndex: 20,
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          background: 'rgba(7, 8, 11, 0.8)',
          backdropFilter: 'blur(20px)',
          padding: '0.75rem 1.5rem',
        }}
      >
        <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          {/* Left: Back & Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link
              to="/library"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.4rem 0.75rem',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                color: 'var(--theme-muted, #94a3b8)',
                fontSize: '0.75rem',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--theme-muted, #94a3b8)'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)'; }}
            >
              <ArrowLeft size={14} />
              <span>Vault</span>
            </Link>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1rem', fontWeight: 800, color: '#fff' }}>
                  {snapshot.title}
                </span>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    padding: '0.15rem 0.5rem',
                    borderRadius: '999px',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    background: 'rgba(168, 85, 247, 0.12)',
                    border: '1px solid rgba(168, 85, 247, 0.25)',
                    color: 'var(--theme-accent, #c084fc)',
                  }}
                >
                  <Lock size={10} />
                  <span>v{snapshot.version} Snapshot Archive</span>
                </span>
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--theme-muted, #94a3b8)', marginTop: '2px' }}>
                {genreMeta?.icon} {genreMeta?.displayName || snapshot.genre} • Tone: {snapshot.tone} • {snapshot.sceneCount} Chapters • {snapshot.branchCount} Decision Junctions
              </div>
            </div>
          </div>

          {/* Right: Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <button
              onClick={() => handleDownload('markdown')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.45rem 0.85rem',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                color: 'var(--theme-muted, #94a3b8)',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--theme-muted, #94a3b8)'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)'; }}
            >
              <FileDown size={13} />
              <span>MD</span>
            </button>

            <button
              onClick={() => handleDownload('pdf')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.45rem 0.85rem',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                color: 'var(--theme-muted, #94a3b8)',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--theme-muted, #94a3b8)'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)'; }}
            >
              <FileDown size={13} />
              <span>PDF</span>
            </button>

            <button
              onClick={() => setIsForkModalOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.5rem 1.1rem',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, var(--theme-accent, #a855f7) 0%, #ec4899 100%)',
                border: 'none',
                color: '#fff',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 15px var(--theme-glow, rgba(168, 85, 247, 0.3))',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px var(--theme-glow, rgba(168, 85, 247, 0.45))'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px var(--theme-glow, rgba(168, 85, 247, 0.3))'; }}
            >
              <GitFork size={14} />
              <span>Fork Alternate Timeline</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <div style={{ position: 'relative', zIndex: 10, flex: 1, maxWidth: '1440px', width: '100%', margin: '0 auto', padding: '1.5rem', display: 'grid', gridTemplateColumns: 'minmax(320px, 460px) 1fr', gap: '1.5rem' }}>
        
        {/* Left Column: Visual Tree Snapshot */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div
            style={{
              borderRadius: 'var(--radius-lg, 16px)',
              background: 'rgba(255, 255, 255, 0.025)',
              border: '1px solid rgba(255, 255, 255, 0.07)',
              backdropFilter: 'blur(16px)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              height: '620px',
            }}
          >
            <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#fff' }}>
                <Layers size={14} color="var(--theme-accent, #c084fc)" />
                <span>Multiverse Branch Graph</span>
              </div>
              <span style={{ fontSize: '0.65rem', color: 'var(--theme-muted, #94a3b8)' }}>
                Click node to read chapter
              </span>
            </div>

            <div style={{ flex: 1, position: 'relative' }}>
              <VisualTreeCanvas
                scenes={scenes}
                choices={choices}
                activeSceneId={selectedSceneId}
                activePathSceneIds={activePathSceneIds}
                rootSceneId={snapshot.snapshotRootId}
                onSelectScene={(id) => setSelectedSceneId(id)}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Historical Scene Reader */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <article
            style={{
              borderRadius: 'var(--radius-lg, 16px)',
              background: 'rgba(255, 255, 255, 0.025)',
              border: '1px solid rgba(255, 255, 255, 0.07)',
              backdropFilter: 'blur(16px)',
              padding: '1.75rem 2rem',
              minHeight: '620px',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Read-Only Notice Banner */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                background: 'rgba(168, 85, 247, 0.08)',
                border: '1px solid rgba(168, 85, 247, 0.2)',
                marginBottom: '1.25rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#d8b4fe' }}>
                <Lock size={14} />
                <span>
                  <strong>Archived Snapshot View:</strong> You are viewing preserved <strong>Chapter {activeScene?.depth || 1}</strong>.
                </span>
              </div>
              <button
                onClick={() => setIsForkModalOpen(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--theme-accent, #c084fc)',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                }}
              >
                <span>Fork to edit</span>
                <ChevronRight size={13} />
              </button>
            </div>

            {/* Toolbar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--theme-accent, #c084fc)', background: 'rgba(255, 255, 255, 0.04)', padding: '0.25rem 0.6rem', borderRadius: '999px' }}>
                  <BookOpen size={12} style={{ display: 'inline', marginRight: '4px' }} />
                  Chapter {activeScene?.depth || 1} of {scenes.length}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.7rem', color: 'var(--theme-muted, #94a3b8)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <FileText size={12} /> {wordCount} words
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Clock size={12} /> {readingMinutes} min read
                </span>
              </div>
            </div>

            {/* Scene Prose */}
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: '1.1rem',
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '1.05rem',
                lineHeight: 1.8,
                fontFamily: 'var(--theme-font-family, serif)',
              }}
            >
              {paragraphs.map((p, idx) => (
                <p key={idx} style={{ margin: 0 }}>
                  {idx === 0 && (
                    <span
                      style={{
                        float: 'left',
                        fontSize: '3.4rem',
                        fontWeight: 700,
                        lineHeight: 0.85,
                        marginRight: '0.45rem',
                        marginTop: '0.15rem',
                        color: 'var(--theme-accent, #c084fc)',
                      }}
                    >
                      {p.charAt(0)}
                    </span>
                  )}
                  {idx === 0 ? p.slice(1) : p}
                </p>
              ))}
            </div>

            {/* Preserved Choices */}
            {activeScene && (
              <div style={{ marginTop: '2rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--theme-muted, #94a3b8)', marginBottom: '0.75rem' }}>
                  Preserved Branch Choices At This Node
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {choices.filter(c => c.sourceSceneId === activeScene.id).map((c) => (
                    <div
                      key={c.id}
                      style={{
                        padding: '0.75rem 1rem',
                        borderRadius: '8px',
                        background: c.childSceneId ? 'rgba(168, 85, 247, 0.06)' : 'rgba(255, 255, 255, 0.02)',
                        border: c.childSceneId ? '1px solid rgba(168, 85, 247, 0.2)' : '1px solid rgba(255, 255, 255, 0.06)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#fff' }}>
                          [{c.ordinal}] {c.text}
                        </div>
                        <div style={{ fontSize: '0.68rem', color: 'var(--theme-muted, #94a3b8)', fontStyle: 'italic', marginTop: '2px' }}>
                          Archetype: {c.archetype} • {c.narrativeIntent}
                        </div>
                      </div>
                      {c.childSceneId && (
                        <button
                          onClick={() => setSelectedSceneId(c.childSceneId ?? null)}
                          style={{
                            padding: '0.35rem 0.75rem',
                            borderRadius: '6px',
                            background: 'rgba(255, 255, 255, 0.06)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            color: '#fff',
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          View Chapter
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </article>
        </div>
      </div>

      <ForkModal
        snapshot={snapshot}
        isOpen={isForkModalOpen}
        onClose={() => setIsForkModalOpen(false)}
        onConfirm={handleForkConfirm}
      />
    </div>
  );
};
