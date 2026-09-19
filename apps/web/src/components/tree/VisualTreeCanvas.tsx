import React, { useState, useRef, useMemo } from 'react';
import type { SceneDto, ChoiceDto } from '@plotweaver/shared';
import { computeTreeLayout } from './treeLayout.js';
import { ZoomIn, ZoomOut, RotateCcw, Sparkles, Check, MapPin } from 'lucide-react';

interface VisualTreeCanvasProps {
  scenes: SceneDto[];
  choices: ChoiceDto[];
  activeSceneId: string | null;
  activePathSceneIds: string[];
  rootSceneId: string | null;
  onSelectScene: (sceneId: string) => void;
}

export const VisualTreeCanvas: React.FC<VisualTreeCanvasProps> = ({
  scenes,
  choices,
  activeSceneId,
  activePathSceneIds,
  rootSceneId,
  onSelectScene,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  const layout = useMemo(() => {
    return computeTreeLayout(
      scenes,
      choices,
      activeSceneId,
      activePathSceneIds,
      rootSceneId
    );
  }, [scenes, choices, activeSceneId, activePathSceneIds, rootSceneId]);

  // Handle Drag / Pan
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only drag if clicking background, not interactive buttons
    if ((e.target as HTMLElement).closest('.tree-node-interactive')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoomIn = () => setZoom((z) => Math.min(1.8, Number((z + 0.15).toFixed(2))));
  const handleZoomOut = () => setZoom((z) => Math.max(0.4, Number((z - 0.15).toFixed(2))));
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 20, y: 20 });
  };


  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: '380px',
        backgroundColor: 'var(--theme-surface)',
        border: '1px solid var(--theme-border)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none',
        display: 'flex',
        flexDirection: 'column',
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Top Header / Legend Bar */}
      <div
        style={{
          position: 'absolute',
          top: 12,
          left: 16,
          right: 16,
          zIndex: 10,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            pointerEvents: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.4rem 0.85rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'rgba(10, 13, 20, 0.85)',
            backdropFilter: 'blur(8px)',
            border: '1px solid var(--theme-border)',
            fontSize: '0.8rem',
            color: 'var(--theme-text)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                backgroundColor: 'var(--theme-accent)',
                boxShadow: '0 0 8px var(--theme-accent)',
                display: 'inline-block',
              }}
            />
            <span style={{ fontWeight: 600 }}>Active Path</span>
          </div>

          <span style={{ color: 'var(--theme-border)' }}>|</span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', opacity: 0.65 }}>
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                backgroundColor: 'var(--theme-muted)',
                display: 'inline-block',
              }}
            />
            <span>Alternate Reality</span>
          </div>

          <span style={{ color: 'var(--theme-border)' }}>|</span>

          <span style={{ color: 'var(--theme-muted)' }}>
            Nodes: <strong style={{ color: 'var(--theme-text)' }}>{scenes.length}</strong>
          </span>
        </div>

        {/* Zoom & Navigation Controls */}
        <div
          style={{
            pointerEvents: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.25rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'rgba(10, 13, 20, 0.85)',
            backdropFilter: 'blur(8px)',
            border: '1px solid var(--theme-border)',
          }}
        >
          <button
            onClick={handleZoomIn}
            title="Zoom In"
            style={{
              background: 'transparent',
              color: 'var(--theme-text)',
              padding: '0.35rem',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ZoomIn size={16} />
          </button>
          <button
            onClick={handleZoomOut}
            title="Zoom Out"
            style={{
              background: 'transparent',
              color: 'var(--theme-text)',
              padding: '0.35rem',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ZoomOut size={16} />
          </button>
          <button
            onClick={handleReset}
            title="Recenter & Reset View"
            style={{
              background: 'transparent',
              color: 'var(--theme-text)',
              padding: '0.35rem',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <RotateCcw size={15} />
          </button>
        </div>
      </div>

      {/* SVG Canvas */}
      <svg
        style={{
          width: '100%',
          height: '100%',
          flex: 1,
        }}
      >
        <defs>
          {/* Active path glow filter */}
          <filter id="active-path-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Grid background pattern */}
          <pattern id="tree-grid" width="32" height="32" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="var(--theme-border)" opacity="0.35" />
          </pattern>
        </defs>

        {/* Ambient Grid */}
        <rect width="100%" height="100%" fill="url(#tree-grid)" />

        {/* Transformable Canvas Space */}
        <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
          {/* Edges (Curves) */}
          {layout.edges.map((edge) => {
            const midX = (edge.x1 + edge.x2) / 2;
            const pathD = `M ${edge.x1} ${edge.y1} C ${midX} ${edge.y1}, ${midX} ${edge.y2}, ${edge.x2} ${edge.y2}`;

            return (
              <g key={edge.id}>
                {/* Glow underlay for active edge */}
                {edge.isActive && (
                  <path
                    d={pathD}
                    fill="none"
                    stroke="var(--theme-accent)"
                    strokeWidth="6"
                    opacity="0.35"
                    filter="url(#active-path-glow)"
                  />
                )}
                {/* Main edge path */}
                <path
                  d={pathD}
                  fill="none"
                  stroke={edge.isActive ? 'var(--theme-accent)' : 'var(--theme-border)'}
                  strokeWidth={edge.isActive ? 3 : 1.75}
                  strokeDasharray={edge.isActive ? undefined : '5 4'}
                  opacity={edge.isActive ? 1 : 0.55}
                  strokeLinecap="round"
                  style={{
                    transition: 'stroke 0.3s ease, stroke-width 0.3s ease',
                  }}
                />

                {/* Edge midpoint archetype badge */}
                <circle
                  cx={midX}
                  cy={(edge.y1 + edge.y2) / 2}
                  r={edge.isActive ? 6 : 4}
                  fill={edge.isActive ? 'var(--theme-accent)' : 'var(--theme-surface-elevated)'}
                  stroke={edge.isActive ? 'var(--theme-bg)' : 'var(--theme-border)'}
                  strokeWidth={1.5}
                />
              </g>
            );
          })}

          {/* Nodes */}
          {layout.nodes.map((node) => {
            const isHovered = hoveredNodeId === node.id;
            const wordCount = node.scene.text ? node.scene.text.trim().split(/\s+/).length : 0;

            return (
              <foreignObject
                key={node.id}
                x={node.x}
                y={node.y}
                width={node.width}
                height={node.height}
                style={{ overflow: 'visible' }}
                onMouseEnter={() => setHoveredNodeId(node.id)}
                onMouseLeave={() => setHoveredNodeId(null)}
              >
                <div
                  className="tree-node-interactive"
                  onClick={() => onSelectScene(node.id)}
                  style={{
                    width: '100%',
                    height: '100%',
                    padding: '0.6rem 0.75rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: node.isActive
                      ? 'var(--theme-surface-elevated)'
                      : node.isInActivePath
                      ? 'rgba(26, 32, 48, 0.95)'
                      : 'rgba(17, 21, 32, 0.75)',
                    border: node.isActive
                      ? '2px solid var(--theme-accent)'
                      : node.isInActivePath
                      ? '1.5px solid var(--theme-accent)'
                      : '1px solid var(--theme-border)',
                    boxShadow: node.isActive
                      ? '0 0 20px var(--theme-glow), 0 8px 16px rgba(0,0,0,0.5)'
                      : isHovered
                      ? '0 6px 16px rgba(0,0,0,0.4), 0 0 10px var(--theme-glow)'
                      : '0 2px 8px rgba(0,0,0,0.25)',
                    opacity: node.isActive || node.isInActivePath ? 1 : isHovered ? 1 : 0.65,
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'all var(--transition-fast)',
                    transform: isHovered ? 'translateY(-2px)' : 'none',
                    backdropFilter: 'blur(6px)',
                  }}
                  title={`Depth: ${node.scene.depth} | Word count: ${wordCount} words\nClick to navigate / rewind focus here`}
                >
                  {/* Top Node Header */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.72rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      {node.isActive ? (
                        <span
                          style={{
                            color: 'var(--theme-accent)',
                            display: 'flex',
                            alignItems: 'center',
                            fontWeight: 700,
                          }}
                        >
                          <MapPin size={12} style={{ marginRight: 2 }} />
                          Scene {node.scene.depth === 0 ? '1 (Root)' : node.scene.depth + 1}
                        </span>
                      ) : (
                        <span style={{ color: 'var(--theme-muted)', fontWeight: 600 }}>
                          Scene {node.scene.depth === 0 ? '1 (Root)' : node.scene.depth + 1}
                        </span>
                      )}
                    </div>

                    {/* Status Badge */}
                    <div>
                      {node.isActive ? (
                        <span
                          style={{
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            padding: '0.15rem 0.4rem',
                            borderRadius: 'var(--radius-full)',
                            backgroundColor: 'var(--theme-accent)',
                            color: 'var(--theme-accent-contrast)',
                          }}
                        >
                          ACTIVE
                        </span>
                      ) : node.isInActivePath ? (
                        <span
                          style={{
                            fontSize: '0.65rem',
                            fontWeight: 600,
                            padding: '0.15rem 0.35rem',
                            borderRadius: 'var(--radius-full)',
                            backgroundColor: 'rgba(56, 189, 248, 0.15)',
                            color: 'var(--theme-accent)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '2px',
                          }}
                        >
                          <Check size={10} /> PATH
                        </span>
                      ) : (
                        <span
                          style={{
                            fontSize: '0.65rem',
                            fontWeight: 500,
                            color: 'var(--theme-muted)',
                          }}
                        >
                          ALT
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Scene Preview Snippet */}
                  <div
                    style={{
                      fontSize: '0.74rem',
                      color: node.isActive ? 'var(--theme-text)' : 'var(--theme-muted)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      lineHeight: 1.3,
                      fontStyle: 'italic',
                    }}
                  >
                    {node.scene.summary || node.scene.text.slice(0, 45) + '...'}
                  </div>

                  {/* Bottom Footer Details */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.68rem',
                      color: 'var(--theme-muted)',
                      borderTop: '1px solid rgba(255,255,255,0.06)',
                      paddingTop: '0.25rem',
                    }}
                  >
                    <span>{wordCount} words</span>

                    {node.unexploredChoicesCount > 0 && (
                      <span
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '2px',
                          color: 'var(--theme-accent)',
                          fontWeight: 600,
                        }}
                      >
                        <Sparkles size={10} />
                        {node.unexploredChoicesCount} options
                      </span>
                    )}
                  </div>
                </div>
              </foreignObject>
            );
          })}
        </g>
      </svg>

      {/* Bottom Hint */}
      <div
        style={{
          padding: '0.4rem 1rem',
          backgroundColor: 'rgba(10, 13, 20, 0.8)',
          borderTop: '1px solid var(--theme-border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.72rem',
          color: 'var(--theme-muted)',
          zIndex: 5,
        }}
      >
        <span>
          💡 <strong>Tip:</strong> Click any past scene node in the graph to rewind time and explore an alternate branch!
        </span>
        <span>Drag canvas to pan • Scroll to zoom</span>
      </div>
    </div>
  );
};
