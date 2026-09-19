import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import type { StorySnapshotSummaryDto, GenreId } from '@plotweaver/shared';
import { GENRE_REGISTRY, GENRE_IDS } from '@plotweaver/shared';
import { listSnapshots, forkSnapshot, deleteSnapshot, getExportUrl } from '../api/snapshots.js';
import { listStories, deleteStory } from '../api/stories.js';
import { StudioNavbar } from '../components/layout/StudioNavbar.js';
import { CinematicBackground } from '../components/atmosphere/CinematicBackground.js';
import { ForkModal } from '../components/workspace/ForkModal.js';
import {
  Archive,
  GitFork,
  FileDown,
  FileText,
  Sparkles,
  Layers,
  Loader2,
  BookOpen,
  ArrowRight,
  Search,
  Trash2,
  Eye,
  Filter,
  X,
} from 'lucide-react';

export const LibraryPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'snapshots' | 'stories'>('snapshots');
  const [snapshots, setSnapshots] = useState<StorySnapshotSummaryDto[]>([]);
  const [liveStories, setLiveStories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenreFilter, setSelectedGenreFilter] = useState<string>('ALL');

  // Fork Modal
  const [selectedSnapshotForFork, setSelectedSnapshotForFork] = useState<StorySnapshotSummaryDto | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [snapData, storyData] = await Promise.all([
          listSnapshots(),
          listStories().catch(() => ({ stories: [] })),
        ]);
        setSnapshots(snapData);
        setLiveStories(storyData.stories || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load library');
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const handleForkConfirm = async (snapshotId: string) => {
    const { storyId } = await forkSnapshot(snapshotId);
    navigate(`/workspace/${storyId}`);
  };

  const handleDeleteSnapshot = async (e: React.MouseEvent, snapshotId: string) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this snapshot from your vault?')) return;
    setDeletingId(snapshotId);
    try {
      await deleteSnapshot(snapshotId);
      setSnapshots(prev => prev.filter(s => s.id !== snapshotId));
    } catch (err: any) {
      alert(`Failed to delete snapshot: ${err?.message || err}`);
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteStory = async (e: React.MouseEvent, storyId: string) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this story and all its branches from the vault?')) return;
    setDeletingId(storyId);
    try {
      await deleteStory(storyId);
      setLiveStories(prev => prev.filter(s => s.id !== storyId));
    } catch (err: any) {
      alert(`Failed to delete story: ${err?.message || err}`);
    } finally {
      setDeletingId(null);
    }
  };

  const handleDownload = (storyId: string, format: 'markdown' | 'pdf') => {
    const url = getExportUrl(storyId, format);
    const link = document.createElement('a');
    link.href = url;
    link.download = '';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered lists
  const filteredSnapshots = useMemo(() => {
    return snapshots.filter(s => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.premise.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.tone.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGenre = selectedGenreFilter === 'ALL' || s.genre === selectedGenreFilter;
      return matchesSearch && matchesGenre;
    });
  }, [snapshots, searchQuery, selectedGenreFilter]);

  const filteredStories = useMemo(() => {
    const seenTitles = new Set<string>();
    const uniqueStories = liveStories.filter(s => {
      const normalizedTitle = (s.title || '').trim().toLowerCase();
      if (!normalizedTitle) return true;
      if (seenTitles.has(normalizedTitle)) return false;
      seenTitles.add(normalizedTitle);
      return true;
    });

    return uniqueStories.filter(s => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.premise.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.tone.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGenre = selectedGenreFilter === 'ALL' || s.genre === selectedGenreFilter;
      return matchesSearch && matchesGenre;
    });
  }, [liveStories, searchQuery, selectedGenreFilter]);

  const tabBtnStyle = (active: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.5rem 1rem',
    borderRadius: 'var(--radius-md, 8px)',
    fontSize: '0.78rem',
    fontWeight: 600,
    background: active ? 'linear-gradient(135deg, var(--theme-accent, #a855f7) 0%, #ec4899 100%)' : 'transparent',
    color: active ? '#fff' : 'var(--theme-muted, #94a3b8)',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.25s ease',
    boxShadow: active ? '0 4px 15px var(--theme-glow, rgba(168, 85, 247, 0.3))' : 'none',
  });

  const cardStyle: React.CSSProperties = {
    padding: '1.5rem',
    borderRadius: 'var(--radius-lg, 16px)',
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.07)',
    backdropFilter: 'blur(16px)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    transition: 'all 0.3s ease',
    minHeight: '260px',
  };

  const actionBtnPrimary: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.4rem',
    padding: '0.55rem 0.85rem',
    borderRadius: 'var(--radius-md, 8px)',
    background: 'linear-gradient(135deg, var(--theme-accent, #a855f7) 0%, #ec4899 100%)',
    color: '#fff',
    fontWeight: 700,
    fontSize: '0.72rem',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.25s ease',
    boxShadow: '0 4px 12px var(--theme-glow, rgba(168, 85, 247, 0.25))',
    textDecoration: 'none',
  };

  const actionBtnSecondary: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.35rem',
    padding: '0.55rem 0.75rem',
    borderRadius: 'var(--radius-md, 8px)',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: '#fff',
    fontWeight: 600,
    fontSize: '0.72rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textDecoration: 'none',
  };

  const actionBtnIcon: React.CSSProperties = {
    padding: '0.5rem',
    borderRadius: 'var(--radius-md, 8px)',
    background: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    color: 'var(--theme-muted, #94a3b8)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <CinematicBackground genreId="scifi" dimmerOpacity={0.88} />
      <StudioNavbar />

      <main style={{
        position: 'relative',
        zIndex: 10,
        maxWidth: '1280px',
        margin: '0 auto',
        width: '100%',
        padding: '2.5rem 1.5rem 4rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
      }}>
        {/* Header Bar */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          animation: 'fadeInUp 0.5s ease-out both',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <Archive size={18} color="var(--theme-accent, #c084fc)" />
              <h1 style={{
                fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
                fontWeight: 800,
                color: '#fff',
                letterSpacing: '-0.02em',
                margin: 0,
              }}>
                Multiverse Vault
              </h1>
            </div>
            <p style={{
              color: 'var(--theme-muted, #94a3b8)',
              fontSize: '0.85rem',
              margin: 0,
              opacity: 0.8,
            }}>
              Browse archived snapshot states, inspect timelines, and fork into parallel branches.
            </p>
          </div>

          {/* Tabs */}
          <div style={{
            display: 'flex',
            background: 'rgba(255, 255, 255, 0.03)',
            padding: '0.25rem',
            borderRadius: 'var(--radius-lg, 12px)',
            border: '1px solid rgba(255, 255, 255, 0.07)',
            gap: '0.25rem',
          }}>
            <button onClick={() => setActiveTab('snapshots')} style={tabBtnStyle(activeTab === 'snapshots')}>
              <Sparkles size={13} />
              <span>Snapshot Vault ({snapshots.length})</span>
            </button>
            <button onClick={() => setActiveTab('stories')} style={tabBtnStyle(activeTab === 'stories')}>
              <BookOpen size={13} />
              <span>Live Stories ({liveStories.length})</span>
            </button>
          </div>
        </div>

        {/* Search & Genre Filters */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: '12px',
            padding: '1rem',
            animation: 'fadeInUp 0.5s ease-out 0.1s both',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            {/* Search Box */}
            <div
              style={{
                flex: 1,
                minWidth: '240px',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Search size={15} style={{ position: 'absolute', left: '12px', color: 'var(--theme-muted, #94a3b8)' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by title, tone, or premise keywords..."
                style={{
                  width: '100%',
                  padding: '0.55rem 0.85rem 0.55rem 2.2rem',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  fontSize: '0.82rem',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{
                    position: 'absolute',
                    right: '8px',
                    background: 'none',
                    border: 'none',
                    color: 'var(--theme-muted, #94a3b8)',
                    cursor: 'pointer',
                    padding: '4px',
                  }}
                >
                  <X size={13} />
                </button>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--theme-muted, #94a3b8)', fontSize: '0.75rem' }}>
              <Filter size={13} />
              <span>Genre:</span>
            </div>
          </div>

          {/* Genre Filter Pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            <button
              onClick={() => setSelectedGenreFilter('ALL')}
              style={{
                padding: '0.3rem 0.65rem',
                borderRadius: '999px',
                fontSize: '0.7rem',
                fontWeight: 600,
                background: selectedGenreFilter === 'ALL' ? 'var(--theme-accent, #a855f7)' : 'rgba(255, 255, 255, 0.03)',
                color: selectedGenreFilter === 'ALL' ? '#fff' : 'var(--theme-muted, #94a3b8)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              All Genres
            </button>
            {GENRE_IDS.map(gid => {
              const g = GENRE_REGISTRY[gid];
              const isSelected = selectedGenreFilter === gid;
              return (
                <button
                  key={gid}
                  onClick={() => setSelectedGenreFilter(gid)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    padding: '0.3rem 0.65rem',
                    borderRadius: '999px',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    background: isSelected ? 'var(--theme-accent, #a855f7)' : 'rgba(255, 255, 255, 0.03)',
                    color: isSelected ? '#fff' : 'var(--theme-muted, #94a3b8)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <span>{g.icon}</span>
                  <span>{g.displayName}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div style={{
            padding: '5rem 0', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: '1rem', color: 'var(--theme-muted, #94a3b8)',
          }}>
            <Loader2 size={28} style={{ animation: 'spin 1s linear infinite', color: 'var(--theme-accent, #a855f7)' }} />
            <span style={{ fontSize: '0.85rem' }}>Accessing multiverse vault...</span>
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{
            padding: '0.85rem 1.1rem',
            borderRadius: 'var(--radius-md, 8px)',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            color: '#fca5a5',
            fontSize: '0.82rem',
          }}>
            {error}
          </div>
        )}

        {/* Snapshots Tab */}
        {!isLoading && activeTab === 'snapshots' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
            {filteredSnapshots.length === 0 && (
              <div style={{
                gridColumn: '1 / -1', padding: '4rem 2rem', textAlign: 'center',
                color: 'var(--theme-muted, #94a3b8)', fontSize: '0.88rem',
                background: 'rgba(255, 255, 255, 0.02)', borderRadius: '16px',
                border: '1px dashed rgba(255, 255, 255, 0.1)',
              }}>
                <Archive size={32} style={{ margin: '0 auto 1rem', opacity: 0.4 }} />
                {searchQuery || selectedGenreFilter !== 'ALL'
                  ? 'No snapshots matched your search and filter criteria.'
                  : 'No snapshots stored yet. Create a story, make decisions, and store a snapshot to preserve timelines.'}
              </div>
            )}
            {filteredSnapshots.map((snap, idx) => {
              const genreData = GENRE_REGISTRY[snap.genre as GenreId];
              const isDeleting = deletingId === snap.id;

              return (
                <div
                  key={snap.id}
                  style={{
                    ...cardStyle,
                    animation: `fadeInUp 0.4s ease-out ${0.05 * idx}s both`,
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.35)';
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.4)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.07)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div>
                    {/* Meta Header */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{
                          padding: '0.2rem 0.55rem',
                          borderRadius: '999px',
                          background: 'rgba(255, 255, 255, 0.04)',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          color: 'var(--theme-accent, #c084fc)',
                        }}>
                          {genreData?.icon} {genreData?.displayName || snap.genre}
                        </span>
                        <span style={{ fontSize: '0.68rem', color: 'var(--theme-muted, #94a3b8)', fontStyle: 'italic' }}>{snap.tone}</span>
                      </div>
                      <span style={{ fontSize: '0.65rem', fontFamily: 'monospace', color: 'var(--theme-muted, #94a3b8)' }}>v{snap.version}</span>
                    </div>

                    <h2 style={{
                      fontSize: '1.15rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem',
                      fontFamily: 'var(--theme-font-family, serif)', lineHeight: 1.25,
                    }}>
                      {snap.title}
                    </h2>

                    <p style={{
                      fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.6)', lineHeight: 1.45,
                      marginBottom: '1rem', fontStyle: 'italic',
                      overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical',
                    }}>
                      "{snap.premise}"
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.72rem', color: 'var(--theme-muted, #94a3b8)', marginBottom: '1rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Layers size={13} /> {snap.sceneCount} chapters
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Sparkles size={13} color="#a78bfa" /> {snap.branchCount} junctions
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.4rem',
                    paddingTop: '0.85rem', borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                  }}>
                    {/* View Snapshot */}
                    <Link
                      to={`/snapshot/${snap.id}`}
                      style={actionBtnSecondary}
                      title="Inspect Snapshot Timeline"
                    >
                      <Eye size={13} />
                      <span>Inspect</span>
                    </Link>

                    {/* Fork Snapshot */}
                    <button
                      onClick={() => setSelectedSnapshotForFork(snap)}
                      style={actionBtnPrimary}
                    >
                      <GitFork size={13} />
                      <span>Fork Timeline</span>
                    </button>

                    {/* Export PDF */}
                    <button
                      onClick={() => handleDownload(snap.sourceStoryId, 'pdf')}
                      title="Download PDF"
                      style={actionBtnIcon}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'; e.currentTarget.style.color = '#fff'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)'; e.currentTarget.style.color = 'var(--theme-muted, #94a3b8)'; }}
                    >
                      <FileDown size={14} />
                    </button>

                    {/* Delete Snapshot */}
                    <button
                      onClick={(e) => handleDeleteSnapshot(e, snap.id)}
                      disabled={isDeleting}
                      title="Delete Snapshot"
                      style={{
                        ...actionBtnIcon,
                        color: isDeleting ? '#f87171' : 'var(--theme-muted, #94a3b8)',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)'; e.currentTarget.style.color = '#f87171'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)'; e.currentTarget.style.color = 'var(--theme-muted, #94a3b8)'; }}
                    >
                      {isDeleting ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <Trash2 size={13} />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Live Stories Tab */}
        {!isLoading && activeTab === 'stories' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
            {filteredStories.length === 0 && (
              <div style={{
                gridColumn: '1 / -1', padding: '4rem 2rem', textAlign: 'center',
                color: 'var(--theme-muted, #94a3b8)', fontSize: '0.88rem',
                background: 'rgba(255, 255, 255, 0.02)', borderRadius: '16px',
                border: '1px dashed rgba(255, 255, 255, 0.1)',
              }}>
                <BookOpen size={32} style={{ margin: '0 auto 1rem', opacity: 0.4 }} />
                No active stories found. Click "New Story" to begin.
              </div>
            )}
            {filteredStories.map((story, idx) => {
              const genreData = GENRE_REGISTRY[story.genre as GenreId];
              return (
                <div
                  key={story.id}
                  style={{
                    ...cardStyle,
                    animation: `fadeInUp 0.4s ease-out ${0.05 * idx}s both`,
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.35)';
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.4)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.07)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                      <span style={{
                        padding: '0.2rem 0.55rem',
                        borderRadius: '999px',
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        color: 'var(--theme-accent, #c084fc)',
                      }}>
                        {genreData?.icon} {genreData?.displayName || story.genre}
                      </span>
                      <span style={{ fontSize: '0.68rem', color: 'var(--theme-muted, #94a3b8)', fontStyle: 'italic' }}>{story.tone}</span>
                    </div>

                    <h2 style={{
                      fontSize: '1.15rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem',
                      fontFamily: 'var(--theme-font-family, serif)', lineHeight: 1.25,
                    }}>
                      {story.title}
                    </h2>

                    <p style={{
                      fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.6)', lineHeight: 1.45,
                      marginBottom: '1rem',
                      overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical',
                    }}>
                      {story.premise}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.72rem', color: 'var(--theme-muted, #94a3b8)', marginBottom: '1rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Layers size={13} /> {story.sceneCount ?? story.scenes?.length ?? 1} chapters
                      </span>
                    </div>
                  </div>

                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem',
                    paddingTop: '0.85rem', borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                  }}>
                    <Link
                      to={`/workspace/${story.id}`}
                      style={actionBtnPrimary}
                    >
                      <BookOpen size={13} />
                      <span>Open Workspace</span>
                      <ArrowRight size={12} />
                    </Link>

                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                      <button
                        onClick={() => handleDownload(story.id, 'pdf')}
                        title="Download PDF"
                        style={actionBtnIcon}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'; e.currentTarget.style.color = '#fff'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)'; e.currentTarget.style.color = 'var(--theme-muted, #94a3b8)'; }}
                      >
                        <FileDown size={14} />
                      </button>
                      <button
                        onClick={() => handleDownload(story.id, 'markdown')}
                        title="Download Markdown"
                        style={actionBtnIcon}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'; e.currentTarget.style.color = '#fff'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)'; e.currentTarget.style.color = 'var(--theme-muted, #94a3b8)'; }}
                      >
                        <FileText size={14} />
                      </button>
                      <button
                        onClick={(e) => handleDeleteStory(e, story.id)}
                        disabled={deletingId === story.id}
                        title="Delete Story"
                        style={{
                          ...actionBtnIcon,
                          color: deletingId === story.id ? '#f87171' : 'var(--theme-muted, #94a3b8)',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)'; e.currentTarget.style.color = '#f87171'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)'; e.currentTarget.style.color = 'var(--theme-muted, #94a3b8)'; }}
                      >
                        {deletingId === story.id ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <Trash2 size={14} />}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Fork Confirmation Modal */}
      {selectedSnapshotForFork && (
        <ForkModal
          snapshot={selectedSnapshotForFork}
          isOpen={Boolean(selectedSnapshotForFork)}
          onClose={() => setSelectedSnapshotForFork(null)}
          onConfirm={handleForkConfirm}
        />
      )}
    </div>
  );
};
