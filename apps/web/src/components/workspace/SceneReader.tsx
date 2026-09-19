import React, { useState } from 'react';
import type { SceneDto, StoryDto } from '@plotweaver/shared';
import { BookOpen, Clock, FileText, History, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

interface SceneReaderProps {
  scene: SceneDto;
  story: StoryDto;
  isHistorical: boolean;
  totalScenes: number;
  streamingText?: string | null;
}

export const SceneReader: React.FC<SceneReaderProps> = ({
  scene,
  story,
  isHistorical,
  totalScenes,
  streamingText,
}) => {
  const [showSummary, setShowSummary] = useState(false);

  const displayText = streamingText !== null && streamingText !== undefined ? streamingText : scene.text;
  const wordCount = displayText ? displayText.trim().split(/\s+/).filter(Boolean).length : 0;
  const readingMinutes = Math.max(1, Math.ceil(wordCount / 200));

  const paragraphs = displayText
    .split(/\n\s*\n/)
    .map(p => p.trim())
    .filter(p => p.length > 0);

  return (
    <article style={{
      position: 'relative',
      width: '100%',
      borderRadius: 'var(--radius-lg)',
      background: 'rgba(255, 255, 255, 0.025)',
      border: '1px solid rgba(255, 255, 255, 0.06)',
      padding: '1.75rem 2rem',
      backdropFilter: 'blur(16px)',
      transition: 'all 0.3s ease',
      animation: 'fadeIn 0.4s ease-out forwards',
    }}>
      {/* Historical Rewind Banner */}
      {isHistorical && (
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.6rem',
          padding: '0.85rem 1rem',
          marginBottom: '1.25rem',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(245, 158, 11, 0.08)',
          border: '1px solid rgba(245, 158, 11, 0.2)',
          color: '#fbbf24',
          fontSize: '0.75rem',
          lineHeight: 1.5,
        }}>
          <History size={16} style={{ flexShrink: 0, marginTop: '1px', color: '#f59e0b' }} />
          <div>
            <span style={{ fontWeight: 700, color: '#fcd34d' }}>Time-Travel Rewind: </span>
            You are viewing historical decision point{' '}
            <strong>Chapter {scene.depth}</strong>. Choose below to branch into a new alternate
            reality without erasing existing paths.
          </div>
        </div>
      )}

      {/* Reader Toolbar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: '1rem',
        marginBottom: '1.25rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        gap: '0.5rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.25rem 0.6rem',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            fontSize: '0.7rem',
            fontWeight: 600,
            color: 'var(--theme-accent)',
          }}>
            <BookOpen size={12} />
            Chapter {scene.depth} of {totalScenes}
          </span>

          <span style={{
            padding: '0.2rem 0.5rem',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(168, 85, 247, 0.1)',
            border: '1px solid rgba(168, 85, 247, 0.2)',
            fontSize: '0.62rem',
            fontWeight: 600,
            color: '#c4b5fd',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}>
            {story.genre}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.7rem', color: 'var(--theme-muted)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <FileText size={12} /> {wordCount} words
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Clock size={12} /> {readingMinutes} min
          </span>
        </div>
      </div>

      {/* Title */}
      <header style={{ marginBottom: '1.25rem' }}>
        <h1 style={{
          fontSize: 'clamp(1.3rem, 3vw, 1.75rem)',
          fontWeight: 700,
          letterSpacing: '-0.02em',
          color: '#fff',
          fontFamily: 'var(--theme-font-family)',
          marginBottom: '0.3rem',
          lineHeight: 1.2,
        }}>
          {story.title}
        </h1>
        <p style={{
          fontSize: '0.72rem',
          color: 'var(--theme-muted)',
          fontStyle: 'italic',
        }}>
          Tone: {story.tone} • Branch Depth: {scene.depth}
        </p>
      </header>

      {/* Prose Body */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        color: 'rgba(255, 255, 255, 0.88)',
        fontSize: '1.05rem',
        lineHeight: 1.75,
        fontFamily: 'var(--theme-font-family)',
        letterSpacing: '0.01em',
        maxWidth: '65ch',
      }}>
        {paragraphs.map((p, idx) => (
          <p key={idx} style={{
            margin: 0,
          }}>
            {idx === 0 && (
              <span style={{
                float: 'left',
                fontSize: '3.5rem',
                fontWeight: 700,
                lineHeight: 0.85,
                marginRight: '0.4rem',
                marginTop: '0.15rem',
                color: 'var(--theme-accent)',
                fontFamily: 'var(--theme-font-family)',
              }}>
                {p.charAt(0)}
              </span>
            )}
            {idx === 0 ? p.slice(1) : p}
          </p>
        ))}

        {/* Streaming Cursor */}
        {streamingText !== null && streamingText !== undefined && (
          <span style={{
            display: 'inline-block',
            width: '3px',
            height: '1.1em',
            marginLeft: '2px',
            backgroundColor: 'var(--theme-accent)',
            animation: 'typewriterBlink 0.8s ease-in-out infinite',
            verticalAlign: 'middle',
          }} />
        )}
      </div>

      {/* Summary Expander */}
      {scene.summary && (
        <div style={{ marginTop: '1.5rem', paddingTop: '0.85rem', borderTop: '1px solid rgba(255, 255, 255, 0.04)' }}>
          <button
            onClick={() => setShowSummary(!showSummary)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.72rem',
              fontWeight: 600,
              color: 'var(--theme-muted)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.3rem 0',
              transition: 'color 0.15s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--theme-muted)'; }}
          >
            <Sparkles size={12} color="var(--theme-accent)" />
            <span>AI Narrative Synthesis</span>
            {showSummary ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>

          {showSummary && (
            <div style={{
              marginTop: '0.5rem',
              padding: '0.85rem 1rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(0, 0, 0, 0.25)',
              border: '1px solid rgba(255, 255, 255, 0.04)',
              fontSize: '0.78rem',
              color: 'rgba(255, 255, 255, 0.6)',
              lineHeight: 1.55,
              fontStyle: 'italic',
              animation: 'fadeIn 0.2s ease-out forwards',
            }}>
              "{scene.summary}"
            </div>
          )}
        </div>
      )}
    </article>
  );
};
