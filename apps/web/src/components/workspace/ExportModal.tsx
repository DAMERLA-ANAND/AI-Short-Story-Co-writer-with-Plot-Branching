import React, { useState } from 'react';
import type { StoryDto, SceneDto } from '@plotweaver/shared';
import { getExportUrl } from '../../api/snapshots.js';
import {
  X,
  FileText,
  FileDown,
  Sparkles,
  ShieldCheck,
  Loader2,
} from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  story: StoryDto;
  activePathScenes: SceneDto[];
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  story,
  activePathScenes,
}) => {
  const [downloadingFormat, setDownloadingFormat] = useState<'markdown' | 'pdf' | null>(null);

  if (!isOpen) return null;

  // Compute word count
  const totalWords = activePathScenes.reduce((sum, s) => {
    return sum + (s.text ? s.text.trim().split(/\s+/).filter(Boolean).length : 0);
  }, 0);

  const readingMinutes = Math.max(1, Math.ceil(totalWords / 200));

  const handleDownload = (format: 'markdown' | 'pdf') => {
    setDownloadingFormat(format);
    const url = getExportUrl(story.id, format);

    // Create hidden anchor to trigger clean browser download
    const link = document.createElement('a');
    link.href = url;
    link.download = '';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      setDownloadingFormat(null);
    }, 1200);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '580px',
          backgroundColor: 'var(--theme-surface)',
          border: '1px solid var(--theme-border)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 25px 50px rgba(0,0,0,0.6), 0 0 30px var(--theme-glow)',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          color: 'var(--theme-text)',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--theme-accent)',
                letterSpacing: '0.04em',
                marginBottom: '0.35rem',
              }}
            >
              <Sparkles size={13} />
              <span>DIRECTOR'S CUT MANUSCRIPT EXPORT</span>
            </div>
            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                fontFamily: 'var(--theme-font-family)',
                letterSpacing: '-0.01em',
              }}
            >
              Export "{story.title}"
            </h2>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              color: 'var(--theme-muted)',
              padding: '0.35rem',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Path Overview Statistics */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            padding: '0.85rem 1rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--theme-surface-elevated)',
            border: '1px solid var(--theme-border)',
            fontSize: '0.82rem',
            color: 'var(--theme-muted)',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: 'var(--theme-text)', fontWeight: 700, fontSize: '1rem' }}>
              {activePathScenes.length}
            </div>
            <div>Compiled Scenes</div>
          </div>
          <div style={{ width: 1, height: 24, backgroundColor: 'var(--theme-border)' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: 'var(--theme-text)', fontWeight: 700, fontSize: '1rem' }}>
              ~{totalWords}
            </div>
            <div>Total Words</div>
          </div>
          <div style={{ width: 1, height: 24, backgroundColor: 'var(--theme-border)' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: 'var(--theme-text)', fontWeight: 700, fontSize: '1rem' }}>
              ~{readingMinutes} min
            </div>
            <div>Reading Time</div>
          </div>
        </div>

        {/* Format Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {/* PDF Option */}
          <div
            style={{
              padding: '1.15rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--theme-surface-elevated)',
              border: '1px solid var(--theme-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#f87171',
                  flexShrink: 0,
                }}
              >
                <FileDown size={22} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--theme-text)' }}>
                  Publication-Ready PDF
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--theme-muted)', lineHeight: 1.35 }}>
                  Typeset with Title Page block, running headers & footers, and smooth scene dividers.
                </div>
              </div>
            </div>

            <button
              onClick={() => handleDownload('pdf')}
              disabled={downloadingFormat !== null}
              style={{
                padding: '0.65rem 1.1rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--theme-accent)',
                color: 'var(--theme-accent-contrast)',
                fontSize: '0.84rem',
                fontWeight: 700,
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                boxShadow: '0 0 15px var(--theme-glow)',
              }}
            >
              {downloadingFormat === 'pdf' ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <FileDown size={14} />
                  Download PDF
                </>
              )}
            </button>
          </div>

          {/* Markdown Option */}
          <div
            style={{
              padding: '1.15rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--theme-surface-elevated)',
              border: '1px solid var(--theme-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(56, 189, 248, 0.15)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--theme-accent)',
                  flexShrink: 0,
                }}
              >
                <FileText size={22} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--theme-text)' }}>
                  Clean Markdown (.md)
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--theme-muted)', lineHeight: 1.35 }}>
                  Pure narrative prose with title block and transitions. Ideal for Notion or Obsidian.
                </div>
              </div>
            </div>

            <button
              onClick={() => handleDownload('markdown')}
              disabled={downloadingFormat !== null}
              style={{
                padding: '0.65rem 1.1rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--theme-surface)',
                border: '1px solid var(--theme-border)',
                color: 'var(--theme-text)',
                fontSize: '0.84rem',
                fontWeight: 600,
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              {downloadingFormat === 'markdown' ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Compiling...
                </>
              ) : (
                <>
                  <FileText size={14} />
                  Download MD
                </>
              )}
            </button>
          </div>
        </div>

        {/* Invariant 10 Guarantee Note */}
        <div
          style={{
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'rgba(56, 189, 248, 0.08)',
            border: '1px solid rgba(56, 189, 248, 0.2)',
            fontSize: '0.76rem',
            color: 'var(--theme-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            lineHeight: 1.4,
          }}
        >
          <ShieldCheck size={16} color="var(--theme-accent)" style={{ flexShrink: 0 }} />
          <div>
            <strong>Clean Export Guarantee:</strong> Only your chosen path is stitched together. All choice prompts, branch IDs, and system directives are cleanly stripped so your manuscript reads as a complete short story.
          </div>
        </div>
      </div>
    </div>
  );
};
