import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { StoryWorkspaceDto, GenreId, SceneDto, ChoiceDto } from '@plotweaver/shared';
import { getStoryWorkspace, setActiveScene } from '../api/stories.js';
import { storeStorySnapshot } from '../api/snapshots.js';
import { VisualTreeCanvas } from '../components/tree/VisualTreeCanvas.js';
import { SceneReader } from '../components/workspace/SceneReader.js';
import { FloatingChoiceDock } from '../components/workspace/FloatingChoiceDock.js';
import { WorkspaceHeader } from '../components/workspace/WorkspaceHeader.js';
import { ExportModal } from '../components/workspace/ExportModal.js';
import { StudioNavbar } from '../components/layout/StudioNavbar.js';
import { CinematicBackground } from '../components/atmosphere/CinematicBackground.js';
import { useStoryStream } from '../hooks/useStoryStream.js';
import {
  Loader2,
  AlertCircle,
  Maximize2,
  Minimize2,
  GitBranch,
  ChevronRight,
  BookOpen,
  CheckCircle2,
} from 'lucide-react';

export const StoryWorkspacePage: React.FC = () => {
  const { storyId } = useParams<{ storyId: string }>();
  const navigate = useNavigate();
  const { isStreaming, streamedText, streamChoice } = useStoryStream();

  const [workspace, setWorkspace] = useState<StoryWorkspaceDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingChoiceId, setGeneratingChoiceId] = useState<string | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isStoringSnapshot, setIsStoringSnapshot] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; link?: string; linkText?: string } | null>(null);
  const [themeGenre, setThemeGenre] = useState<GenreId>('detective');
  const dimmerOpacity = 0.78;
  const [isZenMode, setIsZenMode] = useState(false);
  const [isTreeExpanded, setIsTreeExpanded] = useState(false);

  const loadWorkspace = useCallback(async () => {
    if (!storyId) return;
    try {
      setError(null);
      const data = await getStoryWorkspace(storyId);
      setWorkspace(data);
      setThemeGenre(data.story.genre);
    } catch (err: any) {
      setError(err.message || 'Failed to load story workspace');
    } finally {
      setIsLoading(false);
    }
  }, [storyId]);

  useEffect(() => { loadWorkspace(); }, [loadWorkspace]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F11') { e.preventDefault(); setIsZenMode(z => !z); }
      else if (e.key === 'Escape' && isZenMode) { setIsZenMode(false); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isZenMode]);

  const handleSelectScene = async (targetSceneId: string) => {
    if (!workspace || targetSceneId === workspace.story.activeSceneId || isGenerating || isStreaming) return;
    try {
      setWorkspace(prev => {
        if (!prev) return prev;
        return { ...prev, story: { ...prev.story, activeSceneId: targetSceneId } };
      });
      const updated = await setActiveScene(workspace.story.id, targetSceneId);
      setWorkspace(updated);
    } catch (err: any) {
      console.error('Failed to set active scene:', err);
      loadWorkspace();
    }
  };

  const handleSelectChoice = async (choiceId: string) => {
    if (!workspace || isGenerating || isStreaming) return;
    const chosenChoice = workspace.choices.find(c => c.id === choiceId);
    if (!chosenChoice) return;
    if (chosenChoice.childSceneId) {
      await handleSelectScene(chosenChoice.childSceneId);
      return;
    }
    setIsGenerating(true);
    setGeneratingChoiceId(choiceId);
    setError(null);
    await streamChoice(
      workspace.story.id,
      choiceId,
      null, // No apiKey needed — server uses env key
      (updatedWorkspace) => { setWorkspace(updatedWorkspace); setIsGenerating(false); setGeneratingChoiceId(null); },
      (err: any) => { setError(err.message || 'Failed to generate branch scene.'); setIsGenerating(false); setGeneratingChoiceId(null); }
    );
  };

  const handleStoreSnapshot = async () => {
    if (!workspace || isStoringSnapshot) return;
    setIsStoringSnapshot(true);
    try {
      const snap = await storeStorySnapshot(workspace.story.id);
      setToastMessage({
        text: `Snapshot preserved! Version ${snap.version} — ${snap.sceneCount} scenes, ${snap.branchCount} branches archived.`,
        link: '/library',
        linkText: 'View Vault',
      });
      setTimeout(() => setToastMessage(null), 5000);
    } catch (err: any) {
      setError(err.message || 'Failed to store snapshot');
    } finally {
      setIsStoringSnapshot(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div data-genre={themeGenre} style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: '1rem',
      }}>
        <CinematicBackground genreId={themeGenre} />
        <Loader2 size={36} style={{ animation: 'spin 1s linear infinite', color: 'var(--theme-accent)' }} />
        <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--theme-muted)' }}>Loading narrative workspace...</div>
      </div>
    );
  }

  // Error state
  if (error && !workspace) {
    return (
      <div data-genre={themeGenre} style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', padding: '1.5rem',
      }}>
        <CinematicBackground genreId={themeGenre} />
        <div style={{
          maxWidth: '420px', padding: '2rem', borderRadius: 'var(--radius-xl)',
          background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(239, 68, 68, 0.3)',
          textAlign: 'center', position: 'relative', zIndex: 10,
        }}>
          <AlertCircle size={36} style={{ color: '#f87171', marginBottom: '1rem' }} />
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Unable to Load Narrative</h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--theme-muted)', marginBottom: '1.5rem' }}>{error}</p>
          <button
            onClick={() => navigate('/')}
            style={{
              padding: '0.6rem 1.5rem', borderRadius: 'var(--radius-md)',
              background: 'var(--theme-accent)', color: 'var(--theme-accent-contrast)',
              fontWeight: 700, fontSize: '0.82rem', border: 'none', cursor: 'pointer',
            }}
          >
            Return to Studio
          </button>
        </div>
      </div>
    );
  }

  if (!workspace) return null;

  const activeScene: SceneDto =
    workspace.scenes.find(s => s.id === workspace.story.activeSceneId) || workspace.scenes[0];

  const activeChoices: ChoiceDto[] =
    activeScene.choices && activeScene.choices.length > 0
      ? activeScene.choices
      : workspace.choices.filter(c => c.sourceSceneId === activeScene.id);

  const isHistorical =
    activeChoices.some(c => Boolean(c.childSceneId)) ||
    activeScene.id !== workspace.activePathSceneIds[workspace.activePathSceneIds.length - 1];

  const totalBranches = workspace.choices.filter(c => Boolean(c.childSceneId)).length;

  const activePathScenes: SceneDto[] = workspace.activePathSceneIds
    .map(id => workspace.scenes.find(scene => scene.id === id))
    .filter(Boolean) as SceneDto[];

  return (
    <div
      data-genre={themeGenre}
      style={{
        position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column',
        transition: 'all 0.5s ease',
      }}
    >
      <CinematicBackground genreId={themeGenre} dimmerOpacity={dimmerOpacity} />

      {!isZenMode && <StudioNavbar />}

      {/* Toast */}
      {toastMessage && (
        <div style={{
          position: 'relative', zIndex: 40,
          background: 'rgba(6, 78, 59, 0.6)', borderBottom: '1px solid rgba(16, 185, 129, 0.3)',
          padding: '0.6rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          backdropFilter: 'blur(12px)', fontSize: '0.78rem', color: '#6ee7b7',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle2 size={15} color="#34d399" />
            <span>{toastMessage.text}</span>
          </div>
          {toastMessage.link && (
            <button
              onClick={() => navigate(toastMessage.link!)}
              style={{
                padding: '0.3rem 0.75rem', borderRadius: 'var(--radius-md)',
                background: '#34d399', color: '#000', fontWeight: 700, fontSize: '0.7rem',
                border: 'none', cursor: 'pointer',
              }}
            >
              {toastMessage.linkText || 'Open'}
            </button>
          )}
        </div>
      )}

      {!isZenMode && (
        <WorkspaceHeader
          story={workspace.story}
          totalScenes={workspace.scenes.length}
          totalBranches={totalBranches}
          currentThemeGenre={themeGenre}
          onSelectGenreTheme={g => setThemeGenre(g)}
          onOpenExport={() => setIsExportModalOpen(true)}
          onStoreSnapshot={handleStoreSnapshot}
        />
      )}

      {/* Main Split Layout */}
      <main style={{
        position: 'relative', zIndex: 10, flex: 1,
        display: 'grid',
        gridTemplateColumns: isZenMode ? '1fr' : isTreeExpanded ? '1fr' : 'minmax(300px, 4.2fr) minmax(0, 7.8fr)',
        alignItems: 'start',
        gap: '1.5rem',
        padding: isZenMode ? '1.5rem 1.5rem 6rem' : '1rem 1.5rem 8rem',
        minHeight: 'calc(100vh - 130px)',
        maxWidth: isZenMode ? '900px' : 'none',
        margin: isZenMode ? '0 auto' : undefined,
        width: '100%',
        transition: 'all 0.3s ease',
      }}>
        {/* Left: Visual Tree Canvas */}
        {!isZenMode && (
          <div style={{
            position: isTreeExpanded ? 'relative' : 'sticky',
            top: '1rem',
            display: 'flex',
            flexDirection: 'column',
            height: isTreeExpanded ? '720px' : 'calc(100vh - 140px)',
            minHeight: isTreeExpanded ? '720px' : '480px',
            maxHeight: isTreeExpanded ? 'none' : 'calc(100vh - 100px)',
            minWidth: 0,
            gridColumn: isTreeExpanded ? '1 / -1' : undefined,
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <GitBranch size={14} color="var(--theme-accent)" />
                <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--theme-text)' }}>
                  Multiverse Graph
                </span>
              </div>
              <button
                onClick={() => setIsTreeExpanded(e => !e)}
                title={isTreeExpanded ? 'Restore Split View' : 'Maximize Graph'}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.35rem',
                  fontSize: '0.68rem', color: 'var(--theme-muted)',
                  padding: '0.3rem 0.6rem', borderRadius: 'var(--radius-sm)',
                  background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.06)',
                  cursor: 'pointer', transition: 'all 0.2s ease',
                }}
              >
                {isTreeExpanded ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
                <span>{isTreeExpanded ? 'Split' : 'Expand'}</span>
              </button>
            </div>

            <div style={{
              flex: 1, minHeight: '350px', borderRadius: 'var(--radius-lg)',
              overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.06)',
              background: 'rgba(0, 0, 0, 0.2)',
            }}>
              <VisualTreeCanvas
                scenes={workspace.scenes}
                choices={workspace.choices}
                activeSceneId={workspace.story.activeSceneId ?? null}
                activePathSceneIds={workspace.activePathSceneIds}
                rootSceneId={workspace.story.rootSceneId ?? null}
                onSelectScene={handleSelectScene}
              />
            </div>
          </div>
        )}

        {/* Right: Reading Room & Choice Deck */}
        {(!isTreeExpanded || isZenMode) && (
          <div style={{
            display: 'flex', flexDirection: 'column', gap: '1.25rem',
            minHeight: '100%',
            minWidth: 0,
            paddingBottom: '6rem',
          }}>
            {/* Breadcrumb */}
            {!isZenMode && (
              <div style={{
                display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.4rem',
                padding: '0.5rem 0.85rem', borderRadius: 'var(--radius-md)',
                background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)',
                fontSize: '0.72rem',
              }}>
                <BookOpen size={13} color="var(--theme-accent)" />
                <span style={{ fontWeight: 600, color: 'var(--theme-muted)' }}>Path:</span>
                {workspace.activePathSceneIds.map((sid, idx) => {
                  const s = workspace.scenes.find(scene => scene.id === sid);
                  const isCurrent = sid === activeScene.id;
                  return (
                    <React.Fragment key={sid}>
                      {idx > 0 && <ChevronRight size={11} style={{ color: 'var(--theme-muted)', opacity: 0.4 }} />}
                      <button
                        onClick={() => handleSelectScene(sid)}
                        style={{
                          background: 'none', border: 'none', cursor: 'pointer',
                          fontSize: '0.72rem', fontWeight: isCurrent ? 700 : 400,
                          color: isCurrent ? 'var(--theme-accent)' : 'var(--theme-muted)',
                          textDecoration: isCurrent ? 'underline' : 'none',
                          textUnderlineOffset: '3px',
                          transition: 'color 0.15s ease',
                          padding: '0.1rem 0.2rem',
                        }}
                      >
                        Ch. {s?.depth ?? idx + 1}
                      </button>
                    </React.Fragment>
                  );
                })}
              </div>
            )}

            {/* Error */}
            {error && (
              <div style={{
                padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)',
                background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.25)',
                color: '#fca5a5', fontSize: '0.78rem',
                display: 'flex', alignItems: 'center', gap: '0.5rem',
              }}>
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {/* Zen Mode Exit */}
            {isZenMode && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.68rem', fontFamily: 'monospace', color: 'var(--theme-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Zen Mode (ESC to exit)
                </span>
                <button
                  onClick={() => setIsZenMode(false)}
                  style={{
                    padding: '0.3rem 0.75rem', borderRadius: 'var(--radius-full)',
                    background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#fff', fontSize: '0.7rem', cursor: 'pointer',
                  }}
                >
                  Exit Zen
                </button>
              </div>
            )}

            <SceneReader
              scene={activeScene}
              story={workspace.story}
              isHistorical={isHistorical}
              totalScenes={workspace.scenes.length}
              streamingText={streamedText}
            />

            <FloatingChoiceDock
              choices={activeChoices}
              onSelectChoice={handleSelectChoice}
              isGenerating={isGenerating || isStreaming}
              generatingChoiceId={generatingChoiceId}
            />
          </div>
        )}
      </main>

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        story={workspace.story}
        activePathScenes={activePathScenes}
      />
    </div>
  );
};
